import { useEffect, useRef, useState } from "react";

import Button from "../common/Button";
import StatusMessage from "../common/StatusMessage";

import {
  ATTENDANCE_TOTAL_FIELDS,
  ATTENDANCE_TOTAL_LABELS,
  derivedOverallAttendance,
  enteredAttendanceTotal,
  resizeAttendeeDetails,
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
    confirmationMethod: "rsvp-confirmation-method",
    confirmationEmail: "rsvp-confirmation-email",
    confirmationMobile: "rsvp-confirmation-mobile",
    smsAuthorization: "rsvp-sms-authorization",
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

  const namedComplete = namedInvitees.every((invitee) =>
    isYesNo(draft.namedInviteeResponses?.[invitee.id]),
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
  return derivedOverallAttendance({
    invitation,
    namedInviteeResponses: draft.namedInviteeResponses ?? {},
    additionalGuestResponses: additionalResponsesForDerivation(
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
    return "Authorized Children";
  }

  return allocations.length === 1
    ? "Authorized Plus 1"
    : "Authorized Plus 1 Guests";
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
        ? `${remaining} still to classify by age.`
        : remaining === 0 && overAssigned === 0
          ? "Age-category totals match the derived attendance."
          : overAssigned > 0
            ? `Age-category totals exceed the derived attendance by ${overAssigned}.`
            : "";

    setAttendanceStatusMessage(
      `Derived attending total is now ${derivedAttendance}. ${remainingText}`.trim(),
    );
  }, [
    derivedAttendanceKnown,
    derivedAttendance,
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
            Correct the items below and submit again. Your other page-entered
            values have been preserved.
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
        <legend>How are you completing this blank form?</legend>

        <p className="form-help" id="rsvp-completion-mode-help">
          This choice only controls what the browser asks you to complete. The
          server determines whether the stored result is an initial RSVP or a
          revision.
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
          <span>I am updating an earlier RSVP.</span>
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
          {attendanceLabel} For a first RSVP, choose Ceremony, Reception, both,
          or decline. On a revision, leave this region untouched if the stored
          attendance should remain unchanged.
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

        {draft.completionMode === "revision" && (
          <p className="form-help">
            Leave this region untouched to keep the stored attendance state. If
            you change it, select the complete intended attendance state.
          </p>
        )}

        <FieldError
          id={errorMessageId("eventAttendance")}
          message={errors.eventAttendance}
        />
      </fieldset>

      {showAttendingRegions && namedInvitees.length > 0 && (
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
            For a first RSVP, answer Yes or No for every named invitee.
            Unanswered person-level controls on a blank revision are treated as
            unchanged unless another revision rule requires a complete
            replacement.
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

          {draft.completionMode === "revision" && (
            <p className="form-help">
              Leave an unanswered named-invitee question unchanged, or select
              Yes/No to replace that response.
            </p>
          )}

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
            For a first RSVP, answer every additional-guest question shown for
            this invitation. A grouped child Yes answer also requires a child
            count.
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
                          `rsvp-children-count-${allocation.id}-help`,
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

                      <p
                        className="form-help"
                        id={`rsvp-children-count-${allocation.id}-help`}
                      >
                        Required when children are attending. Choose from 1
                        through {allocation.maximumCount}.
                      </p>
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

          {draft.completionMode === "revision" && (
            <p className="form-help">
              Leave an additional-guest question untouched to keep the stored
              response. If you change grouped children, including the number
              attending, the complete Attendee Details list must also be
              replaced.
            </p>
          )}

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
          <legend>Total Attending Party</legend>

          <p className="form-help" id="rsvp-attendance-totals-help">
            Classify the complete attending party across all four age
            categories. The four values must equal the derived attending
            headcount.
          </p>

          {draft.completionMode === "first" && !completePersonResponses ? (
            <StatusMessage
              type="information"
              title="Complete attendance decisions first"
            >
              Answer the named-invitee and additional-guest attendance
              questions above. The attending headcount is derived from those
              responses before the age categories are assigned.
            </StatusMessage>
          ) : derivedAttendanceKnown && derivedAttendance < 1 ? (
            <StatusMessage
              type="information"
              title="No attendees are currently marked Yes"
            >
              At least one authorized attendee must be marked Yes when
              Ceremony or Reception is selected. Once someone is marked as
              attending, classify the complete attending party by age below.
            </StatusMessage>
          ) : (
            <>
              <p className="form-help">
                To better accommodate the seating &amp; dietary needs of our
                guests, please list the total number of attendees in your party.
              </p>

              <div className="rsvp-total-summary">
                <span>
                  Derived total:{" "}
                  <strong>
                    {derivedAttendanceKnown ? derivedAttendance : "—"}
                  </strong>
                </span>

                <span>
                  Assigned by age: <strong>{total}</strong>
                </span>

                {derivedAttendanceKnown && overAssigned > 0 && (
                  <span>
                    Age categories currently exceed the derived attendance by{" "}
                    <strong>{overAssigned}</strong>. Reduce the age totals
                    before submitting.
                  </span>
                )}

                {derivedAttendanceKnown &&
                  overAssigned === 0 &&
                  remaining > 0 && (
                    <span>
                      Still to assign by age: <strong>{remaining}</strong>
                    </span>
                  )}

                {derivedAttendanceKnown &&
                  overAssigned === 0 &&
                  remaining === 0 && (
                    <span>
                      The age-category totals match the derived attendance.
                    </span>
                  )}
              </div>

              <p
                className="rsvp-status-announcement"
                role="status"
                aria-live="polite"
                aria-atomic="true"
              >
                {attendanceStatusMessage}
              </p>

              {!derivedAttendanceKnown &&
                draft.completionMode === "revision" && (
                  <p className="form-help">
                    Because this is a blank revision form, the browser cannot
                    display stored attendance answers. You may leave these
                    categories blank when they are unchanged. If you replace
                    the complete party composition, answer all attendance
                    decisions so the revised total can be derived here.
                  </p>
                )}

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
                  A blank category means “leave unchanged.” Entering 0 is an
                  explicit replacement. Any complete revised set must still add
                  up to the attending party derived by the server.
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
          <legend>Attendee Details</legend>

          <p className="form-help" id="rsvp-attendee-details-help">
            Provide one required attendee name for each person attending.
            Dietary or allergy information appears only when Reception is
            selected.
          </p>

          {draft.completionMode === "revision" &&
            !draft.attendance.touched &&
            derivedAttendanceKnown && (
              <p className="form-help">
                Event attendance is being left unchanged. Because this blank
                revision does not reveal the stored event selection, only
                attendee names are available here. If Reception remains part
                of the RSVP and you need dietary or allergy information
                included in this replacement, restate the complete intended
                Attendance selection above and re-enter that information.
              </p>
            )}

          {detailTargetCount === null ? (
            <StatusMessage
              type="information"
              title="Complete the information needed to replace attendee details"
            >
              {draft.completionMode === "revision"
                ? "Leave this region untouched when the stored attendee list does not need to change. To replace Attendee Details because who is attending changed, answer every named-invitee and additional-guest question so the complete intended party can be derived. Restate Attendance only when the event selection itself is changing."
                : "Complete the attendance decisions above so the form can create one Attendee Details row for every person attending."}
            </StatusMessage>
          ) : detailTargetCount < 1 ? (
            <StatusMessage
              type="information"
              title="No attendees selected"
            >
              Mark at least one authorized attendee as attending before
              completing Attendee Details.
            </StatusMessage>
          ) : (
            <>
              <p className="form-help">
                Provide one Attendee name for every person who will attend,
                including every Plus 1 and each child represented by the
                grouped child count.
              </p>

              {draft.attendance.reception && (
                <p className="form-help">
                  Because Reception is selected, you may also provide Dietary
                  or allergy information for each attendee.
                </p>
              )}

              <div className="rsvp-attendee-list">
                {draft.attendeeDetails.map((detail, index) => (
                  <section
                    className="rsvp-attendee-card"
                    key={index}
                  >
                    <h3>Attendee {index + 1}</h3>

                    <div className="form-field">
                      <label htmlFor={`rsvp-attendee-${index}-name`}>
                        Attendee name
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
                        Required. Maximum 100 characters.
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
                          Optional. Maximum 1000 characters.
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
        id="rsvp-confirmation-method"
        className="rsvp-focus-target"
        tabIndex="-1"
        disabled={disabled}
        aria-describedby={describedBy(
          "rsvp-confirmation-method-help",
          errors.confirmationMethod
            ? errorMessageId("confirmationMethod")
            : null,
        )}
      >
        <legend>Confirmation Method</legend>

        <p className="form-help" id="rsvp-confirmation-method-help">
          Select an available confirmation method and enter the destination
          again for every initial RSVP or revision.
        </p>

        {lookup.confirmationOptions.email && (
          <label className="form-choice">
            <input
              id="rsvp-confirmation-method-email"
              type="radio"
              name="confirmationMethod"
              value="email"
              required
              aria-required="true"
              aria-describedby={describedBy(
                "rsvp-confirmation-method-help",
                errors.confirmationMethod
                  ? errorMessageId("confirmationMethod")
                  : null,
              )}
              checked={draft.confirmation.method === "email"}
              onChange={() =>
                updateConfirmation({
                  method: "email",
                  mobile: "",
                  smsAuthorization: false,
                })
              }
            />
            <span>Email</span>
          </label>
        )}

        {lookup.confirmationOptions.textMessage && (
          <label className="form-choice">
            <input
              id="rsvp-confirmation-method-text"
              type="radio"
              name="confirmationMethod"
              value="textMessage"
              required
              aria-required="true"
              aria-describedby={describedBy(
                "rsvp-confirmation-method-help",
                errors.confirmationMethod
                  ? errorMessageId("confirmationMethod")
                  : null,
              )}
              checked={draft.confirmation.method === "textMessage"}
              onChange={() =>
                updateConfirmation({
                  method: "textMessage",
                  email: "",
                })
              }
            />
            <span>Text Message</span>
          </label>
        )}

        <FieldError
          id={errorMessageId("confirmationMethod")}
          message={errors.confirmationMethod}
        />

        {draft.confirmation.method === "email" && (
          <div className="form-field rsvp-confirmation-destination">
            <label htmlFor="rsvp-confirmation-email">
              Email address
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
                "rsvp-confirmation-email-help",
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

            <p className="form-help" id="rsvp-confirmation-email-help">
              Required. Enter the email address where you want this RSVP
              confirmation sent.
            </p>

            <FieldError
              id={errorMessageId("confirmationEmail")}
              message={errors.confirmationEmail}
            />
          </div>
        )}

        {draft.confirmation.method === "textMessage" && (
          <>
            <div className="form-field rsvp-confirmation-destination">
              <label htmlFor="rsvp-confirmation-mobile">
                Mobile number
              </label>

              <input
                id="rsvp-confirmation-mobile"
                type="tel"
                autoComplete="tel"
                required
                aria-required="true"
                value={draft.confirmation.mobile}
                aria-invalid={
                  errors.confirmationMobile
                    ? "true"
                    : undefined
                }
                aria-describedby={describedBy(
                  "rsvp-confirmation-mobile-help",
                  errors.confirmationMobile
                    ? errorMessageId("confirmationMobile")
                    : null,
                )}
                onChange={(event) =>
                  updateConfirmation({
                    mobile: event.target.value,
                  })
                }
              />

              <p className="form-help" id="rsvp-confirmation-mobile-help">
                Required. Enter the mobile number where you want this RSVP
                confirmation sent.
              </p>

              <FieldError
                id={errorMessageId("confirmationMobile")}
                message={errors.confirmationMobile}
              />
            </div>

            {lookup.confirmationOptions.smsAuthorizationRequired && (
              <label className="form-choice">
                <input
                  id="rsvp-sms-authorization"
                  type="checkbox"
                  required
                  aria-required="true"
                  aria-describedby={
                    errors.smsAuthorization
                      ? errorMessageId("smsAuthorization")
                      : undefined
                  }
                  checked={draft.confirmation.smsAuthorization}
                  onChange={(event) =>
                    updateConfirmation({
                      smsAuthorization: event.target.checked,
                    })
                  }
                />

                <span>
                  I authorize this transactional RSVP confirmation by text
                  message.
                </span>
              </label>
            )}

            <FieldError
              id={errorMessageId("smsAuthorization")}
              message={errors.smsAuthorization}
            />
          </>
        )}
      </fieldset>

      <Button
        type="submit"
        disabled={disabled}
      >
        Submit RSVP Information
      </Button>
    </form>
  );
}

export default RsvpForm;
