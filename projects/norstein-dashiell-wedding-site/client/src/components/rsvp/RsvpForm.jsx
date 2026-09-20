import Button from "../common/Button";
import StatusMessage from "../common/StatusMessage";

import {
  ATTENDANCE_TOTAL_FIELDS,
  ATTENDANCE_TOTAL_LABELS,
  enteredAttendanceTotal,
  resizeReceptionDetails,
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

function RsvpForm({
  lookup,
  draft,
  setDraft,
  errors,
  disabled = false,
  onSubmit,
}) {
  const invitation = lookup.invitation;
  const allocations =
    invitation.additionalGuestAllocations ?? [];
  const wordingMode = invitation.wordingMode;
  const attendanceQuestion =
    lookup.questions.find(
      (question) => question.id === "eventAttendance",
    );
  const attendanceLabel =
    attendanceQuestion?.labelVariants?.[wordingMode] ??
    (wordingMode === "plural"
      ? "We will be attending (check all that apply):"
      : "I will be attending (check all that apply):");
  const attendanceOptions =
    attendanceQuestion?.options ?? [
      { value: "ceremony", label: "Ceremony" },
      { value: "reception", label: "Reception" },
      {
        value: "decline",
        labelVariants: {
          singular:
            "Regretfully, I am unable to attend.",
          plural:
            "Regretfully, we are unable to attend.",
        },
      },
    ];

  const total =
    enteredAttendanceTotal(draft.attendanceTotals);
  const completeTotals =
    totalsAreComplete(draft.attendanceTotals);
  const remaining = Math.max(
    0,
    invitation.maximumAttendance - total,
  );

  function updateDraft(patch) {
    setDraft((current) => ({
      ...current,
      ...patch,
    }));
  }

  function updateAttendance(value) {
    setDraft((current) => {
      const attendance =
        toggleAttendance(
          current.attendance,
          value,
        );
      const shouldResize =
        attendance.reception &&
        !attendance.decline &&
        totalsAreComplete(
          current.attendanceTotals,
        );
      const count =
        shouldResize
          ? enteredAttendanceTotal(
              current.attendanceTotals,
            )
          : 0;

      return {
        ...current,
        attendance,
        receptionAttendeeDetails:
          shouldResize
            ? resizeReceptionDetails(
                current
                  .receptionAttendeeDetails,
                count,
              )
            : attendance.reception
              ? current
                  .receptionAttendeeDetails
              : [],
      };
    });
  }

  function updateAllocation(id, value) {
    setDraft((current) => ({
      ...current,
      additionalGuestResponses: {
        ...current.additionalGuestResponses,
        [id]: value,
      },
    }));
  }

  function setTotal(field, value) {
    setDraft((current) => {
      const attendanceTotals = {
        ...current.attendanceTotals,
        [field]:
          value === "" ? "" : String(value),
      };
      const shouldResize =
        current.attendance.reception &&
        !current.attendance.decline &&
        totalsAreComplete(
          attendanceTotals,
        );
      const count =
        shouldResize
          ? enteredAttendanceTotal(
              attendanceTotals,
            )
          : 0;

      return {
        ...current,
        attendanceTotals,
        receptionAttendeeDetails:
          shouldResize
            ? resizeReceptionDetails(
                current
                  .receptionAttendeeDetails,
                count,
              )
            : current
                .receptionAttendeeDetails,
      };
    });
  }

  function adjustTotal(field, delta) {
    const raw =
      draft.attendanceTotals[field];
    const currentValue =
      raw === "" ? 0 : Number(raw);

    if (
      delta > 0 &&
      total >= invitation.maximumAttendance
    ) {
      return;
    }

    setTotal(
      field,
      Math.max(0, currentValue + delta),
    );
  }

  function updateReceptionDetail(
    index,
    field,
    value,
  ) {
    setDraft((current) => ({
      ...current,
      receptionAttendeeDetails:
        current.receptionAttendeeDetails.map(
          (detail, detailIndex) =>
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
        <legend>
          How are you completing this blank form?
        </legend>

        <p className="form-help">
          This choice only controls what the browser
          asks you to complete. The server determines
          whether the stored result is an initial RSVP
          or a revision.
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
            checked={
              draft.completionMode === "revision"
            }
            onChange={() =>
              updateDraft({
                completionMode: "revision",
              })
            }
          />
          <span>
            I am updating an earlier RSVP.
          </span>
        </label>

        <FieldError
          message={errors.completionMode}
        />
      </fieldset>

      <fieldset disabled={disabled}>
        <legend>Attendance</legend>

        <p className="form-help">
          {attendanceLabel}
        </p>

        {attendanceOptions.map((option) => {
          const label =
            option.label ??
            option.labelVariants?.[wordingMode] ??
            option.value;

          return (
            <label
              className="form-choice"
              key={option.value}
            >
              <input
                type="checkbox"
                checked={Boolean(
                  draft.attendance[option.value],
                )}
                onChange={() =>
                  updateAttendance(option.value)
                }
              />
              <span>{label}</span>
            </label>
          );
        })}

        {draft.completionMode ===
          "revision" && (
          <p className="form-help">
            Leave this region untouched to keep the
            stored attendance state. If you change it,
            select the complete intended attendance
            state.
          </p>
        )}

        <FieldError
          message={errors.eventAttendance}
        />
      </fieldset>

      {allocations.length > 0 &&
        !draft.attendance.decline && (
          <fieldset disabled={disabled}>
            <legend>
              {allocations.length === 1
                ? "Authorized Plus 1"
                : "Authorized Plus 1 Guests"}
            </legend>

            {allocations.map((allocation) => (
              <div
                className="rsvp-question-group"
                key={allocation.id}
              >
                <p>
                  <strong>{allocation.prompt}</strong>
                </p>

                <div className="rsvp-inline-choices">
                  {[
                    ["yes", "Yes"],
                    ["no", "No"],
                  ].map(([value, label]) => (
                    <label
                      className="form-choice"
                      key={value}
                    >
                      <input
                        type="radio"
                        name={allocation.id}
                        value={value}
                        checked={
                          draft
                            .additionalGuestResponses[
                            allocation.id
                          ] === value
                        }
                        onChange={() =>
                          updateAllocation(
                            allocation.id,
                            value,
                          )
                        }
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {draft.completionMode ===
              "revision" && (
              <p className="form-help">
                Leave an unanswered Plus 1 question
                unchanged, or select Yes/No to replace
                it.
              </p>
            )}

            <FieldError
              message={
                errors.additionalGuestResponses
              }
            />
          </fieldset>
        )}

      {!draft.attendance.decline && (
        <fieldset disabled={disabled}>
          <legend>Total Attending Party</legend>

          <p className="form-help">
            Enter the attending party by age. The
            complete result may not exceed{" "}
            <strong>
              {invitation.maximumAttendance}
            </strong>
            .
          </p>

          <div className="rsvp-dial-list">
            {ATTENDANCE_TOTAL_FIELDS.map(
              (field) => (
                <div
                  className="rsvp-dial"
                  key={field}
                >
                  <label
                    htmlFor={
                      "rsvp-total-" + field
                    }
                  >
                    {ATTENDANCE_TOTAL_LABELS[field]}
                  </label>

                  <div className="rsvp-dial__controls">
                    <Button
                      variant="secondary"
                      className="rsvp-dial__button"
                      type="button"
                      aria-label={
                        "Decrease " +
                        ATTENDANCE_TOTAL_LABELS[field]
                      }
                      onClick={() =>
                        adjustTotal(field, -1)
                      }
                    >
                      −
                    </Button>

                    <input
                      id={"rsvp-total-" + field}
                      type="number"
                      min="0"
                      max={
                        invitation.maximumAttendance
                      }
                      step="1"
                      inputMode="numeric"
                      value={
                        draft.attendanceTotals[field]
                      }
                      placeholder="0"
                      onChange={(event) =>
                        setTotal(
                          field,
                          event.target.value,
                        )
                      }
                      aria-invalid={
                        errors.attendanceTotals
                          ? "true"
                          : undefined
                      }
                    />

                    <Button
                      variant="secondary"
                      className="rsvp-dial__button"
                      type="button"
                      aria-label={
                        "Increase " +
                        ATTENDANCE_TOTAL_LABELS[field]
                      }
                      disabled={
                        disabled || remaining <= 0
                      }
                      onClick={() =>
                        adjustTotal(field, 1)
                      }
                    >
                      +
                    </Button>
                  </div>
                </div>
              ),
            )}
          </div>

          <div className="rsvp-total-summary">
            <span>
              Entered total: <strong>{total}</strong>
            </span>
            <span>
              Maximum:{" "}
              <strong>
                {invitation.maximumAttendance}
              </strong>
            </span>
            <span>
              Remaining capacity:{" "}
              <strong>{remaining}</strong>
            </span>
          </div>

          {draft.completionMode ===
            "revision" && (
            <p className="form-help">
              A blank category means “leave
              unchanged.” Entering 0 is an explicit
              replacement.
            </p>
          )}

          <FieldError
            message={errors.attendanceTotals}
          />
        </fieldset>
      )}

      {draft.attendance.reception &&
        !draft.attendance.decline && (
          <fieldset disabled={disabled}>
            <legend>
              Reception Attendee Details
            </legend>

            {!completeTotals ? (
              <StatusMessage
                type="information"
                title="Complete totals to replace attendee details"
              >
                Enter all four attendance totals to
                provide a complete Reception attendee
                list. On a revision, you may leave this
                region untouched when the stored
                attendee details do not need to change.
              </StatusMessage>
            ) : (
              <>
                <p className="form-help">
                  Provide one entry for each person
                  attending the Reception.
                </p>

                <div className="rsvp-attendee-list">
                  {draft.receptionAttendeeDetails.map(
                    (detail, index) => (
                      <section
                        className="rsvp-attendee-card"
                        key={index}
                      >
                        <h3>
                          Attendee {index + 1}
                        </h3>

                        <div className="form-field">
                          <label
                            htmlFor={
                              "rsvp-attendee-" +
                              index +
                              "-name"
                            }
                          >
                            Attendee name
                          </label>
                          <input
                            id={
                              "rsvp-attendee-" +
                              index +
                              "-name"
                            }
                            type="text"
                            maxLength="100"
                            value={
                              detail.attendeeName
                            }
                            aria-invalid={
                              errors[
                                index +
                                  ".attendeeName"
                              ]
                                ? "true"
                                : undefined
                            }
                            onChange={(event) =>
                              updateReceptionDetail(
                                index,
                                "attendeeName",
                                event.target.value,
                              )
                            }
                          />
                          <FieldError
                            message={
                              errors[
                                index +
                                  ".attendeeName"
                              ]
                            }
                          />
                        </div>

                        <div className="form-field">
                          <label
                            htmlFor={
                              "rsvp-attendee-" +
                              index +
                              "-dietary"
                            }
                          >
                            Dietary or allergy
                            information (optional)
                          </label>
                          <textarea
                            id={
                              "rsvp-attendee-" +
                              index +
                              "-dietary"
                            }
                            maxLength="1000"
                            value={
                              detail.dietaryPreferences
                            }
                            aria-invalid={
                              errors[
                                index +
                                  ".dietaryPreferences"
                              ]
                                ? "true"
                                : undefined
                            }
                            onChange={(event) =>
                              updateReceptionDetail(
                                index,
                                "dietaryPreferences",
                                event.target.value,
                              )
                            }
                          />
                          <FieldError
                            message={
                              errors[
                                index +
                                  ".dietaryPreferences"
                              ]
                            }
                          />
                        </div>
                      </section>
                    ),
                  )}
                </div>
              </>
            )}

            <FieldError
              message={
                errors.receptionAttendeeDetails
              }
            />
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
              checked={
                draft.confirmation.method ===
                "email"
              }
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

        {lookup.confirmationOptions
          .textMessage && (
          <label className="form-choice">
            <input
              type="radio"
              name="confirmationMethod"
              value="textMessage"
              checked={
                draft.confirmation.method ===
                "textMessage"
              }
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
          message={errors.confirmationMethod}
        />

        {draft.confirmation.method ===
          "email" && (
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
            <FieldError
              message={
                errors.confirmationEmail
              }
            />
          </div>
        )}

        {draft.confirmation.method ===
          "textMessage" && (
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
                    mobile:
                      event.target.value,
                  })
                }
              />
              <FieldError
                message={
                  errors.confirmationMobile
                }
              />
            </div>

            {lookup.confirmationOptions
              .smsAuthorizationRequired && (
              <label className="form-choice">
                <input
                  type="checkbox"
                  checked={
                    draft.confirmation
                      .smsAuthorization
                  }
                  onChange={(event) =>
                    updateConfirmation({
                      smsAuthorization:
                        event.target.checked,
                    })
                  }
                />
                <span>
                  I authorize this transactional RSVP
                  confirmation by text message.
                </span>
              </label>
            )}

            <FieldError
              message={
                errors.smsAuthorization
              }
            />
          </>
        )}
      </fieldset>

      <Button type="submit" disabled={disabled}>
        Submit RSVP Information
      </Button>
    </form>
  );
}

export default RsvpForm;
