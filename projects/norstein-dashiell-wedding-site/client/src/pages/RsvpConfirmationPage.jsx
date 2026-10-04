import {
  useEffect,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";

import StatusMessage from "../components/common/StatusMessage";
import PageContainer from "../components/layout/PageContainer";
import { siteContent } from "../data/siteContent.js";
import {
  ATTENDANCE_TOTAL_FIELDS,
  ATTENDANCE_TOTAL_LABELS,
  RSVP_STATES,
  confirmationState,
} from "../services/rsvpModel.js";
import {
  clearTransientConfirmation,
  getTransientConfirmation,
} from "../services/rsvpConfirmationMemory.js";

function deliveryStatusLabel(status) {
  if (status === "sent") {
    return "Sent";
  }

  if (status === "accepted") {
    return "Accepted for delivery";
  }

  if (status === "failed") {
    return "Delivery failed";
  }

  return "Delivery status uncertain";
}

function deliveryWarningText(delivery) {
  const guestNeedsAttention =
    delivery.guestDeliveryStatus !== "sent" &&
    delivery.guestDeliveryStatus !== "accepted";

  const administrativeNeedsAttention =
    delivery.administrativeDeliveryStatus !== "sent" &&
    delivery.administrativeDeliveryStatus !== "accepted";

  if (
    guestNeedsAttention &&
    administrativeNeedsAttention
  ) {
    return "Your RSVP is recorded. Delivery of your selected guest confirmation and the administrative confirmation could not both be confirmed. Do not resubmit solely because of these delivery results.";
  }

  if (guestNeedsAttention) {
    return "Your RSVP is recorded. Delivery of your selected guest confirmation could not be confirmed. Do not resubmit solely because of this delivery result.";
  }

  return "Your RSVP is recorded. The administrative confirmation could not be confirmed. Do not resubmit solely because of this delivery result.";
}

function attendanceTotalEntries(totals) {
  if (
    !totals ||
    typeof totals !== "object" ||
    Array.isArray(totals)
  ) {
    return [];
  }

  return ATTENDANCE_TOTAL_FIELDS.filter((field) =>
    Object.prototype.hasOwnProperty.call(
      totals,
      field,
    ),
  ).map((field) => [
    field,
    totals[field],
  ]);
}

function hasDietaryField(detail) {
  return Object.prototype.hasOwnProperty.call(
    detail,
    "dietaryPreferences",
  );
}

function methodLabel(method) {
  return method === "textMessage"
    ? "Text Message"
    : "Email";
}

function responseLabel(response) {
  return response === "yes"
    ? "Yes"
    : "No";
}

function groupedChildResponse(response) {
  return Boolean(
    response &&
      typeof response === "object" &&
      !Array.isArray(response),
  );
}

function RsvpConfirmationPage() {
  const [confirmation] =
    useState(() =>
      getTransientConfirmation(),
    );

  const state =
    confirmationState(
      confirmation,
    );

  const stateFocusRef =
    useRef(null);

  useEffect(() => {
    const priorTitle =
      document.title;

    let robots =
      document.querySelector(
        'meta[name="robots"]',
      );

    const created = !robots;

    if (!robots) {
      robots =
        document.createElement(
          "meta",
        );
      robots.name = "robots";
      document.head.appendChild(
        robots,
      );
    }

    const priorRobots =
      robots.content;

    document.title =
      "RSVP Confirmation | Norstein-Dashiell Wedding";
    robots.content =
      "noindex, nofollow";

    return () => {
      document.title =
        priorTitle;

      if (created) {
        robots.remove();
      } else {
        robots.content =
          priorRobots;
      }
    };
  }, []);

  useEffect(() => {
    const frameId =
      window.requestAnimationFrame(
        () => {
          const target =
            stateFocusRef.current;

          if (!target) {
            return;
          }

          target.focus({
            preventScroll: true,
          });

          target.scrollIntoView({
            block: "start",
          });
        },
      );

    return () =>
      window.cancelAnimationFrame(
        frameId,
      );
  }, [state]);

  if (
    state ===
    RSVP_STATES
      .CONFIRMATION_FALLBACK
  ) {
    return (
      <PageContainer>
        <div
          className="form-width rsvp-confirmation-page rsvp-state-focus-target"
          ref={stateFocusRef}
          tabIndex="-1"
        >
          <h1>
            Confirmation Summary No Longer Available
          </h1>

          <StatusMessage
            type="uncertainty"
            title="Your on-screen confirmation summary is no longer available"
            aria-atomic="true"
          >
            This page uses temporary in-browser confirmation state, so the
            detailed summary is not available after that temporary state is
            gone. An RSVP may already have been recorded. Check the email inbox
            or mobile number you selected for a confirmation before submitting
            anything again.
          </StatusMessage>

          <p>
            Do not submit another RSVP solely because this on-screen summary disappeared.
            This page cannot determine whether the earlier request was stored, and it
            does not automatically look up or replay an RSVP.
          </p>

          <p>
            If you need to make a deliberate revision, return to RSVP, re-enter
            the invitation code printed on your invitation, and complete the
            blank revision form.
          </p>

          <div className="rsvp-action-row">
            <Link to="/rsvp/">
              Return to RSVP
            </Link>

            <Link to="/">
              Return to Wedding Website
            </Link>

            <a
              href={`mailto:${siteContent.rsvp.assistanceEmail}`}
            >
              Contact for Help
            </a>
          </div>
        </div>
      </PageContainer>
    );
  }

  const {
    submission,
    invitation,
    rsvp,
    confirmation:
      delivery,
    revisionPolicy,
  } = confirmation;

  const isRevision =
    submission.action ===
    "revision";

  const attendance =
    rsvp.eventAttendance;

  const isDecline =
    attendance.includes(
      "decline",
    );

  const receptionSelected =
    attendance.includes(
      "reception",
    );

  const namedInviteeResponses =
    Array.isArray(
      rsvp.namedInviteeResponses,
    )
      ? rsvp.namedInviteeResponses
      : [];

  const additionalGuestResponses =
    Array.isArray(
      rsvp.additionalGuestResponses,
    )
      ? rsvp.additionalGuestResponses
      : [];

  const attendeeDetails =
    Array.isArray(
      rsvp.attendeeDetails,
    )
      ? rsvp.attendeeDetails
      : [];

  const totalEntries =
    attendanceTotalEntries(
      rsvp.attendanceTotals,
    );

  const hasOverallAttendance =
    Number.isInteger(
      rsvp.overallAttendance,
    );

  const hasPartyTotals =
    totalEntries.length > 0 ||
    hasOverallAttendance;

  const deadlineDisplay =
    siteContent.rsvp.deadline.display;

  const assistanceEmail =
    siteContent.rsvp.assistanceEmail;

  const deliveryWarning =
    state ===
    RSVP_STATES
      .DELIVERY_WARNING;

  return (
    <PageContainer>
      <div
        className="form-width rsvp-confirmation-page rsvp-state-focus-target"
        ref={stateFocusRef}
        tabIndex="-1"
      >
        <h1>
          {isRevision
            ? "RSVP Updated"
            : "RSVP Recorded"}
        </h1>

        <StatusMessage
          type={
            deliveryWarning
              ? "warning"
              : "success"
          }
          title={
            deliveryWarning
              ? (
                  isRevision
                    ? "Your RSVP Revision Was Recorded"
                    : "Your RSVP Was Recorded"
                )
              : (
                  isRevision
                    ? "Your RSVP Revision Was Recorded"
                    : "Your RSVP Was Recorded"
                )
          }
          aria-atomic="true"
        >
          {isRevision
            ? "Your revision was stored successfully. The summary below is the complete current RSVP after the revision was merged."
            : "Your initial RSVP was stored successfully. The summary below is the complete current RSVP."}
        </StatusMessage>

        {deliveryWarning && (
          <StatusMessage
            type="warning"
            title="Confirmation Delivery Needs Attention"
            role="group"
            aria-live="off"
          >
            {deliveryWarningText(delivery)}
          </StatusMessage>
        )}

        <section className="rsvp-summary-section">
          <p className="rsvp-kicker">
            RSVP for
          </p>

          <h2>
            {invitation.partyDisplayName}
          </h2>

          <h3>Attendance</h3>

          {isDecline ? (
            <p>
              {invitation.wordingMode ===
              "plural"
                ? "Regretfully, we are unable to attend."
                : "Regretfully, I am unable to attend."}
            </p>
          ) : (
            <ul>
              {attendance.includes(
                "ceremony",
              ) && (
                <li>Ceremony</li>
              )}

              {attendance.includes(
                "reception",
              ) && (
                <li>Reception</li>
              )}
            </ul>
          )}

          {!isDecline &&
            namedInviteeResponses.length > 0 && (
              <>
                <h3>Named Invitees</h3>

                <dl className="rsvp-summary-list">
                  {namedInviteeResponses.map((response) => (
                    <div key={response.id}>
                      <dt>{response.displayName}</dt>
                      <dd>{responseLabel(response.response)}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}

          {!isDecline &&
            additionalGuestResponses.length > 0 && (
              <>
                <h3>
                  Additional Guest Responses
                </h3>

                <dl className="rsvp-summary-list">
                  {additionalGuestResponses.map((response) => {
                    const isGroupedChildren =
                      response.kind ===
                        "unnamedChildren" &&
                      groupedChildResponse(
                        response.response,
                      );

                    if (isGroupedChildren) {
                      const attending =
                        response.response
                          .attending ===
                        "yes";

                      return (
                        <div key={response.id}>
                          <dt>{response.prompt}</dt>
                          <dd>
                            {attending ? "Yes" : "No"}
                            {attending && (
                              <>
                                <br />
                                Children attending:{" "}
                                {response.response.count}
                              </>
                            )}
                          </dd>
                        </div>
                      );
                    }

                    return (
                      <div key={response.id}>
                        <dt>{response.prompt}</dt>
                        <dd>{responseLabel(response.response)}</dd>
                      </div>
                    );
                  })}
                </dl>
              </>
            )}

          {!isDecline &&
            hasPartyTotals && (
              <>
                <h3>Party Totals</h3>

                <dl className="rsvp-summary-list">
                  {totalEntries.map(
                    ([field, value]) => (
                      <div key={field}>
                        <dt>
                          {ATTENDANCE_TOTAL_LABELS[field]}
                        </dt>
                        <dd>{value}</dd>
                      </div>
                    ),
                  )}

                  {hasOverallAttendance && (
                    <div>
                      <dt>
                        Overall attendance
                      </dt>
                      <dd>
                        {rsvp.overallAttendance}
                      </dd>
                    </div>
                  )}
                </dl>
              </>
            )}

          {!isDecline &&
            attendeeDetails.length > 0 && (
              <>
                <h3>Attendee Details</h3>

                <ol className="rsvp-attendee-summary">
                  {attendeeDetails.map((detail, index) => (
                    <li
                      key={`${detail.attendeeName}-${index}`}
                    >
                      <strong>
                        {detail.attendeeName}
                      </strong>

                      {receptionSelected &&
                        hasDietaryField(detail) && (
                          <span>
                            Dietary or allergy information:{" "}
                            {detail.dietaryPreferences ||
                              "None provided"}
                          </span>
                        )}
                    </li>
                  ))}
                </ol>
              </>
            )}
        </section>

        <section className="rsvp-summary-section">
          <h2>
            Confirmation Details
          </h2>

          <dl className="rsvp-summary-list">
            <div>
              <dt>
                Submission type
              </dt>
              <dd>
                {isRevision
                  ? "Revision"
                  : "Initial RSVP"}
              </dd>
            </div>

            <div>
              <dt>Recorded</dt>
              <dd>
                {new Date(
                  submission.recordedAt,
                ).toLocaleString()}
              </dd>
            </div>

            <div>
              <dt>
                Confirmation method
              </dt>
              <dd>
                {methodLabel(
                  delivery.method,
                )}
              </dd>
            </div>

            <div>
              <dt>
                Guest confirmation delivery
              </dt>
              <dd>
                {deliveryStatusLabel(
                  delivery.guestDeliveryStatus,
                )}
              </dd>
            </div>

            <div>
              <dt>
                Administrative confirmation
              </dt>
              <dd>
                {deliveryStatusLabel(
                  delivery.administrativeDeliveryStatus,
                )}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rsvp-summary-section">
          <h2>Need to Revise?</h2>

          {revisionPolicy.mayRevise ? (
            <>
              <p>
                Online revisions are available before{" "}
                <strong>{deadlineDisplay}</strong>.
              </p>

              <ol>
                <li>
                  Return to the RSVP page and re-enter the invitation code
                  printed on your invitation.
                </li>
                <li>
                  Choose the option to revise your RSVP. The form will open blank for your privacy, so your previous answers will not be displayed.
                </li>
                <li>
                  Re-enter your confirmation method and contact information.
                </li>
                <li>
                  Update the parts of your RSVP you want to change. You can leave anything else blank, and we’ll keep your previous answers. If you change who will be attending, you may need to provide the related guest information again.
                </li>
                <li>
                  Submit your changes. Your new confirmation will show your complete, updated RSVP.
                </li>
              </ol>
            </>
          ) : (
            <p>
              Online revisions are no longer available. The RSVP deadline was{" "}
              <strong>{deadlineDisplay}</strong>.
            </p>
          )}

          <div className="rsvp-action-row">
            <Link
              to="/rsvp/"
              onClick={() =>
                clearTransientConfirmation()
              }
            >
              Return to RSVP
            </Link>

            <Link to="/">
              Return to Wedding Website
            </Link>

            <a
              href={`mailto:${assistanceEmail}`}
            >
              Contact for Help
            </a>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}

export default RsvpConfirmationPage;
