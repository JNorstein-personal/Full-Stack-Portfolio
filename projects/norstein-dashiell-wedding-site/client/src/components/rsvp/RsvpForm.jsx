import { useEffect, useRef, useState } from "react";

import Button from "../common/Button";
import StatusMessage from "../common/StatusMessage";

import {
  ATTENDANCE_TOTAL_FIELDS,
  ATTENDANCE_TOTAL_LABELS,
  derivedOverallAttendance,
  enteredAttendanceTotal,
  isSinglePersonInvitation,
  resizeAttendeeDetails,
  shouldInferSingleInviteeAttendance,
  totalsAreComplete,
  toggleAttendance,
} from "../../services/rsvpModel.js";

function FieldError({ id, message }) {
  if (!message) {
    return null;
  }

  return (
    <p className="rsvp-field-error" id={id}>
      {message}
    </p>
  );
}

function describedBy(...ids) {
  const value = ids.filter(Boolean).join(" ");
  return value || undefined;
}

function errorTargetId(key) {
  const attendeeMatch = /^(\d+)\.(attendeeName|dietaryPreferences)$/.exec(key);

  if (attendeeMatch) {
    const [, index, field] = attendeeMatch;

    return field === "attendeeName"
      ? `rsvp-attendee-${index}-name`
      : `rsvp-attendee-${index}-dietary`;
  }

  return {
    completionMode: "rsvp-completion-mode",
    eventAttendance: "rsvp-event-attendance",
    namedInviteeResponses: "rsvp-named-invitees",
    additionalGuestResponses: "rsvp-additional-guests",
    attendanceTotals: "rsvp-attendance-totals",
    attendeeDetails: "rsvp-attendee-details",
    confirmationEmail: "rsvp-confirmation-email",
  }[key] ?? null;
}

function errorMessageId(key) {
  return `rsvp-error-${String(key).replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

function isYesNo(value) {
  return value === "yes" || value === "no";
}

function normalizedGroupedCount(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const parsed = Number(value);

  return Number.isInteger(parsed) ? parsed : null;
}

function allocationResponseIsComplete(allocation, response) {
  if (allocation.kind === "plus1") {
    return isYesNo(response);
  }

  if (allocation.kind !== "unnamedChildren") {
    return false;
  }

  if (!response || typeof response !== "object" || Array.isArray(response)) {
    return false;
  }

  if (response.attending === "no") {
    return normalizedGroupedCount(response.count) === 0;
  }

  if (response.attending !== "yes") {
    return false;
  }

  const count = normalizedGroupedCount(response.count);

  return (
    Number.isInteger(count) &&
    count >= 1 &&
    count <= allocation.maximumCount
  );
}

function personResponsesAreComplete(invitation, draft) {
  const namedInvitees = invitation.namedInvitees ?? [];
  const allocations = invitation.additionalGuestAllocations ?? [];

  const namedComplete =
    shouldInferSingleInviteeAttendance(
      invitation,
      draft.attendance,
    ) ||
    namedInvitees.every((invitee) =>
      isYesNo(
        draft.namedInviteeResponses?.[invitee.id],
      ),
    );

  const allocationsComplete = allocations.every((allocation) =>
    allocationResponseIsComplete(
      allocation,
      draft.additionalGuestResponses?.[allocation.id],
    ),
  );

  return namedComplete && allocationsComplete;
}

function additionalResponsesForDerivation(invitation, draft) {
  return Object.fromEntries(
    (invitation.additionalGuestAllocations ?? []).map((allocation) => {
      const response = draft.additionalGuestResponses?.[allocation.id];

      if (
        allocation.kind === "unnamedChildren" &&
        response &&
        typeof response === "object" &&
        !Array.isArray(response)
      ) {
        const count = normalizedGroupedCount(response.count);

        return [
          allocation.id,
          {
            attending: response.attending,
            count: Number.isInteger(count) ? count : response.count,
          },
        ];
      }

      return [allocation.id, response];
    }),
  );
}

function derivedAttendanceForDraft(invitation, draft) {
  const namedInviteeResponses =
    shouldInferSingleInviteeAttendance(
      invitation,
      draft.attendance,
    )
      ? {
          ...(draft.namedInviteeResponses ?? {}),
          [invitation.namedInvitees[0].id]:
            "yes",
        }
      : draft.namedInviteeResponses ?? {};

  return derivedOverallAttendance({
    invitation,
    namedInviteeResponses,
    additionalGuestResponses:
      additionalResponsesForDerivation(
        invitation,
        draft,
      ),
  });
}

function clearDietaryValues(details) {
  return details.map((detail) => ({
    ...detail,
    dietaryPreferences: "",
  }));
}

function allocationLegend(allocations) {
  const kinds = new Set(allocations.map((allocation) => allocation.kind));

  if (kinds.size > 1) {
    return "Additional Guests";
  }

  if (kinds.has("unnamedChildren")) {
    return "Children";
  }

  return allocations.length === 1
    ? "Plus 1"
    : "Plus 1 Guests";
}

function RsvpForm({
  lookup,
  draft,
  setDraft,
  errors,
  disabled = false,
  onSubmit,
}) {
  const validationSummaryRef = useRef(null);
  const previousDerivedAttendanceRef = useRef(null);

  const invitation = lookup.invitation;
  const namedInvitees = invitation.namedInvitees ?? [];
  const allocations = invitation.additionalGuestAllocations ?? [];
  const singlePersonInvitation =
    isSinglePersonInvitation(invitation);
  const wordingMode = invitation.wordingMode;

  const validationErrors = Object.entries(errors ?? {}).filter(
    ([, message]) => Boolean(message),
  );

  useEffect(() => {
    const hasValidationErrors =
      Object.values(errors ?? {}).some(Boolean);

    if (hasValidationErrors) {
      validationSummaryRef.current?.focus();
    }
  }, [errors]);

  function focusErrorTarget(event, targetId) {
    if (!targetId) {
      return;
    }

    event.preventDefault();

    const target = document.getElementById(targetId);

    if (!target) {
      return;
    }

    target.focus();
    target.scrollIntoView({
      block: "center",
    });
  }

  const attendanceQuestion = (lookup.questions ?? []).find(
    (question) => question.id === "eventAttendance",
  );

  const attendanceLabel =
    attendanceQuestion?.labelVariants?.[wordingMode] ??
    (wordingMode === "plural"
      ? "We will be attending (check all that apply):"
      : "I will be attending (check all that apply):");

  const attendanceOptions = attendanceQuestion?.options ?? [
    { value: "ceremony", label: "Ceremony" },
    { value: "reception", label: "Reception" },
    {
      value: "decline",
      labelVariants: {
        singular: "Regretfully, I am unable to attend.",
        plural: "Regretfully, we are unable to attend.",
      },
    },
  ];

  const total = enteredAttendanceTotal(draft.attendanceTotals);
  const completeTotals = totalsAreComplete(draft.attendanceTotals);
  const completePersonResponses = personResponsesAreComplete(
    invitation,
    draft,
  );
  const derivedAttendance = derivedAttendanceForDraft(invitation, draft);

  const attendingEventSelected =
    draft.attendance.ceremony || draft.attendance.reception;

  const showAttendingRegions =
    !draft.attendance.decline &&
    (draft.completionMode === "revision" || attendingEventSelected);

  const derivedAttendanceKnown = completePersonResponses;

  const dialLimit = derivedAttendanceKnown
    ? derivedAttendance
    : draft.completionMode === "revision"
      ? invitation.maximumAttendance
      : 0;

  const remaining = Math.max(0, dialLimit - total);

  const overAssigned = derivedAttendanceKnown
    ? Math.max(0, total - derivedAttendance)
    : 0;

  const [
    attendanceStatusMessage,
    setAttendanceStatusMessage,
  ] = useState("");

  useEffect(() => {
    if (!derivedAttendanceKnown) {
      previousDerivedAttendanceRef.current = null;
      return;
    }

    const previous =
      previousDerivedAttendanceRef.current;

    previousDerivedAttendanceRef.current =
      derivedAttendance;

    if (
      previous === null ||
      previous === derivedAttendance
    ) {
      return;
    }

    const remainingText =
  remaining > 0
    ? `${total} of ${derivedAttendance} guests have been counted by age group.`
    : remaining === 0 && overAssigned === 0
      ? "The age-group counts match the number of guests attending."
      : overAssigned > 0
        ? `The age-group counts are ${overAssigned} higher than the number of guests attending.`
        : "";

setAttendanceStatusMessage(
  `Total guests attending: ${derivedAttendance}. ${remainingText}`.trim(),
);
  }, [
    derivedAttendanceKnown,
    derivedAttendance,
    total,
    remaining,
    overAssigned,
  ]);

  const detailTargetCount = derivedAttendanceKnown
    ? derivedAttendance
    : draft.completionMode === "revision" &&
        draft.attendance.touched &&
        completeTotals
      ? total
      : null;

  function resizeDetailsForDraft(next) {
    if (next.attendance.decline) {
      return {
        ...next,
        attendeeDetails: [],
      };
    }

    const responsesComplete = personResponsesAreComplete(invitation, next);

    if (responsesComplete) {
      const count = derivedAttendanceForDraft(invitation, next);

      return {
        ...next,
        attendeeDetails: resizeAttendeeDetails(next.attendeeDetails, count),
      };
    }

    if (next.completionMode === "revision" && !next.attendance.touched) {
      return next;
    }

    if (
      next.completionMode === "revision" &&
      totalsAreComplete(next.attendanceTotals)
    ) {
      const count = enteredAttendanceTotal(next.attendanceTotals);

      return {
        ...next,
        attendeeDetails: resizeAttendeeDetails(next.attendeeDetails, count),
      };
    }

    return next;
  }

  function updateDraft(patch) {
    setDraft((current) => ({
      ...current,
      ...patch,
    }));
  }

  function updateAttendance(value) {
    setDraft((current) => {
      const attendance = toggleAttendance(current.attendance, value);

      let next = {
        ...current,
        attendance,
      };

      if (attendance.decline) {
        return {
          ...next,
          attendeeDetails: [],
        };
      }

      if (!attendance.reception) {
        next = {
          ...next,
          attendeeDetails: clearDietaryValues(next.attendeeDetails),
        };
      }

      return resizeDetailsForDraft(next);
    });
  }

  function updateNamedInvitee(id, value) {
    setDraft((current) =>
      resizeDetailsForDraft({
        ...current,
        namedInviteeResponses: {
          ...current.namedInviteeResponses,
          [id]: value,
        },
      }),
    );
  }

  function updatePlus1(allocation, value) {
    setDraft((current) =>
      resizeDetailsForDraft({
        ...current,
        additionalGuestResponses: {
          ...current.additionalGuestResponses,
          [allocation.id]: value,
        },
      }),
    );
  }

  function updateGroupedChildAttendance(allocation, attending) {
    setDraft((current) => {
      const prior = current.additionalGuestResponses?.[allocation.id];
      const priorCount = normalizedGroupedCount(prior?.count);

      const response =
        attending === "no"
          ? {
              attending: "no",
              count: 0,
            }
          : {
              attending: "yes",
              count:
                Number.isInteger(priorCount) &&
                priorCount >= 1 &&
                priorCount <= allocation.maximumCount
                  ? priorCount
                  : "",
            };

      return resizeDetailsForDraft({
        ...current,
        additionalGuestResponses: {
          ...current.additionalGuestResponses,
          [allocation.id]: response,
        },
      });
    });
  }

  function updateGroupedChildCount(allocation, value) {
    setDraft((current) =>
      resizeDetailsForDraft({
        ...current,
        additionalGuestResponses: {
          ...current.additionalGuestResponses,
          [allocation.id]: {
            attending: "yes",
            count: value === "" ? "" : Number(value),
          },
        },
      }),
    );
  }

  function setTotal(field, value) {
    setDraft((current) => {
      const next = {
        ...current,
        attendanceTotals: {
          ...current.attendanceTotals,
          [field]: value === "" ? "" : String(value),
        },
      };

      return resizeDetailsForDraft(next);
    });
  }

  function currentDialValue(field) {
    const raw = draft.attendanceTotals[field];

    if (raw === "") {
      return 0;
    }

    const parsed = Number(raw);

    return Number.isInteger(parsed) && parsed >= 0 ? parsed : 0;
  }

  function maximumDialValue(field) {
    const currentValue = currentDialValue(field);
    const assignedElsewhere = Math.max(0, total - currentValue);

    return Math.max(0, dialLimit - assignedElsewhere);
  }

  function adjustTotal(field, delta) {
    const currentValue = currentDialValue(field);
    const fieldMaximum = maximumDialValue(field);

    if (delta > 0 && currentValue >= fieldMaximum) {
      return;
    }

    setTotal(field, Math.max(0, currentValue + delta));
  }

  function updateAttendeeDetail(index, field, value) {
    setDraft((current) => ({
      ...current,
      attendeeDetails: current.attendeeDetails.map((detail, detailIndex) =>
        detailIndex === index
          ? {
              ...detail,
              [field]: value,
            }
          : detail,
      ),
    }));
  }

  function updateConfirmation(patch) {
    setDraft((current) => ({
      ...current,
      confirmation: {
        ...current.confirmation,
        ...patch,
      },
    }));
  }

  return (
    <form
      className="form-stack rsvp-form"
      onSubmit={onSubmit}
      noValidate
    >
      {validationErrors.length > 0 && (
        <section
          className="rsvp-validation-summary rsvp-focus-target"
          ref={validationSummaryRef}
          tabIndex="-1"
          role="alert"
          aria-labelledby="rsvp-validation-summary-title"
        >
          <h2 id="rsvp-validation-summary-title">
            Please review your RSVP
          </h2>

          <p>
            Please correct the items below and submit again. Everything else you entered will stay as you left it.
          </p>

          <ul>
            {validationErrors.map(([key, message]) => {
              const targetId = errorTargetId(key);

              return (
                <li key={key}>
                  {targetId ? (
                    <a
                      href={`#${targetId}`}
                      onClick={(event) =>
                        focusErrorTarget(event, targetId)
                      }
                    >
                      {message}
                    </a>
                  ) : (
                    message
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <fieldset
        id="rsvp-completion-mode"
        className="rsvp-focus-target"
        tabIndex="-1"
        disabled={disabled}
        aria-describedby={describedBy(
          "rsvp-completion-mode-help",
          errors.completionMode
            ? errorMessageId("completionMode")
            : null,
        )}
      >
        <legend>Is this your first RSVP or an update?</legend>

        <p className="form-help" id="rsvp-completion-mode-help">
          Choose one below. If this is your first RSVP, complete all required questions. If you’re updating an RSVP, you only need to change answers that are different unless the form asks you to re-enter related details.
        </p>

        <label className="form-choice">
          <input
            id="rsvp-completion-mode-first"
            type="radio"
            name="completionMode"
            value="first"
            required
            aria-required="true"
            aria-describedby={describedBy(
              "rsvp-completion-mode-help",
              errors.completionMode
                ? errorMessageId("completionMode")
                : null,
            )}
            checked={draft.completionMode === "first"}
            onChange={() =>
              updateDraft({
                completionMode: "first",
              })
            }
          />
          <span>This is my first RSVP.</span>
        </label>

        <label className="form-choice">
          <input
            id="rsvp-completion-mode-revision"
            type="radio"
            name="completionMode"
            value="revision"
            required
            aria-required="true"
            aria-describedby={describedBy(
              "rsvp-completion-mode-help",
              errors.completionMode
                ? errorMessageId("completionMode")
                : null,
            )}
            checked={draft.completionMode === "revision"}
            onChange={() =>
              updateDraft({
                completionMode: "revision",
              })
            }
          />
          <span>I'm updating an earlier RSVP.</span>
        </label>

        <FieldError
          id={errorMessageId("completionMode")}
          message={errors.completionMode}
        />
      </fieldset>

      <fieldset
        id="rsvp-event-attendance"
        className="rsvp-focus-target"
        tabIndex="-1"
        disabled={disabled}
        aria-describedby={describedBy(
          "rsvp-event-attendance-help",
          errors.eventAttendance
            ? errorMessageId("eventAttendance")
            : null,
        )}
      >
        <legend>Attendance</legend>

        <p className="form-help" id="rsvp-event-attendance-help">
          {attendanceLabel} Choose Ceremony, Reception, both, or the decline option. You can leave this section blank if you're updating your RSVP but your overall attendance plans haven't changed.
        </p>

        {attendanceOptions.map((option) => {
          const label =
            option.label ?? option.labelVariants?.[wordingMode] ?? option.value;

          const optionDisabled =
            option.value === "decline"
              ? attendingEventSelected
              : draft.attendance.decline;

          return (
            <label className="form-choice" key={option.value}>
              <input
                id={`rsvp-attendance-${option.value}`}
                type="checkbox"
                checked={Boolean(draft.attendance[option.value])}
                disabled={disabled || optionDisabled}
                aria-describedby={describedBy(
                  "rsvp-event-attendance-help",
                  errors.eventAttendance
                    ? errorMessageId("eventAttendance")
                    : null,
                )}
                onChange={() => updateAttendance(option.value)}
              />
              <span>{label}</span>
            </label>
          );
        })}
        <FieldError
          id={errorMessageId("eventAttendance")}
          message={errors.eventAttendance}
        />
      </fieldset>

      {showAttendingRegions &&
        namedInvitees.length > 0 &&
        !singlePersonInvitation && (
        <fieldset
          id="rsvp-named-invitees"
          className="rsvp-focus-target"
          tabIndex="-1"
          disabled={disabled}
          aria-describedby={describedBy(
            "rsvp-named-invitees-help",
            errors.namedInviteeResponses
              ? errorMessageId("namedInviteeResponses")
              : null,
          )}
        >
          <legend>Who Is Attending?</legend>

          <p className="form-help" id="rsvp-named-invitees-help">
            Tell us whether each person listed below will attend. If you’re updating an RSVP, leave an answer blank if that person’s plans HAVE NOT changed.
          </p>

          {namedInvitees.map((invitee) => (
            <div
              className="rsvp-question-group"
              key={invitee.id}
              role="group"
              aria-labelledby={`rsvp-named-${invitee.id}-question`}
              aria-describedby={
                errors.namedInviteeResponses
                  ? errorMessageId("namedInviteeResponses")
                  : undefined
              }
            >
              <p id={`rsvp-named-${invitee.id}-question`}>
                <strong>Will {invitee.displayName} attend?</strong>
              </p>

              <div className="rsvp-inline-choices">
                {[
                  ["yes", "Yes"],
                  ["no", "No"],
                ].map(([value, label]) => (
                  <label className="form-choice" key={value}>
                    <input
                      type="radio"
                      name={`named-${invitee.id}`}
                      value={value}
                      required={draft.completionMode === "first"}
                      aria-required={
                        draft.completionMode === "first"
                          ? "true"
                          : undefined
                      }
                      checked={
                        draft.namedInviteeResponses?.[invitee.id] === value
                      }
                      onChange={() => updateNamedInvitee(invitee.id, value)}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <FieldError
            id={errorMessageId("namedInviteeResponses")}
            message={errors.namedInviteeResponses}
          />
        </fieldset>
      )}

      {showAttendingRegions && allocations.length > 0 && (
        <fieldset
          id="rsvp-additional-guests"
          className="rsvp-focus-target"
          tabIndex="-1"
          disabled={disabled}
          aria-describedby={describedBy(
            "rsvp-additional-guests-help",
            errors.additionalGuestResponses
              ? errorMessageId("additionalGuestResponses")
              : null,
          )}
        >
          <legend>{allocationLegend(allocations)}</legend>

          <p className="form-help" id="rsvp-additional-guests-help">
            Answer the additional-guest questions below. If your children are attending, let us know how many. When updating an RSVP, leave an answer blank if it has not changed. (NOTE: If you change whether children are attending—or how many—you’ll need to re-enter the full guest list below.)
          </p>

          {allocations.map((allocation) => {
            if (allocation.kind === "unnamedChildren") {
              const response =
                draft.additionalGuestResponses?.[allocation.id] ?? {
                  attending: "",
                  count: "",
                };

              return (
                <div
                  className="rsvp-question-group"
                  key={allocation.id}
                  role="group"
                  aria-labelledby={`rsvp-allocation-${allocation.id}-question`}
                  aria-describedby={
                    errors.additionalGuestResponses
                      ? errorMessageId("additionalGuestResponses")
                      : undefined
                  }
                >
                  <p id={`rsvp-allocation-${allocation.id}-question`}>
                    <strong>{allocation.prompt}</strong>
                  </p>

                  <div className="rsvp-inline-choices">
                    {[
                      ["yes", "Yes"],
                      ["no", "No"],
                    ].map(([value, label]) => (
                      <label className="form-choice" key={value}>
                        <input
                          type="radio"
                          name={`children-${allocation.id}`}
                          value={value}
                          required={draft.completionMode === "first"}
                          aria-required={
                            draft.completionMode === "first"
                              ? "true"
                              : undefined
                          }
                          checked={response.attending === value}
                          onChange={() =>
                            updateGroupedChildAttendance(allocation, value)
                          }
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>

                  {response.attending === "yes" && (
                    <div className="form-field">
                      <label htmlFor={`rsvp-children-count-${allocation.id}`}>
                        How many?
                      </label>

                      <select
                        id={`rsvp-children-count-${allocation.id}`}
                        value={response.count ?? ""}
                        required
                        aria-required="true"
                        aria-describedby={describedBy(
                          errors.additionalGuestResponses
                            ? errorMessageId("additionalGuestResponses")
                            : null,
                        )}
                        onChange={(event) =>
                          updateGroupedChildCount(allocation, event.target.value)
                        }
                      >
                        <option value="">Select one</option>
                        {Array.from(
                          { length: allocation.maximumCount },
                          (_, index) => index + 1,
                        ).map((count) => (
                          <option value={count} key={count}>
                            {count}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              );
            }

            const response = draft.additionalGuestResponses?.[allocation.id];

            return (
              <div
                className="rsvp-question-group"
                key={allocation.id}
                role="group"
                aria-labelledby={`rsvp-allocation-${allocation.id}-question`}
                aria-describedby={
                  errors.additionalGuestResponses
                    ? errorMessageId("additionalGuestResponses")
                    : undefined
                }
              >
                <p id={`rsvp-allocation-${allocation.id}-question`}>
                  <strong>{allocation.prompt}</strong>
                </p>

                <div className="rsvp-inline-choices">
                  {[
                    ["yes", "Yes"],
                    ["no", "No"],
                  ].map(([value, label]) => (
                    <label className="form-choice" key={value}>
                      <input
                        type="radio"
                        name={`allocation-${allocation.id}`}
                        value={value}
                        required={draft.completionMode === "first"}
                        aria-required={
                          draft.completionMode === "first"
                            ? "true"
                            : undefined
                        }
                        checked={response === value}
                        onChange={() => updatePlus1(allocation, value)}
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}

          <FieldError
            id={errorMessageId("additionalGuestResponses")}
            message={errors.additionalGuestResponses}
          />
        </fieldset>
      )}

      {showAttendingRegions && (
        <fieldset
          id="rsvp-attendance-totals"
          className="rsvp-focus-target"
          tabIndex="-1"
          disabled={disabled}
          aria-describedby={describedBy(
            "rsvp-attendance-totals-help",
            errors.attendanceTotals
              ? errorMessageId("attendanceTotals")
              : null,
          )}
        >
          <legend>Guest Age Groups</legend>

          <p className="form-help" id="rsvp-attendance-totals-help">
            To better accommodate the seating and dietary needs of our guests, please tell us how many guests attending fall into each age group.
          </p>

          {draft.completionMode === "first" && !completePersonResponses ? (
            <StatusMessage
              type="information"
              title="Tell us who is attending first"
            >
              Answer Yes or No for each guest above. Once we know how many
              people are attending, you can enter their age groups below.
            </StatusMessage>
          ) : derivedAttendanceKnown && derivedAttendance < 1 ? (
            <StatusMessage
              type="information"
              title="No guests are marked as attending yet"
            >
              You selected the Ceremony and/or Reception, so mark Yes for at
              least one guest above before entering age groups below.
            </StatusMessage>
          ) : (
            <>

              {derivedAttendanceKnown && (
                <div className="rsvp-total-summary">
                  <span>
                    Total guests attending:{" "}
                    <strong>{derivedAttendance}</strong>
                  </span>

                  <span>
                    Age groups completed for:{" "}
                    <strong>{total} of {derivedAttendance} guests</strong>
                  </span>

                  {overAssigned > 0 && (
                    <span>
                      Your age-group counts are{" "}
                      <strong>{overAssigned}</strong> too high. Adjust them so
                      they add up to the number of guests attending.
                    </span>
                  )}

                  {overAssigned === 0 && remaining === 0 && (
                    <span>
                      Your age-group counts match the number of guests attending.
                    </span>
                  )}
                </div>
              )}

              <p
                className="rsvp-status-announcement"
                role="status"
                aria-live="polite"
                aria-atomic="true"
              >
                {attendanceStatusMessage}
              </p>

              <div className="rsvp-dial-list">
                {ATTENDANCE_TOTAL_FIELDS.map((field) => {
                  const currentValue = currentDialValue(field);
                  const fieldMaximum = maximumDialValue(field);

                  return (
                    <div className="rsvp-dial" key={field}>
                      <label htmlFor={`rsvp-total-${field}`}>
                        {ATTENDANCE_TOTAL_LABELS[field]}
                      </label>

                      <div className="rsvp-dial__controls">
                        <Button
                          variant="secondary"
                          className="rsvp-dial__button"
                          type="button"
                          aria-label={`Decrease ${ATTENDANCE_TOTAL_LABELS[field]}`}
                          disabled={disabled || currentValue <= 0}
                          onClick={() => adjustTotal(field, -1)}
                        >
                          −
                        </Button>

                        <input
                          id={`rsvp-total-${field}`}
                          type="number"
                          min="0"
                          max={fieldMaximum}
                          step="1"
                          inputMode="numeric"
                          value={draft.attendanceTotals[field]}
                          placeholder="0"
                          onChange={(event) =>
                            setTotal(field, event.target.value)
                          }
                          aria-invalid={
                            errors.attendanceTotals ? "true" : undefined
                          }
                          aria-describedby={describedBy(
                            "rsvp-attendance-totals-help",
                            errors.attendanceTotals
                              ? errorMessageId("attendanceTotals")
                              : null,
                          )}
                        />

                        <Button
                          variant="secondary"
                          className="rsvp-dial__button"
                          type="button"
                          aria-label={`Increase ${ATTENDANCE_TOTAL_LABELS[field]}`}
                          disabled={
                            disabled || currentValue >= fieldMaximum
                          }
                          onClick={() => adjustTotal(field, 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {draft.completionMode === "revision" && (
                <p className="form-help">
                  Updating an RSVP? Leave an age group blank if its number
                  hasn’t changed. Enter 0 if that age group should now have no
                  guests. If you’re changing who is attending, answer all of
                  the guest attendance questions above first.
                </p>
              )}
            </>
          )}

          <FieldError
            id={errorMessageId("attendanceTotals")}
            message={errors.attendanceTotals}
          />
        </fieldset>
      )}

      {showAttendingRegions && (
        <fieldset
          id="rsvp-attendee-details"
          className="rsvp-focus-target"
          tabIndex="-1"
          disabled={disabled}
          aria-describedby={describedBy(
            "rsvp-attendee-details-help",
            errors.attendeeDetails
              ? errorMessageId("attendeeDetails")
              : null,
          )}
        >
          <legend>Guest Details</legend>

          <p className="form-help" id="rsvp-attendee-details-help">
            Enter the name of each person attending, including any Plus 1
            guests and children counted above. If Reception is selected, you
            can also add dietary or allergy information for each person.
          </p>

          {draft.completionMode === "revision" &&
            !draft.attendance.touched &&
            derivedAttendanceKnown && (
              <p className="form-help">
              You’re leaving your Ceremony and Reception choices unchanged.
              You can update guest names below. If Reception is still part of
              your RSVP and you need to update dietary or allergy
              information, select your current Attendance choice above so
              those fields appear.
              </p>
            )}

          {detailTargetCount === null ? (
            <StatusMessage
              type="information"
              title={
                draft.completionMode === "revision"
                  ? "Updating guest details?"
                  : "Tell us who is attending first"
              }
            >
              {draft.completionMode === "revision"
                ? "If your guest list hasn’t changed, leave this section blank. To change who is attending, answer all of the Yes or No guest questions above first. We’ll then show the right number of name fields."
                : "Answer the guest attendance questions above first. We’ll then show one name field for each person attending."}
            </StatusMessage>
          ) : detailTargetCount < 1 ? (
            <StatusMessage
              type="information"
              title="No guests are marked as attending yet"
            >
              Mark Yes for at least one guest above. If no one will attend,
              choose the decline option under Attendance instead.
            </StatusMessage>
          ) : (
            <>
              <div className="rsvp-attendee-list">
                {draft.attendeeDetails.map((detail, index) => (
                  <section
                    className="rsvp-attendee-card"
                    key={index}
                  >
                    <h3>Attendee {index + 1}</h3>

                    <div className="form-field">
                      <label htmlFor={`rsvp-attendee-${index}-name`}>
                        Guest name
                      </label>

                      <input
                        id={`rsvp-attendee-${index}-name`}
                        className="rsvp-focus-target"
                        type="text"
                        required
                        aria-required="true"
                        maxLength="100"
                        value={detail.attendeeName}
                        aria-invalid={
                          errors[`${index}.attendeeName`]
                            ? "true"
                            : undefined
                        }
                        aria-describedby={describedBy(
                          `rsvp-attendee-${index}-name-help`,
                          errors[`${index}.attendeeName`]
                            ? errorMessageId(`${index}.attendeeName`)
                            : null,
                          errors.attendeeDetails
                            ? errorMessageId("attendeeDetails")
                            : null,
                        )}
                        onChange={(event) =>
                          updateAttendeeDetail(
                            index,
                            "attendeeName",
                            event.target.value,
                          )
                        }
                      />

                      <p
                        className="form-help"
                        id={`rsvp-attendee-${index}-name-help`}
                      >
                        Required. Up to 100 characters.
                      </p>

                      <FieldError
                        id={errorMessageId(`${index}.attendeeName`)}
                        message={errors[`${index}.attendeeName`]}
                      />
                    </div>

                    {draft.attendance.reception && (
                      <div className="form-field">
                        <label htmlFor={`rsvp-attendee-${index}-dietary`}>
                          Dietary or allergy information
                        </label>

                        <textarea
                          id={`rsvp-attendee-${index}-dietary`}
                          maxLength="1000"
                          value={detail.dietaryPreferences ?? ""}
                          aria-invalid={
                            errors[`${index}.dietaryPreferences`]
                              ? "true"
                              : undefined
                          }
                          aria-describedby={describedBy(
                            `rsvp-attendee-${index}-dietary-help`,
                            errors[`${index}.dietaryPreferences`]
                              ? errorMessageId(
                                  `${index}.dietaryPreferences`,
                                )
                              : null,
                          )}
                          onChange={(event) =>
                            updateAttendeeDetail(
                              index,
                              "dietaryPreferences",
                              event.target.value,
                            )
                          }
                        />

                        <p
                          className="form-help"
                          id={`rsvp-attendee-${index}-dietary-help`}
                        >
                          Optional. Up to 1000 characters.
                        </p>

                        <FieldError
                          id={errorMessageId(
                            `${index}.dietaryPreferences`,
                          )}
                          message={errors[`${index}.dietaryPreferences`]}
                        />
                      </div>
                    )}
                  </section>
                ))}
              </div>
            </>
          )}

          <FieldError
            id={errorMessageId("attendeeDetails")}
            message={errors.attendeeDetails}
          />
        </fieldset>
      )}

      <fieldset
        id="rsvp-confirmation-email-section"
        className="rsvp-focus-target"
        tabIndex="-1"
        disabled={disabled}
        aria-describedby="rsvp-confirmation-email-section-help"
      >
        <legend>Email Confirmation</legend>

        <p
          className="form-help"
          id="rsvp-confirmation-email-section-help"
        >
          Enter the email address where you’d like us to send your RSVP
          confirmation. To protect your privacy, we'll ask for your email each time you submit or update an RSVP, and we won’t display any address you entered previously.
        </p>

  <div className="form-field rsvp-confirmation-destination">
          <label htmlFor="rsvp-confirmation-email">
            Confirmation email address
          </label>

          <input
            id="rsvp-confirmation-email"
            type="email"
            autoComplete="email"
            required
            aria-required="true"
            value={draft.confirmation.email}
            aria-invalid={
              errors.confirmationEmail
                ? "true"
                : undefined
            }
            aria-describedby={describedBy(
              "rsvp-confirmation-email-section-help",
              errors.confirmationEmail
                ? errorMessageId("confirmationEmail")
                : null,
            )}
            onChange={(event) =>
              updateConfirmation({
                email: event.target.value,
              })
            }
          />

          <FieldError
            id={errorMessageId("confirmationEmail")}
            message={errors.confirmationEmail}
          />
        </div>
      </fieldset>
      <Button
        type="submit"
        disabled={disabled}
      >
        Submit RSVP
      </Button>
    </form>
  );
}

export default RsvpForm;
