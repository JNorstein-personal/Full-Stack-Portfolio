const {
  createHash,
} = require("node:crypto");

const {
  normalizeInvitationCode,
} = require("../rsvp/invitationCode");
const {
  buildDeliveryRecord,
} = require("./deliveryRecord");
const {
  isRsvpClosed,
} = require("../rsvp/deadline");
const {
  normalizeTransportStatus,
} = require("./emailTransport");
const {
  parseConfirmation,
  validateInitialChanges,
  validateRevisionChanges,
} = require("../validation/submit");

const RSVP_ASSISTANCE_EMAIL =
  "RSVPhelp@loreweavercreations.com";

const INCOMPLETE_SUBMISSION_STATES =
  new Set([
    "prepared",
    "stored",
    "deliveryStarted",
  ]);

function stableStringify(value) {
  if (Array.isArray(value)) {
    return `[${value
      .map(stableStringify)
      .join(",")}]`;
  }

  if (
    value !== null &&
    typeof value === "object"
  ) {
    return `{${Object.keys(value)
      .sort()
      .map(
        (key) =>
          `${JSON.stringify(key)}:${stableStringify(
            value[key],
          )}`,
      )
      .join(",")}}`;
  }

  return JSON.stringify(value);
}

function fingerprintRequest(
  request,
) {
  const changes = JSON.parse(
    JSON.stringify(
      request.changes,
    ),
  );

  const eventValue =
    changes.eventAttendance &&
    changes.eventAttendance
      .operation === "replace" &&
    Array.isArray(
      changes.eventAttendance
        .value,
    )
      ? changes.eventAttendance
          .value
      : null;

  if (
    eventValue &&
    eventValue.length === 2 &&
    eventValue.includes(
      "ceremony",
    ) &&
    eventValue.includes(
      "reception",
    )
  ) {
    changes.eventAttendance.value =
      [
        "ceremony",
        "reception",
      ];
  }

  return createHash("sha256")
    .update(
      stableStringify({
        confirmation:
          request.confirmation,
        changes,
      }),
    )
    .digest("hex");
}

function createMutationId(
  submissionKey,
) {
  return createHash("sha256")
    .update(submissionKey)
    .digest("hex");
}

function normalizeDeliveryResult(
  delivery,
) {
  return Object.freeze({
    guestDeliveryStatus:
      normalizeTransportStatus(
        delivery &&
          delivery
            .guestDeliveryStatus,
      ),
    administrativeDeliveryStatus:
      normalizeTransportStatus(
        delivery &&
          delivery
            .administrativeDeliveryStatus,
      ),
  });
}

function buildGuestRsvp(
  storedRsvp,
  invitation,
) {
  const guestRsvp = {
    eventAttendance:
      storedRsvp
        .eventAttendance,
  };

  if (
    storedRsvp
      .additionalGuestResponses
  ) {
    guestRsvp
      .additionalGuestResponses =
      invitation
        .additionalGuestAllocations
        .map(
          (allocation) => ({
            id: allocation.id,
            prompt:
              allocation.prompt,
            response:
              storedRsvp
                .additionalGuestResponses[
                allocation.id
              ],
          }),
        );
  }

  if (
    storedRsvp
      .attendanceTotals
  ) {
    guestRsvp.attendanceTotals =
      storedRsvp
        .attendanceTotals;
    guestRsvp.overallAttendance =
      storedRsvp
        .overallAttendance;
  }

  if (
    storedRsvp
      .receptionAttendeeDetails
  ) {
    guestRsvp
      .receptionAttendeeDetails =
      storedRsvp
        .receptionAttendeeDetails;
  }

  return guestRsvp;
}

function buildSuccessResponse({
  invitation,
  storedRsvp,
  confirmation,
  recordedAt,
  delivery,
  action,
  idempotentRepeat,
}) {
  const deliveryWarning =
    delivery.guestDeliveryStatus !==
      "sent" ||
    delivery
      .administrativeDeliveryStatus !==
      "sent";

  return {
    submission: {
      recorded: true,
      action,
      idempotentRepeat,
      recordedAt,
    },
    invitation: {
      partyDisplayName:
        invitation
          .partyDisplayName,
      wordingMode:
        invitation.wordingMode,
    },
    rsvp: buildGuestRsvp(
      storedRsvp,
      invitation,
    ),
    confirmation: {
      method:
        confirmation.method,
      guestDeliveryStatus:
        delivery
          .guestDeliveryStatus,
      administrativeDeliveryStatus:
        delivery
          .administrativeDeliveryStatus,
      deliveryWarning,
    },
    revisionPolicy: {
      mayRevise: true,
      deadline:
        storedRsvp.deadline,
      timeZone:
        storedRsvp.timeZone,
      assistanceEmail:
        RSVP_ASSISTANCE_EMAIL,
    },
  };
}

function markIdempotentRepeat(
  response,
) {
  return {
    ...response,
    submission: {
      ...response.submission,
      idempotentRepeat: true,
    },
  };
}

function deliveryFromRecord(
  record,
) {
  return normalizeDeliveryResult({
    guestDeliveryStatus:
      record &&
      record.guest &&
      record.guest.status,
    administrativeDeliveryStatus:
      record &&
      record.administrative &&
      record.administrative.status,
  });
}

function isCompleteSubmissionRecord(
  record,
) {
  return Boolean(
    record &&
      record.response &&
      (
        record.state ===
          "complete" ||
        record.state ===
          undefined
      ),
  );
}

function assertRecoverableLifecycle(
  record,
  partyId,
) {
  if (
    !record ||
    record.partyId !== partyId ||
    !INCOMPLETE_SUBMISSION_STATES
      .has(record.state) ||
    typeof record.mutationId !==
      "string" ||
    !record.storedRsvp ||
    !Number.isInteger(
      record.expectedCurrentVersion,
    ) ||
    !(
      record.action ===
        "initial" ||
      record.action ===
        "revision"
    ) ||
    typeof record.recordedAt !==
      "string"
  ) {
    throw new Error(
      "RSVP submission lifecycle record is not recoverable.",
    );
  }

  return record;
}

function createRsvpSubmissionService({
  invitationService,
  rsvpStore,
  deliveryService,
  environment,
  now = () => new Date(),
}) {
  if (
    !invitationService ||
    !rsvpStore ||
    !deliveryService ||
    !environment
  ) {
    throw new Error(
      "RSVP submission service requires invitation, storage, delivery, and environment dependencies.",
    );
  }

  const partyLocks =
    new Map();

  async function withPartyLock(
    partyId,
    work,
  ) {
    const previous =
      partyLocks.get(
        partyId,
      ) ||
      Promise.resolve();

    let release;
    const gate =
      new Promise((resolve) => {
        release = resolve;
      });
    const tail =
      previous.then(
        () => gate,
      );

    partyLocks.set(
      partyId,
      tail,
    );

    await previous;

    try {
      return await work();
    } finally {
      release();

      if (
        partyLocks.get(
          partyId,
        ) === tail
      ) {
        partyLocks.delete(
          partyId,
        );
      }
    }
  }

  async function finalizeLifecycle({
    submissionKey,
    lifecycle,
    invitation,
    delivery,
    isReplay,
  }) {
    const canonicalResponse =
      buildSuccessResponse({
        invitation,
        storedRsvp:
          lifecycle.storedRsvp,
        confirmation:
          lifecycle
            .storedRsvp
            .confirmation,
        recordedAt:
          lifecycle.recordedAt,
        delivery,
        action:
          lifecycle.action,
        idempotentRepeat:
          false,
      });

    await rsvpStore
      .setSubmissionRecord(
        submissionKey,
        {
          fingerprint:
            lifecycle.fingerprint,
          partyId:
            lifecycle.partyId,
          state: "complete",
          mutationId:
            lifecycle.mutationId,
          response:
            canonicalResponse,
        },
      );

    return {
      status: "success",
      httpStatus:
        isReplay
          ? 200
          : lifecycle.action ===
              "initial"
            ? 201
            : 200,
      response:
        isReplay
          ? markIdempotentRepeat(
              canonicalResponse,
            )
          : canonicalResponse,
    };
  }

  async function recoverDelivery({
    submissionKey,
    lifecycle,
    invitation,
    isReplay,
  }) {
    const deliveryRecords =
      await rsvpStore
        .listDeliveryRecords(
          lifecycle.partyId,
        );

    const existing =
      [...deliveryRecords]
        .reverse()
        .find(
          (record) =>
            record.mutationId ===
            lifecycle.mutationId,
        );

    let delivery;

    if (existing) {
      delivery =
        deliveryFromRecord(
          existing,
        );
    } else {
      delivery =
        normalizeDeliveryResult(
          null,
        );

      await rsvpStore
        .appendDeliveryRecord(
          lifecycle.partyId,
          buildDeliveryRecord({
            recordedAt:
              lifecycle.recordedAt,
            action:
              lifecycle.action,
            version:
              lifecycle
                .storedRsvp
                .version,
            mutationId:
              lifecycle.mutationId,
            confirmation:
              lifecycle
                .storedRsvp
                .confirmation,
            administrativeEmail:
              environment
                .RSVP_ADMIN_NOTIFICATION_EMAIL,
            delivery,
          }),
        );
    }

    return finalizeLifecycle({
      submissionKey,
      lifecycle,
      invitation,
      delivery,
      isReplay,
    });
  }

  async function continueLifecycle({
    submissionKey,
    lifecycle,
    invitation,
    isReplay,
  }) {
    let active =
      assertRecoverableLifecycle(
        lifecycle,
        invitation.partyId,
      );

    if (
      active.state ===
      "prepared"
    ) {
      await rsvpStore
        .commitRsvpMutation(
          active.partyId,
          {
            expectedCurrentVersion:
              active
                .expectedCurrentVersion,
            mutationId:
              active.mutationId,
            currentRsvp:
              active.storedRsvp,
            versionRecord: {
              action:
                active.action,
              mutationId:
                active.mutationId,
              ...active
                .storedRsvp,
            },
          },
        );

      active = {
        ...active,
        state: "stored",
      };

      await rsvpStore
        .setSubmissionRecord(
          submissionKey,
          active,
        );
    }

    if (
      active.state ===
      "deliveryStarted"
    ) {
      return recoverDelivery({
        submissionKey,
        lifecycle: active,
        invitation,
        isReplay,
      });
    }

    if (
      active.state !==
      "stored"
    ) {
      throw new Error(
        "RSVP submission lifecycle entered an unsupported state.",
      );
    }

    active = {
      ...active,
      state:
        "deliveryStarted",
    };

    await rsvpStore
      .setSubmissionRecord(
        submissionKey,
        active,
      );

    let delivery;

    try {
      delivery =
        normalizeDeliveryResult(
          await deliveryService
            .deliver({
              invitation,
              rsvp:
                active.storedRsvp,
              confirmation:
                active
                  .storedRsvp
                  .confirmation,
              action:
                active.action,
            }),
        );
    } catch {
      delivery =
        normalizeDeliveryResult(
          null,
        );
    }

    await rsvpStore
      .appendDeliveryRecord(
        active.partyId,
        buildDeliveryRecord({
          recordedAt:
            active.recordedAt,
          action:
            active.action,
          version:
            active
              .storedRsvp
              .version,
          mutationId:
            active.mutationId,
          confirmation:
            active
              .storedRsvp
              .confirmation,
          administrativeEmail:
            environment
              .RSVP_ADMIN_NOTIFICATION_EMAIL,
          delivery,
        }),
      );

    return finalizeLifecycle({
      submissionKey,
      lifecycle: active,
      invitation,
      delivery,
      isReplay,
    });
  }

  async function submitForInvitation(
    request,
    invitation,
    fingerprint,
    submissionKey,
  ) {
    const priorSubmission =
      await rsvpStore
        .getSubmissionRecord(
          submissionKey,
        );

    if (priorSubmission) {
      if (
        priorSubmission
          .fingerprint !==
        fingerprint
      ) {
        return {
          status:
            "badRequest",
        };
      }

      if (
        isCompleteSubmissionRecord(
          priorSubmission,
        )
      ) {
        return {
          status:
            "success",
          httpStatus: 200,
          response:
            markIdempotentRepeat(
              priorSubmission
                .response,
            ),
        };
      }

      return continueLifecycle({
        submissionKey,
        lifecycle:
          priorSubmission,
        invitation,
        isReplay: true,
      });
    }

    const partySubmissions =
      await rsvpStore
        .listSubmissionRecordsForParty(
          invitation.partyId,
        );

    if (
      partySubmissions.some(
        (record) =>
          record &&
          INCOMPLETE_SUBMISSION_STATES
            .has(record.state),
      )
    ) {
      return {
        status:
          "unavailable",
      };
    }

    if (
      isRsvpClosed(
        environment
          .RSVP_DEADLINE,
        now(),
      )
    ) {
      return {
        status: "closed",
      };
    }

    const confirmation =
      parseConfirmation(
        request.confirmation,
        {
          email: true,
          textMessage:
            environment
              .RSVP_SMS_ENABLED ===
            true,
          smsAuthorizationRequired:
            environment
              .RSVP_SMS_ENABLED ===
            true,
        },
      );

    if (!confirmation.ok) {
      return {
        status:
          confirmation.status ===
          403
            ? "forbidden"
            : "badRequest",
      };
    }

    const current =
      await rsvpStore
        .getCurrentRsvp(
          invitation.partyId,
        );

    const action =
      current
        ? "revision"
        : "initial";

    const substantive =
      current
        ? validateRevisionChanges(
            request.changes,
            invitation,
            current,
          )
        : validateInitialChanges(
            request.changes,
            invitation,
          );

    if (!substantive.ok) {
      return {
        status:
          substantive.status ===
          403
            ? "forbidden"
            : "badRequest",
      };
    }

    const recordedAt =
      now().toISOString();
    const expectedCurrentVersion =
      current
        ? current.version
        : 0;

    const storedRsvp = {
      ...substantive.value,
      confirmation:
        confirmation.value,
      recordedAt,
      deadline:
        environment
          .RSVP_DEADLINE,
      timeZone:
        environment
          .RSVP_TIME_ZONE,
      version:
        expectedCurrentVersion +
        1,
    };

    const lifecycle = {
      fingerprint,
      partyId:
        invitation.partyId,
      state: "prepared",
      mutationId:
        createMutationId(
          submissionKey,
        ),
      action,
      recordedAt,
      expectedCurrentVersion,
      storedRsvp,
    };

    await rsvpStore
      .setSubmissionRecord(
        submissionKey,
        lifecycle,
      );

    return continueLifecycle({
      submissionKey,
      lifecycle,
      invitation,
      isReplay: false,
    });
  }

  return Object.freeze({
    async submit(request) {
      const normalized =
        normalizeInvitationCode(
          request.inviteCode,
        );

      if (!normalized) {
        return {
          status:
            "badRequest",
        };
      }

      const invitationResult =
        await invitationService.lookup(
          request.inviteCode,
        );

      if (
        invitationResult.status ===
        "malformed"
      ) {
        return {
          status:
            "badRequest",
        };
      }

      if (
        invitationResult.status ===
        "notFound"
      ) {
        return {
          status:
            "forbidden",
        };
      }

      const invitation =
        invitationResult.invitation;
      const fingerprint =
        fingerprintRequest(
          request,
        );
      const submissionKey =
        `${invitation.partyId}:${request.clientSubmissionId}`;

      return withPartyLock(
        invitation.partyId,
        () =>
          submitForInvitation(
            request,
            invitation,
            fingerprint,
            submissionKey,
          ),
      );
    },
  });
}

module.exports = {
  RSVP_ASSISTANCE_EMAIL,
  buildGuestRsvp,
  createMutationId,
  createRsvpSubmissionService,
  fingerprintRequest,
  normalizeDeliveryResult,
};
