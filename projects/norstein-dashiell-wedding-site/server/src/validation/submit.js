const { z } = require("zod");

const TOP_LEVEL_KEYS = Object.freeze([
  "inviteCode",
  "clientSubmissionId",
  "confirmation",
  "changes",
]);

const SUBSTANTIVE_REGION_IDS = Object.freeze([
  "eventAttendance",
  "namedInviteeResponses",
  "additionalGuestResponses",
  "attendanceTotals",
  "attendeeDetails",
]);

const ATTENDANCE_TOTAL_KEYS = Object.freeze([
  "adults21Plus",
  "youngAdults18To20",
  "children3To17",
  "childrenUnder3",
]);

const uuidSchema = z.string().uuid();
const emailSchema = z.string().email();
const mobileSchema = z.string().regex(/^\+[1-9]\d{7,14}$/);

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
    expectedKeys.every((key) =>
      Object.prototype.hasOwnProperty.call(
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
    !isPlainObject(
      body.changes,
    )
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
      changes:
        body.changes,
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
    Object.keys(operation).some(
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

  return valid(
    operation.value,
  );
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

  const values =
    parsed.value;

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

  if (
    normalized.length === 0
  ) {
    return invalid(
      400,
      "invalid-attendance",
    );
  }

  return valid(
    Object.freeze(
      normalized,
    ),
  );
}

function parseYesNoResponse(
  _item,
  response,
  invalidReason,
) {
  if (
    response !== "yes" &&
    response !== "no"
  ) {
    return invalid(
      400,
      invalidReason,
    );
  }

  return valid(response);
}

function parseAdditionalGuestResponse(
  allocation,
  response,
  invalidReason,
) {
  if (
    allocation.kind === "plus1"
  ) {
    return parseYesNoResponse(
      allocation,
      response,
      invalidReason,
    );
  }

  if (
    allocation.kind ===
    "unnamedChildren"
  ) {
    if (
      !hasExactKeys(
        response,
        [
          "attending",
          "count",
        ],
      ) ||
      (
        response.attending !==
          "yes" &&
        response.attending !==
          "no"
      ) ||
      !Number.isInteger(
        response.count,
      )
    ) {
      return invalid(
        400,
        invalidReason,
      );
    }

    if (
      response.attending ===
        "no"
    ) {
      if (
        response.count !== 0
      ) {
        return invalid(
          400,
          invalidReason,
        );
      }

      return valid(
        Object.freeze({
          attending: "no",
          count: 0,
        }),
      );
    }

    if (
      response.count < 1 ||
      response.count >
        allocation.maximumCount
    ) {
      return invalid(
        400,
        invalidReason,
      );
    }

    return valid(
      Object.freeze({
        attending: "yes",
        count:
          response.count,
      }),
    );
  }

  return invalid(
    400,
    invalidReason,
  );
}

function parseCompleteResponseMap({
  operation,
  authorizedItems,
  unauthorizedReason,
  missingReason,
  invalidReason,
  incompleteReason,
  unauthorizedIdReason,
  parseResponse,
}) {
  if (
    authorizedItems.length === 0
  ) {
    if (
      operation !== undefined
    ) {
      return invalid(
        403,
        unauthorizedReason,
      );
    }

    return valid(undefined);
  }

  if (
    operation === undefined
  ) {
    return invalid(
      400,
      missingReason,
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
    !isPlainObject(
      parsed.value,
    )
  ) {
    return invalid(
      400,
      invalidReason,
    );
  }

  const authorizedById =
    new Map(
      authorizedItems.map(
        (item) => [
          item.id,
          item,
        ],
      ),
    );

  for (
    const suppliedId of
    Object.keys(parsed.value)
  ) {
    if (
      !authorizedById.has(
        suppliedId,
      )
    ) {
      return invalid(
        403,
        unauthorizedIdReason,
      );
    }
  }

  if (
    Object.keys(
      parsed.value,
    ).length !==
    authorizedItems.length
  ) {
    return invalid(
      400,
      incompleteReason,
    );
  }

  const responses = {};

  for (
    const item of
    authorizedItems
  ) {
    const parsedResponse =
      parseResponse(
        item,
        parsed.value[
          item.id
        ],
        invalidReason,
      );

    if (!parsedResponse.ok) {
      return parsedResponse;
    }

    responses[
      item.id
    ] = parsedResponse.value;
  }

  return valid(
    Object.freeze(
      responses,
    ),
  );
}

function parseNamedInviteeResponses(
  operation,
  namedInvitees,
) {
  return parseCompleteResponseMap({
    operation,
    authorizedItems:
      namedInvitees,
    unauthorizedReason:
      "named-invitees-not-authorized",
    missingReason:
      "missing-named-invitee-responses",
    invalidReason:
      "invalid-named-invitee-responses",
    incompleteReason:
      "incomplete-named-invitee-responses",
    unauthorizedIdReason:
      "named-invitee-not-authorized",
    parseResponse:
      parseYesNoResponse,
  });
}

function parseAdditionalGuestResponses(
  operation,
  allocations,
) {
  return parseCompleteResponseMap({
    operation,
    authorizedItems:
      allocations,
    unauthorizedReason:
      "additional-guests-not-authorized",
    missingReason:
      "missing-additional-guest-responses",
    invalidReason:
      "invalid-additional-guest-responses",
    incompleteReason:
      "incomplete-additional-guest-responses",
    unauthorizedIdReason:
      "allocation-not-authorized",
    parseResponse:
      parseAdditionalGuestResponse,
  });
}

function parseRevisionResponseMap({
  operation,
  authorizedItems,
  currentResponses,
  newlyApplicable,
  parseComplete,
  parseResponse,
  unauthorizedReason,
  invalidStoredReason,
  invalidReason,
  incompleteReason,
  unauthorizedIdReason,
}) {
  if (
    authorizedItems.length === 0
  ) {
    if (
      operation !== undefined
    ) {
      return invalid(
        403,
        unauthorizedReason,
      );
    }

    return valid(undefined);
  }

  if (newlyApplicable) {
    return parseComplete(
      operation,
      authorizedItems,
    );
  }

  if (
    !isPlainObject(
      currentResponses,
    )
  ) {
    return invalid(
      400,
      invalidStoredReason,
    );
  }

  if (
    operation === undefined
  ) {
    const stored =
      parseComplete(
        {
          operation:
            "replace",
          value:
            currentResponses,
        },
        authorizedItems,
      );

    return stored.ok
      ? stored
      : invalid(
          400,
          invalidStoredReason,
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
    !isPlainObject(
      parsed.value,
    ) ||
    Object.keys(
      parsed.value,
    ).length === 0
  ) {
    return invalid(
      400,
      invalidReason,
    );
  }

  const authorizedById =
    new Map(
      authorizedItems.map(
        (item) => [
          item.id,
          item,
        ],
      ),
    );

  const normalizedPartial = {};

  for (
    const [
      suppliedId,
      response,
    ] of Object.entries(
      parsed.value,
    )
  ) {
    const authorizedItem =
      authorizedById.get(
        suppliedId,
      );

    if (!authorizedItem) {
      return invalid(
        403,
        unauthorizedIdReason,
      );
    }

    const parsedResponse =
      parseResponse(
        authorizedItem,
        response,
        invalidReason,
      );

    if (!parsedResponse.ok) {
      return parsedResponse;
    }

    normalizedPartial[
      suppliedId
    ] = parsedResponse.value;
  }

  const merged = {
    ...currentResponses,
    ...normalizedPartial,
  };

  const complete =
    parseComplete(
      {
        operation:
          "replace",
        value:
          merged,
      },
      authorizedItems,
    );

  if (!complete.ok) {
    return complete.status === 403
      ? complete
      : invalid(
          400,
          incompleteReason,
        );
  }

  return complete;
}

function parseRevisionNamedInviteeResponses(
  operation,
  namedInvitees,
  currentResponses,
  newlyApplicable,
) {
  return parseRevisionResponseMap({
    operation,
    authorizedItems:
      namedInvitees,
    currentResponses,
    newlyApplicable,
    parseComplete:
      parseNamedInviteeResponses,
    parseResponse:
      parseYesNoResponse,
    unauthorizedReason:
      "named-invitees-not-authorized",
    invalidStoredReason:
      "invalid-stored-named-invitee-responses",
    invalidReason:
      "invalid-named-invitee-responses",
    incompleteReason:
      "incomplete-named-invitee-responses",
    unauthorizedIdReason:
      "named-invitee-not-authorized",
  });
}

function parseRevisionAdditionalGuestResponses(
  operation,
  allocations,
  currentResponses,
  newlyApplicable,
) {
  return parseRevisionResponseMap({
    operation,
    authorizedItems:
      allocations,
    currentResponses,
    newlyApplicable,
    parseComplete:
      parseAdditionalGuestResponses,
    parseResponse:
      parseAdditionalGuestResponse,
    unauthorizedReason:
      "additional-guests-not-authorized",
    invalidStoredReason:
      "invalid-stored-additional-guest-responses",
    invalidReason:
      "invalid-additional-guest-responses",
    incompleteReason:
      "incomplete-additional-guest-responses",
    unauthorizedIdReason:
      "allocation-not-authorized",
  });
}

function deriveOverallAttendance(
  namedInviteeResponses,
  additionalGuestResponses,
) {
  const namedYes =
    namedInviteeResponses
      ? Object.values(
          namedInviteeResponses,
        ).filter(
          (value) =>
            value === "yes",
        ).length
      : 0;

  const additionalAttendance =
    additionalGuestResponses
      ? Object.values(
          additionalGuestResponses,
        ).reduce(
          (
            total,
            response,
          ) => {
            if (
              response ===
              "yes"
            ) {
              return (
                total + 1
              );
            }

            if (
              isPlainObject(
                response,
              ) &&
              response.attending ===
                "yes" &&
              Number.isInteger(
                response.count,
              )
            ) {
              return (
                total +
                response.count
              );
            }

            return total;
          },
          0,
        )
      : 0;

  return (
    namedYes +
    additionalAttendance
  );
}

function parseCompleteAttendanceTotals(
  operation,
  overallAttendance,
) {
  if (
    operation === undefined
  ) {
    return invalid(
      400,
      "missing-attendance-totals",
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

    totals[key] =
      value;
  }

  const sum =
    ATTENDANCE_TOTAL_KEYS
      .reduce(
        (total, key) =>
          total +
          totals[key],
        0,
      );

  if (
    sum !==
    overallAttendance
  ) {
    return invalid(
      400,
      "attendance-totals-do-not-match-derived-attendance",
    );
  }

  return valid(
    Object.freeze(
      totals,
    ),
  );
}

function parseRevisionAttendanceTotals(
  operation,
  currentTotals,
  overallAttendance,
  newlyApplicable,
) {
  if (newlyApplicable) {
    return parseCompleteAttendanceTotals(
      operation,
      overallAttendance,
    );
  }

  if (
    !isPlainObject(
      currentTotals,
    )
  ) {
    return invalid(
      400,
      "invalid-stored-attendance-totals",
    );
  }

  if (
    operation === undefined
  ) {
    return parseCompleteAttendanceTotals(
      {
        operation:
          "replace",
        value:
          currentTotals,
      },
      overallAttendance,
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
    !isPlainObject(
      parsed.value,
    ) ||
    Object.keys(
      parsed.value,
    ).length === 0 ||
    Object.keys(
      parsed.value,
    ).some(
      (key) =>
        !ATTENDANCE_TOTAL_KEYS
          .includes(key),
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

    merged[key] =
      value;
  }

  return parseCompleteAttendanceTotals(
    {
      operation:
        "replace",
      value:
        merged,
    },
    overallAttendance,
  );
}

function parseAttendeeDetails(
  operation,
  overallAttendance,
  includesReception,
) {
  if (
    operation === undefined
  ) {
    return invalid(
      400,
      "missing-attendee-details",
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
    !Array.isArray(
      parsed.value,
    ) ||
    parsed.value.length !==
      overallAttendance
  ) {
    return invalid(
      400,
      "invalid-attendee-details",
    );
  }

  const details = [];

  for (
    const entry of
    parsed.value
  ) {
    const allowedKeys =
      includesReception
        ? [
            "attendeeName",
            "dietaryPreferences",
          ]
        : [
            "attendeeName",
          ];

    if (
      !isPlainObject(entry)
    ) {
      return invalid(
        400,
        "invalid-attendee-details",
      );
    }

    const unknownKeys =
      Object.keys(entry)
        .filter(
          (key) =>
            !allowedKeys
              .includes(key),
        );

    if (
      unknownKeys.length > 0
    ) {
      if (
        !includesReception &&
        unknownKeys.includes(
          "dietaryPreferences",
        )
      ) {
        return invalid(
          403,
          "dietary-preferences-not-authorized",
        );
      }

      return invalid(
        400,
        "invalid-attendee-details",
      );
    }

    if (
      typeof entry
        .attendeeName !==
      "string"
    ) {
      return invalid(
        400,
        "invalid-attendee-details",
      );
    }

    const attendeeName =
      entry
        .attendeeName
        .trim();

    if (
      attendeeName === "" ||
      attendeeName.length >
        100
    ) {
      return invalid(
        400,
        "invalid-attendee-details",
      );
    }

    if (
      includesReception &&
      entry
        .dietaryPreferences !==
        undefined &&
      (
        typeof entry
          .dietaryPreferences !==
          "string" ||
        entry
          .dietaryPreferences
          .length > 1000
      )
    ) {
      return invalid(
        400,
        "invalid-attendee-details",
      );
    }

    details.push(
      Object.freeze({
        attendeeName,
        ...(includesReception &&
        entry
          .dietaryPreferences !==
          undefined
          ? {
              dietaryPreferences:
                entry
                  .dietaryPreferences,
            }
          : {}),
      }),
    );
  }

  return valid(
    Object.freeze(
      details,
    ),
  );
}

function buildAttendingIdentitySet(
  namedInviteeResponses,
  additionalGuestResponses,
) {
  const values = [
    ...Object.entries(
      namedInviteeResponses ||
        {},
    )
      .filter(
        ([
          ,
          response,
        ]) =>
          response === "yes",
      )
      .map(
        ([id]) =>
          `named:${id}`,
      ),
  ];

  for (
    const [
      id,
      response,
    ] of Object.entries(
      additionalGuestResponses ||
        {},
    )
  ) {
    if (
      response === "yes"
    ) {
      values.push(
        `plus1:${id}`,
      );
      continue;
    }

    if (
      isPlainObject(
        response,
      ) &&
      (
        response.attending ===
          "yes" ||
        response.attending ===
          "no"
      ) &&
      Number.isInteger(
        response.count,
      )
    ) {
      values.push(
        `children:${id}:${response.attending}:${response.count}`,
      );
    }
  }

  return new Set(values);
}

function setsEqual(
  left,
  right,
) {
  return (
    left.size ===
      right.size &&
    [...left].every(
      (value) =>
        right.has(value),
    )
  );
}

function stripDietaryPreferences(
  attendeeDetails,
) {
  return Object.freeze(
    attendeeDetails.map(
      (entry) =>
        Object.freeze({
          attendeeName:
            entry.attendeeName,
        }),
    ),
  );
}

function validateStoredAttendeeDetails(
  currentRsvp,
  overallAttendance,
  includesReception,
) {
  const parsed =
    parseAttendeeDetails(
      {
        operation:
          "replace",
        value:
          currentRsvp
            .attendeeDetails,
      },
      overallAttendance,
      currentRsvp
        .eventAttendance
        .includes(
          "reception",
        ),
    );

  if (!parsed.ok) {
    return invalid(
      400,
      "invalid-stored-attendee-details",
    );
  }

  return valid(
    includesReception
      ? parsed.value
      : stripDietaryPreferences(
          parsed.value,
        ),
  );
}

function validateSubstantiveKeys(
  changes,
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

  return valid(undefined);
}

function assertInvitationCapacity(
  invitation,
) {
  if (
    !invitation ||
    !Number.isInteger(
      invitation
        .maximumAttendance,
    ) ||
    invitation
      .maximumAttendance < 1 ||
    !Array.isArray(
      invitation
        .namedInvitees,
    ) ||
    !Array.isArray(
      invitation
        .additionalGuestAllocations,
    )
  ) {
    throw new Error(
      "RSVP invitation configuration failed capacity validation.",
    );
  }

  let additionalGuestCapacity = 0;
  let groupedChildrenAllocations = 0;

  for (
    const allocation of
    invitation
      .additionalGuestAllocations
  ) {
    if (
      !isPlainObject(
        allocation,
      ) ||
      typeof allocation.id !==
        "string" ||
      allocation.id === "" ||
      ![
        "plus1",
        "unnamedChildren",
      ].includes(
        allocation.kind,
      ) ||
      !Number.isInteger(
        allocation.maximumCount,
      ) ||
      allocation.maximumCount < 1
    ) {
      throw new Error(
        "RSVP invitation configuration failed capacity validation.",
      );
    }

    if (
      allocation.kind ===
        "plus1" &&
      allocation.maximumCount !== 1
    ) {
      throw new Error(
        "RSVP invitation configuration failed capacity validation.",
      );
    }

    if (
      allocation.kind ===
      "unnamedChildren"
    ) {
      groupedChildrenAllocations += 1;

      if (
        groupedChildrenAllocations > 1
      ) {
        throw new Error(
          "RSVP invitation configuration failed capacity validation.",
        );
      }
    }

    additionalGuestCapacity +=
      allocation.maximumCount;
  }

  if (
    invitation
      .namedInvitees
      .length +
      additionalGuestCapacity !==
      invitation
        .maximumAttendance
  ) {
    throw new Error(
      "RSVP invitation configuration failed capacity validation.",
    );
  }
}

function validateInitialChanges(
  changes,
  invitation,
) {
  const keys =
    validateSubstantiveKeys(
      changes,
    );

  if (!keys.ok) {
    return keys;
  }

  assertInvitationCapacity(
    invitation,
  );

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
      changes
        .eventAttendance,
    );

  if (!attendance.ok) {
    return attendance;
  }

  const eventAttendance =
    attendance.value;

  const isDecline =
    eventAttendance.length ===
      1 &&
    eventAttendance[0] ===
      "decline";

  if (isDecline) {
    if (
      changes
        .namedInviteeResponses !==
        undefined ||
      changes
        .additionalGuestResponses !==
        undefined ||
      changes
        .attendanceTotals !==
        undefined ||
      changes
        .attendeeDetails !==
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

  const namedInviteeResponses =
    parseNamedInviteeResponses(
      changes
        .namedInviteeResponses,
      invitation
        .namedInvitees,
    );

  if (
    !namedInviteeResponses.ok
  ) {
    return namedInviteeResponses;
  }

  const additionalGuestResponses =
    parseAdditionalGuestResponses(
      changes
        .additionalGuestResponses,
      invitation
        .additionalGuestAllocations,
    );

  if (
    !additionalGuestResponses.ok
  ) {
    return additionalGuestResponses;
  }

  const overallAttendance =
    deriveOverallAttendance(
      namedInviteeResponses
        .value,
      additionalGuestResponses
        .value,
    );

  if (
    overallAttendance < 1 ||
    overallAttendance >
      invitation
        .maximumAttendance
  ) {
    return invalid(
      400,
      "invalid-derived-attendance",
    );
  }

  const attendanceTotals =
    parseCompleteAttendanceTotals(
      changes
        .attendanceTotals,
      overallAttendance,
    );

  if (
    !attendanceTotals.ok
  ) {
    return attendanceTotals;
  }

  const includesReception =
    eventAttendance.includes(
      "reception",
    );

  const attendeeDetails =
    parseAttendeeDetails(
      changes
        .attendeeDetails,
      overallAttendance,
      includesReception,
    );

  if (!attendeeDetails.ok) {
    return attendeeDetails;
  }

  return valid(
    Object.freeze({
      eventAttendance,
      ...(namedInviteeResponses
        .value
        ? {
            namedInviteeResponses:
              namedInviteeResponses
                .value,
          }
        : {}),
      ...(additionalGuestResponses
        .value
        ? {
            additionalGuestResponses:
              additionalGuestResponses
                .value,
          }
        : {}),
      attendanceTotals:
        attendanceTotals.value,
      overallAttendance,
      attendeeDetails:
        attendeeDetails.value,
    }),
  );
}

function validateRevisionChanges(
  changes,
  invitation,
  currentRsvp,
) {
  const keys =
    validateSubstantiveKeys(
      changes,
    );

  if (!keys.ok) {
    return keys;
  }

  assertInvitationCapacity(
    invitation,
  );

  if (
    !currentRsvp ||
    !Array.isArray(
      currentRsvp
        .eventAttendance,
    )
  ) {
    return invalid(
      400,
      "invalid-current-rsvp",
    );
  }

  let eventAttendance =
    currentRsvp
      .eventAttendance;

  if (
    changes
      .eventAttendance !==
    undefined
  ) {
    const attendance =
      parseEventAttendance(
        changes
          .eventAttendance,
      );

    if (!attendance.ok) {
      return attendance;
    }

    eventAttendance =
      attendance.value;
  }

  const wasDecline =
    currentRsvp
      .eventAttendance
      .length === 1 &&
    currentRsvp
      .eventAttendance[0] ===
      "decline";

  const isDecline =
    eventAttendance.length ===
      1 &&
    eventAttendance[0] ===
      "decline";

  if (isDecline) {
    if (
      changes
        .namedInviteeResponses !==
        undefined ||
      changes
        .additionalGuestResponses !==
        undefined ||
      changes
        .attendanceTotals !==
        undefined ||
      changes
        .attendeeDetails !==
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

  const namedInviteeResponses =
    parseRevisionNamedInviteeResponses(
      changes
        .namedInviteeResponses,
      invitation
        .namedInvitees,
      currentRsvp
        .namedInviteeResponses,
      wasDecline,
    );

  if (
    !namedInviteeResponses.ok
  ) {
    return namedInviteeResponses;
  }

  const additionalGuestResponses =
    parseRevisionAdditionalGuestResponses(
      changes
        .additionalGuestResponses,
      invitation
        .additionalGuestAllocations,
      currentRsvp
        .additionalGuestResponses,
      wasDecline,
    );

  if (
    !additionalGuestResponses.ok
  ) {
    return additionalGuestResponses;
  }

  const overallAttendance =
    deriveOverallAttendance(
      namedInviteeResponses
        .value,
      additionalGuestResponses
        .value,
    );

  if (
    overallAttendance < 1 ||
    overallAttendance >
      invitation
        .maximumAttendance
  ) {
    return invalid(
      400,
      "invalid-derived-attendance",
    );
  }

  const priorIdentitySet =
    wasDecline
      ? new Set()
      : buildAttendingIdentitySet(
          currentRsvp
            .namedInviteeResponses,
          currentRsvp
            .additionalGuestResponses,
        );

  const resultingIdentitySet =
    buildAttendingIdentitySet(
      namedInviteeResponses
        .value,
      additionalGuestResponses
        .value,
    );

  const compositionChanged =
    !setsEqual(
      priorIdentitySet,
      resultingIdentitySet,
    );

  const attendanceTotals =
    parseRevisionAttendanceTotals(
      changes
        .attendanceTotals,
      currentRsvp
        .attendanceTotals,
      overallAttendance,
      wasDecline,
    );

  if (
    !attendanceTotals.ok
  ) {
    return attendanceTotals;
  }

  const includesReception =
    eventAttendance.includes(
      "reception",
    );

  let attendeeDetails;

  if (
    changes
      .attendeeDetails !==
    undefined
  ) {
    const replacement =
      parseAttendeeDetails(
        changes
          .attendeeDetails,
        overallAttendance,
        includesReception,
      );

    if (!replacement.ok) {
      return replacement;
    }

    attendeeDetails =
      replacement.value;
  } else if (
    wasDecline ||
    compositionChanged
  ) {
    return invalid(
      400,
      "missing-attendee-details",
    );
  } else {
    const stored =
      validateStoredAttendeeDetails(
        currentRsvp,
        overallAttendance,
        includesReception,
      );

    if (!stored.ok) {
      return stored;
    }

    attendeeDetails =
      stored.value;
  }

  return valid(
    Object.freeze({
      eventAttendance:
        Object.freeze([
          ...eventAttendance,
        ]),
      ...(namedInviteeResponses
        .value
        ? {
            namedInviteeResponses:
              namedInviteeResponses
                .value,
          }
        : {}),
      ...(additionalGuestResponses
        .value
        ? {
            additionalGuestResponses:
              additionalGuestResponses
                .value,
          }
        : {}),
      attendanceTotals:
        attendanceTotals.value,
      overallAttendance,
      attendeeDetails,
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