import { useEffect, useRef, useState } from "react";

import Button from "../common/Button";
import StatusMessage from "../common/StatusMessage";

import {
  ATTENDANCE_TOTAL_FIELDS,
  ATTENDANCE_TOTAL_LABELS,
  derivedOverallAttendance,
  enteredAttendanceTotal,
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

function validationErrorSortKey(key) {
  const attendeeMatch = /^(\d+)\.(attendeeName|dietaryPreferences)$/.exec(key);

  if (attendeeMatch) {
    const [, index, field] = attendeeMatch;

    return (
      600 +
      Number(index) * 10 +
      (field === "dietaryPreferences" ? 1 : 0)
    );
  }

  return {
    completionMode: 100,
    eventAttendance: 200,
    namedInviteeResponses: 300,
    additionalGuestResponses: 400,
    attendanceTotals: 500,
    attendeeDetails: 690,
    confirmationEmail: 700,
  }[key] ?? 999;
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
      draft,
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
      draft,
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
  const wordingMode = invitation.wordingMode;

  const validationErrors = Object.entries(errors ?? {})
    .filter(([, message]) => Boolean(message))
    .sort(
      ([leftKey], [rightKey]) =>
        validationErrorSortKey(leftKey) -
        validationErrorSortKey(rightKey),
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
        singular: "Regrettably, I am unable to attend.",
        plural: "Regrettably, we are unable to attend.",
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

  const personAttendanceAnswersRequired =
    draft.completionMode === "first" ||
    draft.completionMode === "revision";

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
      ? `${remaining} ${
          remaining === 1 ? "guest still needs" : "guests still need"
        } an age group.`
      : remaining === 0 && overAssigned === 0
        ? "Everyone attending has been counted by age group."
        : overAssigned > 0
          ? `You’ve counted ${overAssigned} too many ${
              overAssigned === 1 ? "guest" : "guests"
            } by age group.`
          : "";

  setAttendanceStatusMessage(
    `${derivedAttendance} ${
      derivedAttendance === 1 ? "guest is" : "guests are"
    } attending. ${remainingText}`.trim(),
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
            Please correct the items below and submit again. Everything else you entered has been retained and does not need to be corrected.
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
          Choose one below. If this is your first RSVP, complete all required questions. If you’re updating an RSVP, confirm the complete current guest attendance below even if those plans have not changed. Other sections can remain blank when unchanged unless the form asks you to re-enter related details.
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
          {attendanceLabel} Choose all that apply. If you’re updating an earlier RSVP and your plans haven’t changed, you can leave this section blank.
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
        namedInvitees.length > 1 && (
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
            Let us know who will be attending. If you’re updating an earlier RSVP, answer Yes or No for every person listed, even if their plans haven’t changed.
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
                      required={personAttendanceAnswersRequired}
                      aria-required={
                        personAttendanceAnswersRequired
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
            Let us know whether any additional guests will be attending. If your kids will be joining us, let us know how many will attend. When updating an earlier RSVP, answer every additional-guest question even if it hasn’t changed. If the guest list has changed, re-enter the complete current guest list below.
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
                          required={personAttendanceAnswersRequired}
                          aria-required={
                            personAttendanceAnswersRequired
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
                        required={personAttendanceAnswersRequired}
                        aria-required={
                          personAttendanceAnswersRequired
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
            Please tell us how many guests attending fall into each age group, the better to accommodate everyone's seating and dietary needs.
          </p>

          {personAttendanceAnswersRequired && !completePersonResponses ? (
            <StatusMessage
              type="information"
              title={
                draft.completionMode === "revision"
                  ? "First, confirm who’s attending"
                  : "First, tell us who’s attending"
              }
            >
              {draft.completionMode === "revision"
                ? "For an update, answer every guest attendance question above, even if those plans have not changed. Once the current attending party is complete, you can update age groups below if needed."
                : "Answer Yes or No for each guest above. Once we know how many people are attending, you can enter their age groups below."}
            </StatusMessage>
          ) : derivedAttendanceKnown && derivedAttendance < 1 ? (
            <StatusMessage
              type="information"
              title="No guests are marked as attending yet"
            >
              You selected the Ceremony and/or Reception, but no guests are marked as attending yet. Mark Yes for at least one guest above to continue.
            </StatusMessage>
          ) : (
            <>

              {derivedAttendanceKnown && (
                <div className="rsvp-total-summary">
                <span>
                  Guests attending:{" "}
                  <strong>{derivedAttendance}</strong>
                </span>

                <span>
                  Counted by age group:{" "}
                  <strong>{total} of {derivedAttendance}</strong>
                </span>

                {overAssigned > 0 && (
                  <span>
                    You’ve counted{" "}
                    <strong>{overAssigned}</strong>{" "}
                    {overAssigned === 1 ? "guest" : "guests"} too many. Adjust the age
                    groups so they add up to{" "}
                    <strong>{derivedAttendance}</strong>.
                  </span>
                )}

                {overAssigned === 0 && remaining === 0 && (
                  <span>
                    Everyone attending has been counted by age group.
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
                          placeholder={draft.completionMode === "first" ? "0" : ""}
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
                  Updating your RSVP? Leave an age group blank if that number hasn’t changed.
                  Enter 0 if no guests should remain in that age group. If you’re changing who
                  is attending, update those answers above first.
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
            {draft.completionMode === "revision"
              ? "If the guest list has not changed, you can leave the guest-name fields below blank. If anyone attending has changed, re-enter the complete current guest list. If you are also updating Reception attendance, you can provide current dietary or allergy information for each person."
              : "Enter the name of each person attending, including Plus 1 guests and children. If they’re attending the Reception, you can also tell us about any dietary needs or allergies."}
          </p>

          {draft.completionMode === "revision" &&
            !draft.attendance.touched &&
            derivedAttendanceKnown && (
              <p className="form-help">
                You’re leaving your Ceremony and Reception choices unchanged. If the people
                attending are unchanged, leave all guest-name fields blank. If anyone attending
                has changed, enter the complete current guest list. To update dietary or allergy
                information for the Reception, select Reception above so those fields appear.
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
                ? "Confirm the complete current guest attendance above first. We’ll then show one name field for each person attending. If the guest list is unchanged, those name fields can remain blank."
                : "Answer the guest attendance questions above first. We’ll then show one name field for each person attending."}
            </StatusMessage>
          ) : detailTargetCount < 1 ? (
            <StatusMessage
              type="information"
              title="Who will be attending?"
            >
              Mark Yes for at least one guest above. If no one will be attending, choose
              the decline option under Attendance instead.
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
                        required={draft.completionMode === "first"}
                        aria-required={
                          draft.completionMode === "first"
                            ? "true"
                            : undefined
                        }
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
                        {draft.completionMode === "revision"
                          ? "Leave blank if the guest list is unchanged; otherwise required."
                          : "Required."}
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
                          Optional.
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
