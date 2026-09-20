const { z } = require("zod");

const TOP_LEVEL_KEYS =
  Object.freeze([
    "inviteCode",
    "clientSubmissionId",
    "confirmation",
    "changes",
  ]);

const SUBSTANTIVE_REGION_IDS =
  Object.freeze([
    "eventAttendance",
    "additionalGuestResponses",
    "attendanceTotals",
    "receptionAttendeeDetails",
  ]);

const ATTENDANCE_TOTAL_KEYS =
  Object.freeze([
    "adults21Plus",
    "youngAdults18To20",
    "children3To17",
    "childrenUnder3",
  ]);

const uuidSchema =
  z.string().uuid();

const emailSchema =
  z.string().email();

const mobileSchema =
  z.string().regex(
    /^\+[1-9]\d{7,14}$/,
  );

function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

function hasExactKeys(
  value,
  expectedKeys,
) {
  if (!isPlainObject(value)) {
    return false;
  }

  const keys = Object.keys(value);

  return (
    keys.length ===
      expectedKeys.length &&
    expectedKeys.every(
      (key) =>
        Object.prototype
          .hasOwnProperty.call(
            value,
            key,
          ),
    )
  );
}

function invalid(
  status,
  reason,
) {
  return Object.freeze({
    ok: false,
    status,
    reason,
  });
}

function valid(value) {
  return Object.freeze({
    ok: true,
    value,
  });
}

function parseSubmitRequest(body) {
  if (
    !hasExactKeys(
      body,
      TOP_LEVEL_KEYS,
    ) ||
    !uuidSchema.safeParse(
      body.clientSubmissionId,
    ).success ||
    !isPlainObject(
      body.confirmation,
    ) ||
    !isPlainObject(body.changes)
  ) {
    return invalid(
      400,
      "malformed-request",
    );
  }

  return valid(
    Object.freeze({
      inviteCode:
        body.inviteCode,
      clientSubmissionId:
        body.clientSubmissionId,
      confirmation:
        body.confirmation,
      changes: body.changes,
    }),
  );
}

function parseConfirmation(
  confirmation,
  confirmationOptions,
) {
  if (
    !isPlainObject(
      confirmationOptions,
    )
  ) {
    return invalid(
      400,
      "invalid-confirmation-options",
    );
  }

  if (
    confirmation.method ===
    "email"
  ) {
    if (
      !hasExactKeys(
        confirmation,
        [
          "method",
          "email",
        ],
      ) ||
      !emailSchema.safeParse(
        confirmation.email,
      ).success
    ) {
      return invalid(
        400,
        "invalid-confirmation",
      );
    }

    return valid(
      Object.freeze({
        method: "email",
        email:
          confirmation.email,
      }),
    );
  }

  if (
    confirmation.method ===
    "textMessage"
  ) {
    if (
      confirmationOptions
        .textMessage !== true
    ) {
      return invalid(
        403,
        "confirmation-channel-not-authorized",
      );
    }

    const authorizationRequired =
      confirmationOptions
        .smsAuthorizationRequired ===
      true;

    const expectedKeys =
      authorizationRequired
        ? [
            "method",
            "mobile",
            "smsAuthorization",
          ]
        : [
            "method",
            "mobile",
          ];

    if (
      !hasExactKeys(
        confirmation,
        expectedKeys,
      ) ||
      !mobileSchema.safeParse(
        confirmation.mobile,
      ).success ||
      (
        authorizationRequired &&
        confirmation
          .smsAuthorization !==
          true
      )
    ) {
      return invalid(
        400,
        "invalid-confirmation",
      );
    }

    return valid(
      Object.freeze({
        method:
          "textMessage",
        mobile:
          confirmation.mobile,
        ...(authorizationRequired
          ? {
              smsAuthorization:
                true,
            }
          : {}),
      }),
    );
  }

  return invalid(
    400,
    "invalid-confirmation",
  );
}

function parseReplaceOperation(
  operation,
) {
  if (!isPlainObject(operation)) {
    return invalid(
      400,
      "invalid-operation",
    );
  }

  if (
    operation.operation ===
    "clear"
  ) {
    return invalid(
      403,
      "operation-not-authorized",
    );
  }

  if (
    operation.operation !==
      "replace" ||
    !Object.prototype
      .hasOwnProperty.call(
        operation,
        "value",
      ) ||
    Object.keys(operation)
      .some(
        (key) =>
          key !== "operation" &&
          key !== "value",
      )
  ) {
    return invalid(
      400,
      "invalid-operation",
    );
  }

  return valid(operation.value);
}

function parseEventAttendance(
  operation,
) {
  const parsed =
    parseReplaceOperation(
      operation,
    );

  if (!parsed.ok) {
    return parsed;
  }

  const values = parsed.value;

  if (
    !Array.isArray(values) ||
    values.length < 1 ||
    values.length > 2 ||
    values.some(
      (value) =>
        ![
          "ceremony",
          "reception",
          "decline",
        ].includes(value),
    ) ||
    new Set(values).size !==
      values.length
  ) {
    return invalid(
      400,
      "invalid-attendance",
    );
  }

  const selected =
    new Set(values);

  if (
    selected.has("decline") &&
    selected.size !== 1
  ) {
    return invalid(
      400,
      "invalid-attendance",
    );
  }

  if (
    !selected.has("decline") &&
    !selected.has("ceremony") &&
    !selected.has("reception")
  ) {
    return invalid(
      400,
      "invalid-attendance",
    );
  }

  const normalized =
    selected.has("decline")
      ? ["decline"]
      : [
          ...(selected.has(
            "ceremony",
          )
            ? ["ceremony"]
            : []),
          ...(selected.has(
            "reception",
          )
            ? ["reception"]
            : []),
        ];

  return valid(
    Object.freeze(normalized),
  );
}

function parseAttendanceTotals(
  operation,
  maximumAttendance,
) {
  const parsed =
    parseReplaceOperation(
      operation,
    );

  if (!parsed.ok) {
    return parsed;
  }

  if (
    !hasExactKeys(
      parsed.value,
      ATTENDANCE_TOTAL_KEYS,
    )
  ) {
    return invalid(
      400,
      "invalid-attendance-totals",
    );
  }

  const totals = {};

  for (
    const key of
    ATTENDANCE_TOTAL_KEYS
  ) {
    const value =
      parsed.value[key];

    if (
      !Number.isInteger(value) ||
      value < 0
    ) {
      return invalid(
        400,
        "invalid-attendance-totals",
      );
    }

    totals[key] = value;
  }

  const overallAttendance =
    ATTENDANCE_TOTAL_KEYS.reduce(
      (sum, key) =>
        sum + totals[key],
      0,
    );

  if (
    overallAttendance < 1 ||
    overallAttendance >
      maximumAttendance
  ) {
    return invalid(
      400,
      "invalid-attendance-total",
    );
  }

  return valid(
    Object.freeze({
      attendanceTotals:
        Object.freeze(totals),
      overallAttendance,
    }),
  );
}

function parseAdditionalGuestResponses(
  operation,
  allocations,
) {
  if (allocations.length === 0) {
    if (operation !== undefined) {
      return invalid(
        403,
        "additional-guests-not-authorized",
      );
    }

    return valid(undefined);
  }

  if (operation === undefined) {
    return invalid(
      400,
      "missing-additional-guest-responses",
    );
  }

  const parsed =
    parseReplaceOperation(
      operation,
    );

  if (!parsed.ok) {
    return parsed;
  }

  if (!isPlainObject(parsed.value)) {
    return invalid(
      400,
      "invalid-additional-guest-responses",
    );
  }

  const authorizedIds =
    new Set(
      allocations.map(
        (allocation) =>
          allocation.id,
      ),
    );

  for (
    const suppliedId of
    Object.keys(parsed.value)
  ) {
    if (
      !authorizedIds.has(
        suppliedId,
      )
    ) {
      return invalid(
        403,
        "allocation-not-authorized",
      );
    }
  }

  if (
    Object.keys(parsed.value)
      .length !==
    allocations.length
  ) {
    return invalid(
      400,
      "incomplete-additional-guest-responses",
    );
  }

  const responses = {};

  for (
    const allocation of
    allocations
  ) {
    const response =
      parsed.value[
        allocation.id
      ];

    if (
      response !== "yes" &&
      response !== "no"
    ) {
      return invalid(
        400,
        "invalid-additional-guest-response",
      );
    }

    responses[
      allocation.id
    ] = response;
  }

  return valid(
    Object.freeze(responses),
  );
}

function parseReceptionAttendeeDetails(
  operation,
  overallAttendance,
) {
  if (operation === undefined) {
    return invalid(
      400,
      "missing-reception-attendee-details",
    );
  }

  const parsed =
    parseReplaceOperation(
      operation,
    );

  if (!parsed.ok) {
    return parsed;
  }

  if (
    !Array.isArray(parsed.value) ||
    parsed.value.length !==
      overallAttendance
  ) {
    return invalid(
      400,
      "invalid-reception-attendee-details",
    );
  }

  const details = [];

  for (
    const entry of
    parsed.value
  ) {
    if (
      !isPlainObject(entry) ||
      Object.keys(entry)
        .some(
          (key) =>
            key !==
              "attendeeName" &&
            key !==
              "dietaryPreferences",
        ) ||
      typeof entry.attendeeName !==
        "string" ||
      entry.attendeeName.trim() ===
        "" ||
      entry.attendeeName.length >
        100 ||
      (
        entry.dietaryPreferences !==
          undefined &&
        (
          typeof entry
            .dietaryPreferences !==
            "string" ||
          entry
            .dietaryPreferences
            .length > 1000
        )
      )
    ) {
      return invalid(
        400,
        "invalid-reception-attendee-details",
      );
    }

    details.push(
      Object.freeze({
        attendeeName:
          entry.attendeeName,
        dietaryPreferences:
          entry.dietaryPreferences ||
          "",
      }),
    );
  }

  return valid(
    Object.freeze(details),
  );
}


function parseRevisionAdditionalGuestResponses(
  operation,
  allocations,
  currentResponses,
  newlyApplicable,
) {
  if (allocations.length === 0) {
    if (operation !== undefined) {
      return invalid(
        403,
        "additional-guests-not-authorized",
      );
    }

    return valid(undefined);
  }

  if (newlyApplicable) {
    return parseAdditionalGuestResponses(
      operation,
      allocations,
    );
  }

  if (operation === undefined) {
    if (
      !isPlainObject(currentResponses)
    ) {
      return invalid(
        400,
        "invalid-stored-additional-guest-responses",
      );
    }

    return valid(
      Object.freeze({
        ...currentResponses,
      }),
    );
  }

  const parsed =
    parseReplaceOperation(
      operation,
    );

  if (!parsed.ok) {
    return parsed;
  }

  if (
    !isPlainObject(parsed.value) ||
    Object.keys(parsed.value).length === 0
  ) {
    return invalid(
      400,
      "invalid-additional-guest-responses",
    );
  }

  const authorizedIds =
    new Set(
      allocations.map(
        (allocation) =>
          allocation.id,
      ),
    );

  for (
    const [
      suppliedId,
      response,
    ] of Object.entries(
      parsed.value,
    )
  ) {
    if (
      !authorizedIds.has(
        suppliedId,
      )
    ) {
      return invalid(
        403,
        "allocation-not-authorized",
      );
    }

    if (
      response !== "yes" &&
      response !== "no"
    ) {
      return invalid(
        400,
        "invalid-additional-guest-response",
      );
    }
  }

  const merged = {
    ...currentResponses,
    ...parsed.value,
  };

  for (
    const allocation of
    allocations
  ) {
    if (
      merged[allocation.id] !==
        "yes" &&
      merged[allocation.id] !==
        "no"
    ) {
      return invalid(
        400,
        "incomplete-additional-guest-responses",
      );
    }
  }

  return valid(
    Object.freeze(merged),
  );
}

function parseRevisionAttendanceTotals(
  operation,
  currentTotals,
  maximumAttendance,
  newlyApplicable,
) {
  if (newlyApplicable) {
    return parseAttendanceTotals(
      operation,
      maximumAttendance,
    );
  }

  if (operation === undefined) {
    if (!isPlainObject(currentTotals)) {
      return invalid(
        400,
        "invalid-stored-attendance-totals",
      );
    }

    const syntheticOperation = {
      operation: "replace",
      value: currentTotals,
    };

    return parseAttendanceTotals(
      syntheticOperation,
      maximumAttendance,
    );
  }

  const parsed =
    parseReplaceOperation(
      operation,
    );

  if (!parsed.ok) {
    return parsed;
  }

  if (
    !isPlainObject(parsed.value) ||
    Object.keys(parsed.value).length === 0 ||
    Object.keys(parsed.value).some(
      (key) =>
        !ATTENDANCE_TOTAL_KEYS.includes(
          key,
        ),
    )
  ) {
    return invalid(
      400,
      "invalid-attendance-totals",
    );
  }

  const merged = {
    ...currentTotals,
  };

  for (
    const [
      key,
      value,
    ] of Object.entries(
      parsed.value,
    )
  ) {
    if (
      !Number.isInteger(value) ||
      value < 0
    ) {
      return invalid(
        400,
        "invalid-attendance-totals",
      );
    }

    merged[key] = value;
  }

  return parseAttendanceTotals(
    {
      operation: "replace",
      value: merged,
    },
    maximumAttendance,
  );
}

function validateRevisionChanges(
  changes,
  invitation,
  currentRsvp,
) {
  for (
    const key of
    Object.keys(changes)
  ) {
    if (
      !SUBSTANTIVE_REGION_IDS
        .includes(key)
    ) {
      return invalid(
        403,
        "substantive-region-not-authorized",
      );
    }
  }

  if (
    !currentRsvp ||
    !Array.isArray(
      currentRsvp.eventAttendance,
    )
  ) {
    return invalid(
      400,
      "invalid-current-rsvp",
    );
  }

  let eventAttendance =
    currentRsvp.eventAttendance;

  if (
    changes.eventAttendance !==
    undefined
  ) {
    const attendance =
      parseEventAttendance(
        changes.eventAttendance,
      );

    if (!attendance.ok) {
      return attendance;
    }

    eventAttendance =
      attendance.value;
  }

  const wasDecline =
    currentRsvp.eventAttendance
      .length === 1 &&
    currentRsvp.eventAttendance[0] ===
      "decline";

  const isDecline =
    eventAttendance.length === 1 &&
    eventAttendance[0] ===
      "decline";

  if (isDecline) {
    if (
      changes
        .receptionAttendeeDetails !==
      undefined
    ) {
      return invalid(
        403,
        "reception-details-not-authorized",
      );
    }

    if (
      changes
        .additionalGuestResponses !==
        undefined ||
      changes.attendanceTotals !==
        undefined
    ) {
      return invalid(
        400,
        "decline-has-attendance-dependent-data",
      );
    }

    return valid(
      Object.freeze({
        eventAttendance:
          Object.freeze([
            "decline",
          ]),
      }),
    );
  }

  const guestResponses =
    parseRevisionAdditionalGuestResponses(
      changes
        .additionalGuestResponses,
      invitation
        .additionalGuestAllocations,
      currentRsvp
        .additionalGuestResponses,
      wasDecline,
    );

  if (!guestResponses.ok) {
    return guestResponses;
  }

  const totals =
    parseRevisionAttendanceTotals(
      changes.attendanceTotals,
      currentRsvp
        .attendanceTotals,
      invitation.maximumAttendance,
      wasDecline,
    );

  if (!totals.ok) {
    return totals;
  }

  const yesCount =
    guestResponses.value
      ? Object.values(
          guestResponses.value,
        ).filter(
          (value) =>
            value === "yes",
        ).length
      : 0;

  if (
    yesCount >
    totals.value
      .overallAttendance
  ) {
    return invalid(
      400,
      "additional-guests-exceed-attendance",
    );
  }

  const includedReceptionBefore =
    currentRsvp
      .eventAttendance
      .includes("reception");

  const includesReception =
    eventAttendance.includes(
      "reception",
    );

  let receptionAttendeeDetails;

  if (!includesReception) {
    if (
      changes
        .receptionAttendeeDetails !==
      undefined
    ) {
      return invalid(
        403,
        "reception-details-not-authorized",
      );
    }
  } else {
    const attendanceChanged =
      currentRsvp
        .overallAttendance !==
      totals.value
        .overallAttendance;

    const replacementRequired =
      wasDecline ||
      !includedReceptionBefore ||
      attendanceChanged;

    if (
      changes
        .receptionAttendeeDetails ===
        undefined
    ) {
      if (replacementRequired) {
        return invalid(
          400,
          "missing-reception-attendee-details",
        );
      }

      const storedDetails =
        parseReceptionAttendeeDetails(
          {
            operation:
              "replace",
            value:
              currentRsvp
                .receptionAttendeeDetails,
          },
          totals.value
            .overallAttendance,
        );

      if (!storedDetails.ok) {
        return storedDetails;
      }

      receptionAttendeeDetails =
        storedDetails.value;
    } else {
      const replacement =
        parseReceptionAttendeeDetails(
          changes
            .receptionAttendeeDetails,
          totals.value
            .overallAttendance,
        );

      if (!replacement.ok) {
        return replacement;
      }

      receptionAttendeeDetails =
        replacement.value;
    }
  }

  return valid(
    Object.freeze({
      eventAttendance:
        Object.freeze([
          ...eventAttendance,
        ]),
      ...(guestResponses.value
        ? {
            additionalGuestResponses:
              guestResponses.value,
          }
        : {}),
      attendanceTotals:
        totals.value
          .attendanceTotals,
      overallAttendance:
        totals.value
          .overallAttendance,
      ...(receptionAttendeeDetails
        ? {
            receptionAttendeeDetails,
          }
        : {}),
    }),
  );
}

function validateInitialChanges(
  changes,
  invitation,
) {
  for (
    const key of
    Object.keys(changes)
  ) {
    if (
      !SUBSTANTIVE_REGION_IDS
        .includes(key)
    ) {
      return invalid(
        403,
        "substantive-region-not-authorized",
      );
    }
  }

  if (
    !Object.prototype
      .hasOwnProperty.call(
        changes,
        "eventAttendance",
      )
  ) {
    return invalid(
      400,
      "missing-event-attendance",
    );
  }

  const attendance =
    parseEventAttendance(
      changes.eventAttendance,
    );

  if (!attendance.ok) {
    return attendance;
  }

  const eventAttendance =
    attendance.value;

  if (
    eventAttendance[0] ===
    "decline"
  ) {
    if (
      changes
        .receptionAttendeeDetails !==
      undefined
    ) {
      return invalid(
        403,
        "reception-details-not-authorized",
      );
    }

    if (
      changes
        .additionalGuestResponses !==
        undefined ||
      changes.attendanceTotals !==
        undefined
    ) {
      return invalid(
        400,
        "decline-has-attendance-dependent-data",
      );
    }

    return valid(
      Object.freeze({
        eventAttendance,
      }),
    );
  }

  if (
    changes.attendanceTotals ===
    undefined
  ) {
    return invalid(
      400,
      "missing-attendance-totals",
    );
  }

  const totals =
    parseAttendanceTotals(
      changes.attendanceTotals,
      invitation.maximumAttendance,
    );

  if (!totals.ok) {
    return totals;
  }

  const guestResponses =
    parseAdditionalGuestResponses(
      changes
        .additionalGuestResponses,
      invitation
        .additionalGuestAllocations,
    );

  if (!guestResponses.ok) {
    return guestResponses;
  }

  const yesCount =
    guestResponses.value
      ? Object.values(
          guestResponses.value,
        ).filter(
          (value) =>
            value === "yes",
        ).length
      : 0;

  if (
    yesCount >
    totals.value
      .overallAttendance
  ) {
    return invalid(
      400,
      "additional-guests-exceed-attendance",
    );
  }

  const includesReception =
    eventAttendance.includes(
      "reception",
    );

  let receptionAttendeeDetails;

  if (includesReception) {
    const reception =
      parseReceptionAttendeeDetails(
        changes
          .receptionAttendeeDetails,
        totals.value
          .overallAttendance,
      );

    if (!reception.ok) {
      return reception;
    }

    receptionAttendeeDetails =
      reception.value;
  } else if (
    changes
      .receptionAttendeeDetails !==
    undefined
  ) {
    return invalid(
      403,
      "reception-details-not-authorized",
    );
  }

  return valid(
    Object.freeze({
      eventAttendance,
      ...(guestResponses.value
        ? {
            additionalGuestResponses:
              guestResponses.value,
          }
        : {}),
      attendanceTotals:
        totals.value
          .attendanceTotals,
      overallAttendance:
        totals.value
          .overallAttendance,
      ...(receptionAttendeeDetails
        ? {
            receptionAttendeeDetails,
          }
        : {}),
    }),
  );
}

module.exports = {
  ATTENDANCE_TOTAL_KEYS,
  SUBSTANTIVE_REGION_IDS,
  TOP_LEVEL_KEYS,
  parseConfirmation,
  parseSubmitRequest,
  validateInitialChanges,
  validateRevisionChanges,
};
