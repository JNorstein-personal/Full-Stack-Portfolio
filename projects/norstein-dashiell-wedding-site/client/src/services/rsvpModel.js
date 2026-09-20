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

export const ATTENDANCE_TOTAL_FIELDS =
  Object.freeze([
    "adults21Plus",
    "youngAdults18To20",
    "children3To17",
    "childrenUnder3",
  ]);

export const ATTENDANCE_TOTAL_LABELS =
  Object.freeze({
    adults21Plus: "Adults, ages 21+",
    youngAdults18To20:
      "Young Adults, ages 18–20",
    children3To17:
      "Children, ages 3–17",
    childrenUnder3:
      "Children under 3",
  });

export function createBlankDraft(
  lookup,
) {
  const allocations =
    lookup?.invitation
      ?.additionalGuestAllocations ??
    [];

  return {
    completionMode: "",
    attendance: {
      ceremony: false,
      reception: false,
      decline: false,
      touched: false,
    },
    additionalGuestResponses:
      Object.fromEntries(
        allocations.map(
          (allocation) => [
            allocation.id,
            "",
          ],
        ),
      ),
    attendanceTotals:
      Object.fromEntries(
        ATTENDANCE_TOTAL_FIELDS.map(
          (field) => [field, ""],
        ),
      ),
    receptionAttendeeDetails: [],
    confirmation: {
      method:
        lookup?.confirmationOptions
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
  const next = {
    ...attendance,
    touched: true,
  };

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

  next[value] =
    !attendance[value];

  if (next[value]) {
    next.decline = false;
  }

  return next;
}

export function attendanceArray(
  attendance,
) {
  if (attendance.decline) {
    return ["decline"];
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

function parseWholeNumber(value) {
  if (
    value === "" ||
    value === null ||
    value === undefined
  ) {
    return null;
  }

  const number = Number(value);

  return Number.isInteger(number) &&
    number >= 0
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
    (sum, field) => {
      const value =
        parsed[field];

      return Number.isInteger(value)
        ? sum + value
        : sum;
    },
    0,
  );
}

export function resizeReceptionDetails(
  current,
  count,
) {
  const safeCount =
    Number.isInteger(count) &&
    count > 0
      ? count
      : 0;

  return Array.from(
    {
      length: safeCount,
    },
    (_, index) =>
      current[index] ?? {
        attendeeName: "",
        dietaryPreferences: "",
      },
  );
}

function buildConfirmation(
  draft,
  lookup,
  errors,
) {
  const options =
    lookup.confirmationOptions ??
    {};

  if (
    draft.confirmation.method ===
    "email"
  ) {
    if (!options.email) {
      errors.confirmationMethod =
        "Email confirmation is not available.";
      return null;
    }

    const email =
      draft.confirmation.email
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
    draft.confirmation.method ===
    "textMessage"
  ) {
    if (!options.textMessage) {
      errors.confirmationMethod =
        "Text Message confirmation is not available.";
      return null;
    }

    const mobile =
      draft.confirmation.mobile
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
      !draft.confirmation
        .smsAuthorization
    ) {
      errors.smsAuthorization =
        "Authorization is required for text confirmation.";
      return null;
    }

    const confirmation = {
      method: "textMessage",
      mobile,
    };

    if (
      options
        .smsAuthorizationRequired
    ) {
      confirmation.smsAuthorization =
        true;
    }

    return confirmation;
  }

  errors.confirmationMethod =
    "Select a confirmation method.";
  return null;
}

function validateReceptionDetails(
  details,
  expectedCount,
  errors,
) {
  if (
    !Number.isInteger(
      expectedCount,
    ) ||
    expectedCount < 1
  ) {
    errors.receptionAttendeeDetails =
      "Complete the attendance totals before entering Reception attendee details.";
    return false;
  }

  if (
    details.length !==
    expectedCount
  ) {
    errors.receptionAttendeeDetails =
      "Provide one Reception attendee entry for every person attending.";
    return false;
  }

  const itemErrors = {};

  details.forEach(
    (detail, index) => {
      const name =
        detail.attendeeName
          .trim();
      const dietary =
        detail
          .dietaryPreferences ??
        "";

      if (
        name.length < 1 ||
        name.length > 100
      ) {
        itemErrors[
          `${index}.attendeeName`
        ] =
          "Enter an attendee name of 100 characters or fewer.";
      }

      if (
        dietary.length > 1000
      ) {
        itemErrors[
          `${index}.dietaryPreferences`
        ] =
          "Dietary/allergy information must be 1000 characters or fewer.";
      }
    },
  );

  Object.assign(
    errors,
    itemErrors,
  );

  return (
    Object.keys(itemErrors)
      .length === 0
  );
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
    draft.attendance.touched
  ) {
    if (
      attendingValues.length === 0
    ) {
      errors.eventAttendance =
        "Choose Ceremony, Reception, both, or decline.";
    } else {
      changes.eventAttendance = {
        operation: "replace",
        value: attendingValues,
      };
    }
  }

  const isDecline =
    draft.attendance.touched &&
    attendingValues.includes(
      "decline",
    );

  const shouldValidateAttending =
    draft.completionMode ===
      "first"
      ? !isDecline
      : (
          draft.attendance.touched &&
          !isDecline
        );

  const allocationEntries =
    Object.entries(
      draft
        .additionalGuestResponses,
    );
  const selectedAllocations =
    Object.fromEntries(
      allocationEntries.filter(
        ([, value]) =>
          value === "yes" ||
          value === "no",
      ),
    );

  if (
    draft.completionMode ===
      "first" &&
    shouldValidateAttending
  ) {
    const missing =
      allocationEntries.some(
        ([, value]) =>
          value !== "yes" &&
          value !== "no",
      );

    if (missing) {
      errors.additionalGuestResponses =
        "Answer every authorized Plus 1 question.";
    } else if (
      allocationEntries.length > 0
    ) {
      changes.additionalGuestResponses = {
        operation: "replace",
        value:
          selectedAllocations,
      };
    }
  } else if (
    !isDecline &&
    Object.keys(
      selectedAllocations,
    ).length > 0
  ) {
    changes.additionalGuestResponses = {
      operation: "replace",
      value:
        selectedAllocations,
    };
  }

  const parsedTotals =
    parsedAttendanceTotals(
      draft.attendanceTotals,
    );
  const completeTotals =
    totalsAreComplete(
      draft.attendanceTotals,
    );
  const enteredTotalFields =
    ATTENDANCE_TOTAL_FIELDS.filter(
      (field) =>
        draft.attendanceTotals[
          field
        ] !== "",
    );

  if (
    enteredTotalFields.some(
      (field) =>
        !Number.isInteger(
          parsedTotals[field],
        ),
    )
  ) {
    errors.attendanceTotals =
      "Attendance totals must be nonnegative whole numbers.";
  }

  if (
    draft.completionMode ===
      "first" &&
    shouldValidateAttending
  ) {
    if (!completeTotals) {
      errors.attendanceTotals =
        "Enter all four attendance totals, including explicit zeroes.";
    } else {
      const total =
        enteredAttendanceTotal(
          draft.attendanceTotals,
        );

      if (
        total < 1 ||
        total >
          lookup.invitation
            .maximumAttendance
      ) {
        errors.attendanceTotals =
          `Overall attendance must be between 1 and ${lookup.invitation.maximumAttendance}.`;
      } else {
        changes.attendanceTotals = {
          operation: "replace",
          value: parsedTotals,
        };
      }
    }
  } else if (
    !isDecline &&
    enteredTotalFields.length > 0 &&
    !errors.attendanceTotals
  ) {
    const value =
      Object.fromEntries(
        enteredTotalFields.map(
          (field) => [
            field,
            parsedTotals[field],
          ],
        ),
      );

    changes.attendanceTotals = {
      operation: "replace",
      value,
    };
  }

  const receptionSelected =
    draft.attendance.touched &&
    draft.attendance.reception &&
    !draft.attendance.decline;

  const detailsEntered =
    draft.receptionAttendeeDetails
      .some(
        (detail) =>
          detail.attendeeName
            .trim() !== "" ||
          (
            detail
              .dietaryPreferences ??
            ""
          ).trim() !== "",
      );

  if (
    draft.completionMode ===
      "first" &&
    receptionSelected
  ) {
    const total =
      completeTotals
        ? enteredAttendanceTotal(
            draft.attendanceTotals,
          )
        : null;

    if (
      validateReceptionDetails(
        draft
          .receptionAttendeeDetails,
        total,
        errors,
      )
    ) {
      changes.receptionAttendeeDetails =
        {
          operation: "replace",
          value:
            draft
              .receptionAttendeeDetails
              .map((detail) => ({
                attendeeName:
                  detail
                    .attendeeName
                    .trim(),
                dietaryPreferences:
                  (
                    detail
                      .dietaryPreferences ??
                    ""
                  ).trim(),
              })),
        };
    }
  } else if (
    !isDecline &&
    detailsEntered
  ) {
    const total =
      completeTotals
        ? enteredAttendanceTotal(
            draft.attendanceTotals,
          )
        : draft
            .receptionAttendeeDetails
            .length;

    if (
      validateReceptionDetails(
        draft
          .receptionAttendeeDetails,
        total,
        errors,
      )
    ) {
      changes.receptionAttendeeDetails =
        {
          operation: "replace",
          value:
            draft
              .receptionAttendeeDetails
              .map((detail) => ({
                attendeeName:
                  detail
                    .attendeeName
                    .trim(),
                dietaryPreferences:
                  (
                    detail
                      .dietaryPreferences ??
                    ""
                  ).trim(),
              })),
        };
    }
  }

  const yesCount =
    Object.values(
      selectedAllocations,
    ).filter(
      (value) => value === "yes",
    ).length;

  if (
    completeTotals &&
    !isDecline &&
    yesCount >
      enteredAttendanceTotal(
        draft.attendanceTotals,
      )
  ) {
    errors.additionalGuestResponses =
      "The attending party total cannot be smaller than the number of accepted Plus 1 allocations.";
  }

  if (
    Object.keys(errors).length >
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

  if (status === 410) {
    return RSVP_STATES.CLOSED;
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

  if (status === 410) {
    return RSVP_STATES.CLOSED;
  }

  return RSVP_STATES
    .SERVICE_UNAVAILABLE;
}

export function isUsableConfirmation(
  payload,
) {
  return Boolean(
    payload &&
    payload.submission &&
    payload.submission.recorded ===
      true &&
    [
      "initial",
      "revision",
    ].includes(
      payload.submission.action,
    ) &&
    typeof payload
      .submission.recordedAt ===
      "string" &&
    payload.invitation &&
    typeof payload.invitation
      .partyDisplayName ===
      "string" &&
    payload.rsvp &&
    Array.isArray(
      payload.rsvp
        .eventAttendance,
    ) &&
    payload.confirmation &&
    [
      "email",
      "textMessage",
    ].includes(
      payload.confirmation.method,
    ) &&
    typeof payload.confirmation
      .deliveryWarning ===
      "boolean" &&
    payload.revisionPolicy &&
    typeof payload.revisionPolicy
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
    payload.confirmation
      .deliveryWarning
  ) {
    return RSVP_STATES
      .DELIVERY_WARNING;
  }

  return payload.submission
    .action === "revision"
    ? RSVP_STATES
        .CONFIRMED_REVISION
    : RSVP_STATES
        .CONFIRMED_INITIAL;
}
