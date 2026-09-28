export const RSVP_STATES = Object.freeze({
  ENTRY_READY: 1,
  LOOKING_UP: 2,
  INVALID_INVITATION: 3,
  SERVICE_UNAVAILABLE: 4,
  VALIDATED_FORM: 5,
  VALIDATION_FAILURE: 6,
  SUBMITTING: 7,
  SUBMISSION_UNCERTAIN: 8,
  CONFIRMED_INITIAL: 9,
  CONFIRMED_REVISION: 10,
  DELIVERY_WARNING: 11,
  CONFIRMATION_FALLBACK: 12,
  CLOSED: 13,
});

export const ATTENDANCE_TOTAL_FIELDS = Object.freeze([
  "adults21Plus",
  "youngAdults18To20",
  "children3To17",
  "childrenUnder3",
]);

export const ATTENDANCE_TOTAL_LABELS = Object.freeze({
  adults21Plus: "Adults, ages 21+",
  youngAdults18To20: "Young Adults, ages 18–20",
  children3To17: "Children, ages 3–17",
  childrenUnder3: "Children under 3",
});

function blankAdditionalGuestResponse(allocation) {
  return allocation.kind === "unnamedChildren"
    ? {
        attending: "",
        count: "",
      }
    : "";
}

export function createBlankDraft(lookup) {
  const namedInvitees =
    lookup?.invitation?.namedInvitees ?? [];
  const allocations =
    lookup?.invitation?.additionalGuestAllocations ?? [];

  return {
    completionMode: "",
    attendance: {
      ceremony: false,
      reception: false,
      decline: false,
      touched: false,
    },

    namedInviteeResponses:
      Object.fromEntries(
        namedInvitees.map(
          (invitee) => [
            invitee.id,
            "",
          ],
        ),
      ),

    additionalGuestResponses:
      Object.fromEntries(
        allocations.map(
          (allocation) => [
            allocation.id,
            blankAdditionalGuestResponse(
              allocation,
            ),
          ],
        ),
      ),

    attendanceTotals:
      Object.fromEntries(
        ATTENDANCE_TOTAL_FIELDS.map(
          (field) => [
            field,
            "",
          ],
        ),
      ),

    attendeeDetails: [],

    confirmation: {
      method:
        lookup
          ?.confirmationOptions
          ?.email
          ? "email"
          : "",
      email: "",
      mobile: "",
      smsAuthorization: false,
    },
  };
}

export function toggleAttendance(
  attendance,
  value,
) {
  if (value === "decline") {
    const selecting =
      !attendance.decline;

    return {
      ceremony: false,
      reception: false,
      decline: selecting,
      touched: true,
    };
  }

  const next = {
    ...attendance,
    [value]:
      !attendance[value],
    touched: true,
  };

  if (next[value]) {
    next.decline = false;
  }

  return next;
}

export function attendanceArray(
  attendance,
) {
  if (attendance.decline) {
    return [
      "decline",
    ];
  }

  return [
    attendance.ceremony
      ? "ceremony"
      : null,
    attendance.reception
      ? "reception"
      : null,
  ].filter(Boolean);
}

function parseWholeNumber(
  value,
) {
  if (
    value === "" ||
    value === null ||
    value === undefined
  ) {
    return null;
  }

  const number =
    Number(value);

  return (
    Number.isInteger(
      number,
    ) &&
    number >= 0
  )
    ? number
    : NaN;
}

export function parsedAttendanceTotals(
  totals,
) {
  return Object.fromEntries(
    ATTENDANCE_TOTAL_FIELDS.map(
      (field) => [
        field,
        parseWholeNumber(
          totals[field],
        ),
      ],
    ),
  );
}

export function totalsAreComplete(
  totals,
) {
  const parsed =
    parsedAttendanceTotals(
      totals,
    );

  return ATTENDANCE_TOTAL_FIELDS.every(
    (field) =>
      Number.isInteger(
        parsed[field],
      ),
  );
}

export function enteredAttendanceTotal(
  totals,
) {
  const parsed =
    parsedAttendanceTotals(
      totals,
    );

  return ATTENDANCE_TOTAL_FIELDS.reduce(
    (
      sum,
      field,
    ) =>
      Number.isInteger(
        parsed[field],
      )
        ? sum +
          parsed[field]
        : sum,
    0,
  );
}

export function resizeAttendeeDetails(
  current,
  count,
) {
  const safeCount =
    Number.isInteger(
      count,
    ) &&
    count > 0
      ? count
      : 0;

  return Array.from(
    {
      length:
        safeCount,
    },
    (
      _,
      index,
    ) =>
      current[index] ??
      {
        attendeeName:
          "",
        dietaryPreferences:
          "",
      },
  );
}

function buildConfirmation(
  draft,
  lookup,
  errors,
) {
  const options =
    lookup
      .confirmationOptions ??
    {};

  if (
    draft
      .confirmation
      .method ===
    "email"
  ) {
    if (!options.email) {
      errors.confirmationMethod =
        "Email confirmation is not available.";

      return null;
    }

    const email =
      draft
        .confirmation
        .email
        .trim();

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email,
      )
    ) {
      errors.confirmationEmail =
        "Enter a valid email address.";

      return null;
    }

    return {
      method: "email",
      email,
    };
  }

  if (
    draft
      .confirmation
      .method ===
    "textMessage"
  ) {
    if (
      !options
        .textMessage
    ) {
      errors.confirmationMethod =
        "Text Message confirmation is not available.";

      return null;
    }

    const mobile =
      draft
        .confirmation
        .mobile
        .trim();

    if (
      !/^\+?[0-9() .-]{7,25}$/.test(
        mobile,
      )
    ) {
      errors.confirmationMobile =
        "Enter a valid mobile number.";

      return null;
    }

    if (
      options
        .smsAuthorizationRequired &&
      !draft
        .confirmation
        .smsAuthorization
    ) {
      errors.smsAuthorization =
        "Authorization is required for text confirmation.";

      return null;
    }

    return {
      method:
        "textMessage",
      mobile,

      ...(
        options
          .smsAuthorizationRequired
          ? {
              smsAuthorization:
                true,
            }
          : {}
      ),
    };
  }

  errors.confirmationMethod =
    "Select a confirmation method.";

  return null;
}

function normalizeNamedInviteeResponses(
  draft,
  invitation,
  errors,
) {
  const invitees =
    invitation
      .namedInvitees ??
    [];

  const source =
    draft
      .namedInviteeResponses ??
    {};

  const selected = {};

  const authorizedIds =
    new Set(
      invitees.map(
        (invitee) =>
          invitee.id,
      ),
    );

  let hasInvalid =
    false;

  for (
    const invitee of
    invitees
  ) {
    const value =
      source[
        invitee.id
      ];

    if (
      value ===
        "yes" ||
      value ===
        "no"
    ) {
      selected[
        invitee.id
      ] = value;

      continue;
    }

    if (
      value !== "" &&
      value !==
        undefined &&
      value !== null
    ) {
      hasInvalid =
        true;
    }
  }

  for (
    const [
      id,
      value,
    ] of Object.entries(
      source,
    )
  ) {
    if (
      !authorizedIds.has(
        id,
      ) &&
      value !== "" &&
      value !==
        undefined &&
      value !== null
    ) {
      hasInvalid =
        true;
    }
  }

  if (hasInvalid) {
    errors.namedInviteeResponses =
      "Choose Yes or No only for the named invitees on this invitation.";
  }

  return {
    selected,

    complete:
      invitees.length ===
        Object.keys(
          selected,
        ).length &&
      !hasInvalid,
  };
}

function parseGroupedChildCount(
  value,
) {
  if (
    value === "" ||
    value === null ||
    value === undefined
  ) {
    return null;
  }

  const parsed =
    Number(value);

  return Number.isInteger(
    parsed,
  )
    ? parsed
    : NaN;
}

function normalizeAllocationResponse(
  allocation,
  rawValue,
) {
  if (
    allocation.kind ===
    "plus1"
  ) {
    if (
      rawValue ===
        "yes" ||
      rawValue ===
        "no"
    ) {
      return {
        selected: true,
        valid: true,
        value:
          rawValue,
      };
    }

    if (
      rawValue === "" ||
      rawValue ===
        undefined ||
      rawValue === null
    ) {
      return {
        selected: false,
        valid: true,
      };
    }

    return {
      selected: true,
      valid: false,
    };
  }

  if (
    allocation.kind !==
    "unnamedChildren"
  ) {
    return {
      selected: true,
      valid: false,
    };
  }

  if (
    rawValue === "" ||
    rawValue ===
      undefined ||
    rawValue === null
  ) {
    return {
      selected: false,
      valid: true,
    };
  }

  if (
    typeof rawValue !==
      "object" ||
    Array.isArray(
      rawValue,
    )
  ) {
    return {
      selected: true,
      valid: false,
    };
  }

  const attending =
    rawValue.attending ??
    "";

  const rawCount =
    rawValue.count ??
    "";

  if (
    attending === "" &&
    rawCount === ""
  ) {
    return {
      selected: false,
      valid: true,
    };
  }

  if (
    attending !==
      "yes" &&
    attending !==
      "no"
  ) {
    return {
      selected: true,
      valid: false,
    };
  }

  const count =
    parseGroupedChildCount(
      rawCount,
    );

  if (
    attending ===
    "no"
  ) {
    if (
      rawCount !== "" &&
      rawCount !==
        null &&
      rawCount !==
        undefined &&
      count !== 0
    ) {
      return {
        selected: true,
        valid: false,
      };
    }

    return {
      selected: true,
      valid: true,
      value: {
        attending:
          "no",
        count: 0,
      },
    };
  }

  if (
    !Number.isInteger(
      count,
    ) ||
    count < 1 ||
    count >
      allocation
        .maximumCount
  ) {
    return {
      selected: true,
      valid: false,
    };
  }

  return {
    selected: true,
    valid: true,
    value: {
      attending:
        "yes",
      count,
    },
  };
}

function normalizeAdditionalGuestResponses(
  draft,
  invitation,
  errors,
) {
  const allocations =
    invitation
      .additionalGuestAllocations ??
    [];

  const source =
    draft
      .additionalGuestResponses ??
    {};

  const selected = {};

  const authorizedIds =
    new Set(
      allocations.map(
        (allocation) =>
          allocation.id,
      ),
    );

  let hasInvalid =
    false;

  for (
    const allocation of
    allocations
  ) {
    const normalized =
      normalizeAllocationResponse(
        allocation,
        source[
          allocation.id
        ],
      );

    if (
      !normalized.valid
    ) {
      hasInvalid =
        true;
    } else if (
      normalized.selected
    ) {
      selected[
        allocation.id
      ] =
        normalized.value;
    }
  }

  for (
    const [
      id,
      value,
    ] of Object.entries(
      source,
    )
  ) {
    if (
      !authorizedIds.has(
        id,
      ) &&
      value !== "" &&
      value !== null &&
      value !==
        undefined
    ) {
      hasInvalid =
        true;
    }
  }

  if (hasInvalid) {
    errors.additionalGuestResponses =
      "Complete each additional-guest response using the options provided for this invitation.";
  }

  return {
    selected,

    complete:
      allocations.length ===
        Object.keys(
          selected,
        ).length &&
      !hasInvalid,
  };
}

function allocationAttendanceCount(
  allocation,
  response,
) {
  if (
    allocation.kind ===
    "plus1"
  ) {
    return response ===
      "yes"
      ? 1
      : 0;
  }

  if (
    allocation.kind ===
    "unnamedChildren"
  ) {
    return (
      response
        ?.attending ===
        "yes" &&
      Number.isInteger(
        response.count,
      )
    )
      ? response.count
      : 0;
  }

  return 0;
}

export function derivedOverallAttendance({
  invitation,
  namedInviteeResponses,
  additionalGuestResponses,
}) {
  const namedCount =
    Object.values(
      namedInviteeResponses ??
        {},
    ).filter(
      (value) =>
        value ===
        "yes",
    ).length;

  const additionalCount =
    (
      invitation
        ?.additionalGuestAllocations ??
      []
    ).reduce(
      (
        sum,
        allocation,
      ) =>
        sum +
        allocationAttendanceCount(
          allocation,
          additionalGuestResponses?.[
            allocation.id
          ],
        ),
      0,
    );

  return (
    namedCount +
    additionalCount
  );
}

function attendeeDetailsContainInput(
  details,
) {
  return details.some(
    (detail) => {
      const name =
        String(
          detail
            ?.attendeeName ??
            "",
        ).trim();

      const dietary =
        String(
          detail
            ?.dietaryPreferences ??
            "",
        ).trim();

      return (
        name !== "" ||
        dietary !== ""
      );
    },
  );
}

function validateAttendeeDetails(
  details,
  expectedCount,
  {
    receptionSelected,
    errors,
  },
) {
  if (
    !Number.isInteger(
      expectedCount,
    ) ||
    expectedCount < 1
  ) {
    errors.attendeeDetails =
      "Complete the attending-person responses before entering attendee details.";

    return null;
  }

  if (
    details.length !==
    expectedCount
  ) {
    errors.attendeeDetails =
      "Provide one Attendee Details entry for every person attending.";

    return null;
  }

  const normalized = [];

  details.forEach(
    (
      detail,
      index,
    ) => {
      const attendeeName =
        String(
          detail
            ?.attendeeName ??
            "",
        ).trim();

      const dietaryPreferences =
        String(
          detail
            ?.dietaryPreferences ??
            "",
        ).trim();

      if (
        attendeeName.length <
          1 ||
        attendeeName.length >
          100
      ) {
        errors[
          `${index}.attendeeName`
        ] =
          "Enter an attendee name of 100 characters or fewer.";
      }

      if (
        dietaryPreferences.length >
        1000
      ) {
        errors[
          `${index}.dietaryPreferences`
        ] =
          "Dietary/allergy information must be 1000 characters or fewer.";
      }

      if (
        !receptionSelected &&
        dietaryPreferences !==
          ""
      ) {
        errors[
          `${index}.dietaryPreferences`
        ] =
          "Dietary or allergy information applies only when Reception is selected.";
      }

      normalized.push({
        attendeeName,

        ...(
          receptionSelected
            ? {
                dietaryPreferences,
              }
            : {}
        ),
      });
    },
  );

  const hasDetailError =
    Object.keys(
      errors,
    ).some(
      (key) =>
        key ===
          "attendeeDetails" ||
        /^\d+\.(attendeeName|dietaryPreferences)$/.test(
          key,
        ),
    );

  return hasDetailError
    ? null
    : normalized;
}

function addAttendingRegions({
  draft,
  lookup,
  changes,
  errors,
  requireComplete,
}) {
  const invitation =
    lookup.invitation;

  const named =
    normalizeNamedInviteeResponses(
      draft,
      invitation,
      errors,
    );

  const additional =
    normalizeAdditionalGuestResponses(
      draft,
      invitation,
      errors,
    );

  if (
    requireComplete &&
    !named.complete
  ) {
    errors.namedInviteeResponses =
      "Answer Yes or No for every named invitee.";
  }

  if (
    requireComplete &&
    (
      invitation
        .additionalGuestAllocations ??
      []
    ).length >
      0 &&
    !additional.complete
  ) {
    errors.additionalGuestResponses =
      "Answer every authorized additional-guest question and, when children are attending, choose how many.";
  }

  if (
    (
      requireComplete &&
      named.complete
    ) ||
    (
      !requireComplete &&
      Object.keys(
        named.selected,
      ).length >
        0
    )
  ) {
    changes.namedInviteeResponses =
      {
        operation:
          "replace",
        value:
          named.selected,
      };
  }

  if (
    (
      invitation
        .additionalGuestAllocations ??
      []
    ).length >
      0 &&
    (
      (
        requireComplete &&
        additional.complete
      ) ||
      (
        !requireComplete &&
        Object.keys(
          additional.selected,
        ).length >
          0
      )
    )
  ) {
    changes.additionalGuestResponses =
      {
        operation:
          "replace",
        value:
          additional.selected,
      };
  }

  return {
    named,
    additional,
  };
}

export function buildSubmissionRequest({
  inviteCode,
  lookup,
  draft,
  clientSubmissionId,
}) {
  const errors = {};

  if (
    draft.completionMode !==
      "first" &&
    draft.completionMode !==
      "revision"
  ) {
    errors.completionMode =
      "Choose whether this is your first RSVP or an update to an earlier RSVP.";
  }

  const confirmation =
    buildConfirmation(
      draft,
      lookup,
      errors,
    );

  const changes = {};

  const attendingValues =
    attendanceArray(
      draft.attendance,
    );

  if (
    draft.completionMode ===
      "first" &&
    !draft.attendance.touched
  ) {
    errors.eventAttendance =
      "Choose your attendance.";
  }

  if (
    draft
      .attendance
      .touched
  ) {
    if (
      attendingValues.length ===
      0
    ) {
      errors.eventAttendance =
        "Choose Ceremony, Reception, both, or decline.";
    } else {
      changes.eventAttendance =
        {
          operation:
            "replace",
          value:
            attendingValues,
        };
    }
  }

  const isDecline =
    draft
      .attendance
      .touched &&
    attendingValues.includes(
      "decline",
    );

  if (!isDecline) {
    const requireComplete =
      draft.completionMode ===
      "first";

    const {
      named,
      additional,
    } =
      addAttendingRegions({
        draft,
        lookup,
        changes,
        errors,
        requireComplete,
      });

    const parsedTotals =
      parsedAttendanceTotals(
        draft
          .attendanceTotals,
      );

    const completeTotals =
      totalsAreComplete(
        draft
          .attendanceTotals,
      );

    const enteredTotalFields =
      ATTENDANCE_TOTAL_FIELDS.filter(
        (field) =>
          draft
            .attendanceTotals[
            field
          ] !== "",
      );

    if (
      enteredTotalFields.some(
        (field) =>
          !Number.isInteger(
            parsedTotals[
              field
            ],
          ),
      )
    ) {
      errors.attendanceTotals =
        "Attendance totals must be nonnegative whole numbers.";
    }

    const completePersonResponses =
      named.complete &&
      additional.complete;

    const derivedAttendance =
      completePersonResponses
        ? derivedOverallAttendance(
            {
              invitation:
                lookup
                  .invitation,

              namedInviteeResponses:
                named
                  .selected,

              additionalGuestResponses:
                additional
                  .selected,
            },
          )
        : null;

    if (
      requireComplete
    ) {
      if (
        !completeTotals
      ) {
        errors.attendanceTotals =
          "Enter all four attendance totals, including explicit zeroes.";
      } else if (
        Number.isInteger(
          derivedAttendance,
        ) &&
        derivedAttendance <
          1
      ) {
        errors.namedInviteeResponses =
          "At least one authorized attendee must be marked Yes when attending.";
      } else if (
        Number.isInteger(
          derivedAttendance,
        ) &&
        derivedAttendance >
          lookup
            .invitation
            .maximumAttendance
      ) {
        errors.additionalGuestResponses =
          "The selected attendees exceed this invitation's maximum capacity.";
      } else if (
        Number.isInteger(
          derivedAttendance,
        ) &&
        enteredAttendanceTotal(
          draft
            .attendanceTotals,
        ) !==
          derivedAttendance
      ) {
        errors.attendanceTotals =
          `The four age-category totals must add up to the ${derivedAttendance} people marked as attending.`;
      } else if (
        !errors
          .attendanceTotals
      ) {
        changes.attendanceTotals =
          {
            operation:
              "replace",
            value:
              parsedTotals,
          };
      }
    } else if (
      enteredTotalFields.length >
        0 &&
      !errors
        .attendanceTotals
    ) {
      const value =
        Object.fromEntries(
          enteredTotalFields.map(
            (field) => [
              field,
              parsedTotals[
                field
              ],
            ],
          ),
        );

      if (
        completePersonResponses &&
        completeTotals &&
        enteredAttendanceTotal(
          draft
            .attendanceTotals,
        ) !==
          derivedAttendance
      ) {
        errors.attendanceTotals =
          `The four age-category totals must add up to the ${derivedAttendance} people marked as attending.`;
      } else {
        changes.attendanceTotals =
          {
            operation:
              "replace",
            value,
          };
      }
    }

    const details =
      Array.isArray(
        draft
          .attendeeDetails,
      )
        ? draft
            .attendeeDetails
        : [];

    const detailsEntered =
      attendeeDetailsContainInput(
        details,
      );

    if (
      requireComplete
    ) {
      const normalized =
        validateAttendeeDetails(
          details,

          Number.isInteger(
            derivedAttendance,
          )
            ? derivedAttendance
            : null,

          {
            receptionSelected:
              draft
                .attendance
                .reception &&
              !draft
                .attendance
                .decline,

            errors,
          },
        );

      if (normalized) {
        changes.attendeeDetails =
          {
            operation:
              "replace",
            value:
              normalized,
          };
      }
    } else if (
      detailsEntered
    ) {
      const expectedCount =
        completeTotals
          ? enteredAttendanceTotal(
              draft
                .attendanceTotals,
            )
          : details.length;

      const receptionSelected =
        draft
          .attendance
          .touched
          ? (
              draft
                .attendance
                .reception &&
              !draft
                .attendance
                .decline
            )
          : true;

      const normalized =
        validateAttendeeDetails(
          details,
          expectedCount,
          {
            receptionSelected,
            errors,
          },
        );

      if (normalized) {
        changes.attendeeDetails =
          {
            operation:
              "replace",
            value:
              normalized,
          };
      }
    }
  }

  if (
    Object.keys(
      errors,
    ).length >
    0
  ) {
    return {
      ok: false,
      errors,
    };
  }

  return {
    ok: true,

    errors: {},

    request: {
      inviteCode,
      clientSubmissionId,
      confirmation,
      changes,
    },
  };
}

export function lookupFailureState(
  status,
) {
  if (
    status === 400 ||
    status === 404
  ) {
    return RSVP_STATES
      .INVALID_INVITATION;
  }

  if (
    status === 410
  ) {
    return RSVP_STATES
      .CLOSED;
  }

  return RSVP_STATES
    .SERVICE_UNAVAILABLE;
}

export function submitFailureState(
  status,
) {
  if (
    status === 400 ||
    status === 403
  ) {
    return RSVP_STATES
      .VALIDATION_FAILURE;
  }

  if (
    status === 410
  ) {
    return RSVP_STATES
      .CLOSED;
  }

  return RSVP_STATES
    .SERVICE_UNAVAILABLE;
}

export function isUsableConfirmation(
  payload,
) {
  return Boolean(
    payload &&
      payload
        .submission &&
      payload
        .submission
        .recorded ===
        true &&
      [
        "initial",
        "revision",
      ].includes(
        payload
          .submission
          .action,
      ) &&
      typeof payload
        .submission
        .recordedAt ===
        "string" &&
      payload
        .invitation &&
      typeof payload
        .invitation
        .partyDisplayName ===
        "string" &&
      payload.rsvp &&
      Array.isArray(
        payload
          .rsvp
          .eventAttendance,
      ) &&
      payload
        .confirmation &&
      [
        "email",
        "textMessage",
      ].includes(
        payload
          .confirmation
          .method,
      ) &&
      typeof payload
        .confirmation
        .deliveryWarning ===
        "boolean" &&
      payload
        .revisionPolicy &&
      typeof payload
        .revisionPolicy
        .deadline ===
        "string",
  );
}

export function confirmationState(
  payload,
) {
  if (
    !isUsableConfirmation(
      payload,
    )
  ) {
    return RSVP_STATES
      .CONFIRMATION_FALLBACK;
  }

  if (
    payload
      .confirmation
      .deliveryWarning
  ) {
    return RSVP_STATES
      .DELIVERY_WARNING;
  }

  return payload
    .submission
    .action ===
    "revision"
    ? RSVP_STATES
        .CONFIRMED_REVISION
    : RSVP_STATES
        .CONFIRMED_INITIAL;
}