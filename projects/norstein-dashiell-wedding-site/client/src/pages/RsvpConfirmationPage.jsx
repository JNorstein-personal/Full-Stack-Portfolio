import {
  useEffect,
  useState,
} from "react";
import { Link } from "react-router-dom";

import StatusMessage from "../components/common/StatusMessage";
import PageContainer from "../components/layout/PageContainer";
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

function statusLabel(status) {
  if (status === "sent") {
    return "Sent";
  }

  if (status === "failed") {
    return "Failed";
  }

  return "Status uncertain";
}

function methodLabel(method) {
  return method === "textMessage"
    ? "Text Message"
    : "Email";
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

  if (
    state ===
    RSVP_STATES
      .CONFIRMATION_FALLBACK
  ) {
    return (
      <PageContainer>
        <div className="form-width rsvp-confirmation-page">
          <h1>
            Confirmation Summary No Longer Available
          </h1>

          <StatusMessage
            type="uncertainty"
            title="Your on-screen summary is unavailable"
          >
            The temporary confirmation
            summary is no longer
            available. An RSVP may
            already have been
            recorded. Check the email
            or text confirmation you
            selected before submitting
            again.
          </StatusMessage>

          <p>
            If you need to make a
            deliberate revision, return
            to RSVP and enter your
            invitation code manually.
          </p>

          <p>
            <Link to="/rsvp/">
              Return to RSVP
            </Link>
          </p>

          <p>
            For assistance, email{" "}
            <a href="mailto:RSVPhelp@loreweavercreations.com">
              RSVPhelp@loreweavercreations.com
            </a>
            .
          </p>
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

  return (
    <PageContainer>
      <div className="form-width rsvp-confirmation-page">
        <h1>
          {isRevision
            ? "RSVP Updated"
            : "RSVP Recorded"}
        </h1>

        <StatusMessage
          type={
            state ===
            RSVP_STATES
              .DELIVERY_WARNING
              ? "warning"
              : "success"
          }
          title={
            state ===
            RSVP_STATES
              .DELIVERY_WARNING
              ? "Your RSVP Was Recorded"
              : "Thank You"
          }
        >
          {isRevision
            ? "Your revision was recorded. The summary below is the complete current RSVP after the revision was merged."
            : "Your initial RSVP was recorded successfully."}
        </StatusMessage>

        {state ===
          RSVP_STATES
            .DELIVERY_WARNING && (
          <StatusMessage
            type="warning"
            title="Confirmation Delivery Needs Attention"
          >
            Your RSVP remains recorded.
            One or more confirmation
            delivery attempts failed or
            have an uncertain status.
            Do not resubmit solely
            because of this delivery
            warning.
          </StatusMessage>
        )}

        <section className="rsvp-summary-section">
          <p className="rsvp-kicker">
            RSVP for
          </p>
          <h2>
            {
              invitation
                .partyDisplayName
            }
          </h2>

          <h3>Attendance</h3>

          {isDecline ? (
            <p>
              {invitation
                .wordingMode ===
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

          {Array.isArray(
            rsvp
              .additionalGuestResponses,
          ) &&
            rsvp
              .additionalGuestResponses
              .length > 0 && (
            <>
              <h3>
                Authorized Plus 1
                Responses
              </h3>
              <dl className="rsvp-summary-list">
                {rsvp
                  .additionalGuestResponses
                  .map(
                    (response) => (
                      <div
                        key={
                          response.id
                        }
                      >
                        <dt>
                          {
                            response.prompt
                          }
                        </dt>
                        <dd>
                          {response.response ===
                          "yes"
                            ? "Yes"
                            : "No"}
                        </dd>
                      </div>
                    ),
                  )}
              </dl>
            </>
          )}

          {!isDecline &&
            rsvp
              .attendanceTotals && (
            <>
              <h3>
                Party Totals
              </h3>
              <dl className="rsvp-summary-list">
                {ATTENDANCE_TOTAL_FIELDS.map(
                  (field) => (
                    <div key={field}>
                      <dt>
                        {
                          ATTENDANCE_TOTAL_LABELS[
                            field
                          ]
                        }
                      </dt>
                      <dd>
                        {
                          rsvp
                            .attendanceTotals[
                            field
                          ]
                        }
                      </dd>
                    </div>
                  ),
                )}
                <div>
                  <dt>
                    Overall attendance
                  </dt>
                  <dd>
                    {
                      rsvp
                        .overallAttendance
                    }
                  </dd>
                </div>
              </dl>
            </>
          )}

          {Array.isArray(
            rsvp
              .receptionAttendeeDetails,
          ) &&
            rsvp
              .receptionAttendeeDetails
              .length > 0 && (
            <>
              <h3>
                Reception Attendee
                Details
              </h3>
              <ol className="rsvp-attendee-summary">
                {rsvp
                  .receptionAttendeeDetails
                  .map(
                    (
                      detail,
                      index,
                    ) => (
                      <li
                        key={
                          detail.attendeeName +
                          index
                        }
                      >
                        <strong>
                          {
                            detail
                              .attendeeName
                          }
                        </strong>
                        <span>
                          Dietary/allergy:{" "}
                          {detail
                            .dietaryPreferences ||
                            "None provided"}
                        </span>
                      </li>
                    ),
                  )}
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
              <dt>
                Recorded
              </dt>
              <dd>
                {new Date(
                  submission
                    .recordedAt,
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
                Guest delivery
              </dt>
              <dd>
                {statusLabel(
                  delivery
                    .guestDeliveryStatus,
                )}
              </dd>
            </div>
            <div>
              <dt>
                Administrative attempt
              </dt>
              <dd>
                {statusLabel(
                  delivery
                    .administrativeDeliveryStatus,
                )}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rsvp-summary-section">
          <h2>
            Need to Revise?
          </h2>

          <p>
            {revisionPolicy.mayRevise
              ? "Before the deadline, return to RSVP, enter your invitation code again, and submit only the deliberate changes you intend to make."
              : "Online revisions are no longer available."}
          </p>

          <p>
            Deadline:{" "}
            <strong>
              March 1, 2027, at
              11:59 p.m. EST
            </strong>
          </p>

          <p>
            <Link
              to="/rsvp/"
              onClick={() =>
                clearTransientConfirmation()
              }
            >
              Return to RSVP
            </Link>
          </p>

          <p>
            For assistance, email{" "}
            <a
              href={
                "mailto:" +
                revisionPolicy
                  .assistanceEmail
              }
            >
              {
                revisionPolicy
                  .assistanceEmail
              }
            </a>
            .
          </p>
        </section>
      </div>
    </PageContainer>
  );
}

export default RsvpConfirmationPage;
