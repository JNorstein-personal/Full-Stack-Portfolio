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

function FieldError({ message }) {
  if (!message) {
    return null;
  }

  return (
    <p className="rsvp-field-error" role="alert">
      {message}
    </p>
  );
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
  const invitation = lookup.invitation;
  const namedInvitees = invitation.namedInvitees ?? [];
  const allocations = invitation.additionalGuestAllocations ?? [];
  const wordingMode = invitation.wordingMode;

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

  const revisionDetailsContextKnown =
    draft.completionMode !== "revision" || draft.attendance.touched;

  const detailTargetCount = !revisionDetailsContextKnown
    ? null
    : derivedAttendanceKnown
      ? derivedAttendance
      : draft.completionMode === "revision" && completeTotals
        ? total
        : null;

  function resizeDetailsForDraft(next) {
    if (next.attendance.decline) {
      return {
        ...next,
        attendeeDetails: [],
      };
    }

    if (next.completionMode === "revision" && !next.attendance.touched) {
      return next;
    }

    const responsesComplete = personResponsesAreComplete(invitation, next);

    if (responsesComplete) {
      const count = derivedAttendanceForDraft(invitation, next);

      return {
        ...next,
        attendeeDetails: resizeAttendeeDetails(next.attendeeDetails, count),
      };
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

  function adjustTotal(field, delta) {
    const raw = draft.attendanceTotals[field];
    const currentValue = raw === "" ? 0 : Number(raw);

    if (delta > 0 && total >= dialLimit) {
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
      <fieldset disabled={disabled}>
        <legend>How are you completing this blank form?</legend>

        <p className="form-help">
          This choice only controls what the browser asks you to complete. The
          server determines whether the stored result is an initial RSVP or a
          revision.
        </p>

        <label className="form-choice">
          <input
            type="radio"
            name="completionMode"
            value="first"
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
            type="radio"
            name="completionMode"
            value="revision"
            checked={draft.completionMode === "revision"}
            onChange={() =>
              updateDraft({
                completionMode: "revision",
              })
            }
          />
          <span>I am updating an earlier RSVP.</span>
        </label>

        <FieldError message={errors.completionMode} />
      </fieldset>

      <fieldset disabled={disabled}>
        <legend>Attendance</legend>

        <p className="form-help">{attendanceLabel}</p>

        {attendanceOptions.map((option) => {
          const label =
            option.label ?? option.labelVariants?.[wordingMode] ?? option.value;

          return (
            <label className="form-choice" key={option.value}>
              <input
                type="checkbox"
                checked={Boolean(draft.attendance[option.value])}
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

        <FieldError message={errors.eventAttendance} />
      </fieldset>

      {showAttendingRegions && namedInvitees.length > 0 && (
        <fieldset disabled={disabled}>
          <legend>Who Is Attending?</legend>

          {namedInvitees.map((invitee) => (
            <div className="rsvp-question-group" key={invitee.id}>
              <p>
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

          <FieldError message={errors.namedInviteeResponses} />
        </fieldset>
      )}

      {showAttendingRegions && allocations.length > 0 && (
        <fieldset disabled={disabled}>
          <legend>{allocationLegend(allocations)}</legend>

          {allocations.map((allocation) => {
            if (allocation.kind === "unnamedChildren") {
              const response =
                draft.additionalGuestResponses?.[allocation.id] ?? {
                  attending: "",
                  count: "",
                };

              return (
                <div className="rsvp-question-group" key={allocation.id}>
                  <p>
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
              <div className="rsvp-question-group" key={allocation.id}>
                <p>
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

          <FieldError message={errors.additionalGuestResponses} />
        </fieldset>
      )}

      {showAttendingRegions && (
        <fieldset disabled={disabled}>
          <legend>Total Attending Party</legend>

          {draft.completionMode === "first" && !completePersonResponses ? (
            <StatusMessage
              type="information"
              title="Complete attendance decisions first"
            >
              Answer the named-invitee and additional-guest attendance
              questions above. The attending headcount is derived from those
              responses before the age categories are assigned.
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

                {derivedAttendanceKnown && (
                  <span>
                    Remaining to assign: <strong>{remaining}</strong>
                  </span>
                )}
              </div>

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
                {ATTENDANCE_TOTAL_FIELDS.map((field) => (
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
                        onClick={() => adjustTotal(field, -1)}
                      >
                        −
                      </Button>

                      <input
                        id={`rsvp-total-${field}`}
                        type="number"
                        min="0"
                        max={dialLimit}
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
                      />

                      <Button
                        variant="secondary"
                        className="rsvp-dial__button"
                        type="button"
                        aria-label={`Increase ${ATTENDANCE_TOTAL_LABELS[field]}`}
                        disabled={disabled || remaining <= 0}
                        onClick={() => adjustTotal(field, 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                ))}
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

          <FieldError message={errors.attendanceTotals} />
        </fieldset>
      )}

      {showAttendingRegions && (
        <fieldset disabled={disabled}>
          <legend>Attendee Details</legend>

          {detailTargetCount === null ? (
            <StatusMessage
              type="information"
              title="Complete the information needed to replace attendee details"
            >
              {draft.completionMode === "revision"
                ? "Leave this region untouched when the stored attendee list does not need to change. To replace Attendee Details, first select the complete intended Attendance state above, then provide the revised attendance decisions and age totals needed to establish the replacement list."
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
                        type="text"
                        maxLength="100"
                        value={detail.attendeeName}
                        aria-invalid={
                          errors[`${index}.attendeeName`]
                            ? "true"
                            : undefined
                        }
                        onChange={(event) =>
                          updateAttendeeDetail(
                            index,
                            "attendeeName",
                            event.target.value,
                          )
                        }
                      />

                      <FieldError
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
                          onChange={(event) =>
                            updateAttendeeDetail(
                              index,
                              "dietaryPreferences",
                              event.target.value,
                            )
                          }
                        />

                        <FieldError
                          message={errors[`${index}.dietaryPreferences`]}
                        />
                      </div>
                    )}
                  </section>
                ))}
              </div>
            </>
          )}

          <FieldError message={errors.attendeeDetails} />
        </fieldset>
      )}

      <fieldset disabled={disabled}>
        <legend>Confirmation Method</legend>

        {lookup.confirmationOptions.email && (
          <label className="form-choice">
            <input
              type="radio"
              name="confirmationMethod"
              value="email"
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
              type="radio"
              name="confirmationMethod"
              value="textMessage"
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

        <FieldError message={errors.confirmationMethod} />

        {draft.confirmation.method === "email" && (
          <div className="form-field rsvp-confirmation-destination">
            <label htmlFor="rsvp-confirmation-email">
              Email address
            </label>

            <input
              id="rsvp-confirmation-email"
              type="email"
              autoComplete="email"
              value={draft.confirmation.email}
              aria-invalid={
                errors.confirmationEmail
                  ? "true"
                  : undefined
              }
              onChange={(event) =>
                updateConfirmation({
                  email: event.target.value,
                })
              }
            />

            <FieldError message={errors.confirmationEmail} />
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
                value={draft.confirmation.mobile}
                aria-invalid={
                  errors.confirmationMobile
                    ? "true"
                    : undefined
                }
                onChange={(event) =>
                  updateConfirmation({
                    mobile: event.target.value,
                  })
                }
              />

              <FieldError message={errors.confirmationMobile} />
            </div>

            {lookup.confirmationOptions.smsAuthorizationRequired && (
              <label className="form-choice">
                <input
                  type="checkbox"
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

            <FieldError message={errors.smsAuthorization} />
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