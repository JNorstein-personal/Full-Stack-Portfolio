import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import Button from "../components/common/Button";
import StatusMessage from "../components/common/StatusMessage";
import PageContainer from "../components/layout/PageContainer";
import RsvpForm from "../components/rsvp/RsvpForm";
import { siteContent } from "../data/siteContent.js";
import {
  lookupRsvpInvitation,
  submitRsvp,
} from "../services/api.js";
import {
  RSVP_STATES,
  buildSubmissionRequest,
  createBlankDraft,
  lookupFailureState,
  submitFailureState,
} from "../services/rsvpModel.js";
import {
  setTransientConfirmation,
} from "../services/rsvpConfirmationMemory.js";
import {
  formatRsvpCountdown,
  getRsvpTiming,
  getRsvpTimingRefreshDelay,
} from "../services/rsvpTiming.js";

const RSVP_TIMING_CONFIG = Object.freeze({
  countdownStartIso:
    siteContent.rsvp.deadline
      .countdownStartIso,
  deadlineIso:
    siteContent.rsvp.deadline.iso,
});

function readRsvpTiming(
  now = new Date(),
) {
  return getRsvpTiming({
    now,
    ...RSVP_TIMING_CONFIG,
  });
}

function RsvpPage() {
  const navigate = useNavigate();
  const [state, setState] =
    useState(
      RSVP_STATES.ENTRY_READY,
    );
  const [inviteCode, setInviteCode] =
    useState("");
  const [lookup, setLookup] =
    useState(null);
  const [draft, setDraft] =
    useState(null);
  const [errors, setErrors] =
    useState({});
  const [
    pendingRequest,
    setPendingRequest,
  ] = useState(null);
  const submissionInFlightRef =
    useRef(false);
  const stateFocusRef =
    useRef(null);
  const previousDisplayStateRef =
    useRef(null);
  const [
    lastOperation,
    setLastOperation,
  ] = useState("lookup");
  const [
    serviceMessage,
    setServiceMessage,
  ] = useState("");
  const [
    rsvpTiming,
    setRsvpTiming,
  ] = useState(() =>
    readRsvpTiming(),
  );

  const displayState =
    rsvpTiming.isClosed &&
    state !==
      RSVP_STATES.SUBMITTING &&
    state !==
      RSVP_STATES
        .SUBMISSION_UNCERTAIN
      ? RSVP_STATES.CLOSED
      : state;

  useEffect(() => {
    const previousState =
      previousDisplayStateRef.current;

    previousDisplayStateRef.current =
      displayState;

    if (
      previousState === null ||
      previousState === displayState
    ) {
      return;
    }

    const shouldMoveFocus = [
      RSVP_STATES.INVALID_INVITATION,
      RSVP_STATES.SERVICE_UNAVAILABLE,
      RSVP_STATES.VALIDATED_FORM,
      RSVP_STATES.SUBMISSION_UNCERTAIN,
      RSVP_STATES.CLOSED,
    ].includes(displayState);

    if (!shouldMoveFocus) {
      return;
    }

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
  }, [displayState]);

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
      "RSVP | Norstein-Dashiell Wedding";
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
    let timeoutId = null;

    function refreshTiming() {
      const now = new Date();

      setRsvpTiming(
        readRsvpTiming(now),
      );

      const delay =
        getRsvpTimingRefreshDelay({
          now,
          ...RSVP_TIMING_CONFIG,
        });

      if (delay !== null) {
        timeoutId =
          window.setTimeout(
            refreshTiming,
            delay,
          );
      }
    }

    refreshTiming();

    return () => {
      if (timeoutId !== null) {
        window.clearTimeout(
          timeoutId,
        );
      }
    };
  }, []);

  async function performLookup(
    code,
  ) {
    setState(
      RSVP_STATES.LOOKING_UP,
    );
    setErrors({});
    setServiceMessage("");
    setLastOperation("lookup");

    try {
      const result =
        await lookupRsvpInvitation(
          code,
        );

      setLookup(result);
      setDraft(
        createBlankDraft(result),
      );
      setPendingRequest(null);
      setState(
        RSVP_STATES
          .VALIDATED_FORM,
      );
    } catch (error) {
      const nextState =
        lookupFailureState(
          error.status,
        );

      if (
        nextState ===
        RSVP_STATES
          .SERVICE_UNAVAILABLE
      ) {
        setServiceMessage(
          error.status === 429
            ? "Too many RSVP lookup attempts were made recently. Please wait before trying again."
            : "The RSVP service is temporarily unavailable. No RSVP was submitted.",
        );
      }

      setState(nextState);
    }
  }

  function handleLookup(
    event,
  ) {
    event.preventDefault();
    performLookup(inviteCode);
  }

  async function sendSubmission(
    request,
  ) {
    if (
      submissionInFlightRef.current
    ) {
      return;
    }

    submissionInFlightRef.current =
      true;

    setState(
      RSVP_STATES.SUBMITTING,
    );
    setErrors({});
    setServiceMessage("");
    setLastOperation("submit");

    try {
      const result =
        await submitRsvp(
          request,
        );

      setTransientConfirmation(
        result,
      );
      setPendingRequest(null);
      submissionInFlightRef.current =
        false;

      navigate(
        "/rsvp/confirmation",
      );
    } catch (error) {
      submissionInFlightRef.current =
        false;

      if (
        typeof error.status !==
        "number"
      ) {
        setState(
          RSVP_STATES
            .SUBMISSION_UNCERTAIN,
        );
        return;
      }

      const nextState =
        submitFailureState(
          error.status,
        );

      if (
        nextState ===
        RSVP_STATES
          .VALIDATION_FAILURE
      ) {
        setPendingRequest(null);
        setErrors({
          form:
            "The RSVP could not be accepted as entered. Review the visible fields and try again. Previously stored answers have not been revealed or changed by this message.",
        });
      } else if (
        nextState ===
        RSVP_STATES.CLOSED
      ) {
        setPendingRequest(null);
      } else if (
        nextState ===
        RSVP_STATES
          .SERVICE_UNAVAILABLE
      ) {
        setServiceMessage(
          error.status === 429
            ? "Too many submission attempts were made recently. Please wait before trying this same submission again."
            : "The RSVP service could not complete this request. Successful storage was not established.",
        );
      }

      setState(nextState);
    }
  }

  function handleSubmission(
    event,
  ) {
    event.preventDefault();

    if (
      submissionInFlightRef.current
    ) {
      return;
    }

    const clientSubmissionId =
      crypto.randomUUID();

    const built =
      buildSubmissionRequest({
        inviteCode,
        lookup,
        draft,
        clientSubmissionId,
      });

    if (!built.ok) {
      setPendingRequest(null);
      setErrors(built.errors);
      setState(
        RSVP_STATES
          .VALIDATION_FAILURE,
      );
      return;
    }

    setPendingRequest(
      built.request,
    );
    sendSubmission(
      built.request,
    );
  }

  function retryServiceOperation() {
    if (
      lastOperation ===
        "submit" &&
      pendingRequest
    ) {
      sendSubmission(
        pendingRequest,
      );
      return;
    }

    performLookup(inviteCode);
  }

  function selectedConfirmationChannel() {
    if (
      pendingRequest?.confirmation
        ?.method === "email"
    ) {
      return "the email inbox you entered";
    }

    if (
      pendingRequest?.confirmation
        ?.method === "textMessage"
    ) {
      return "the mobile number you entered";
    }

    return "your selected confirmation channel";
  }

  function retryUncertainSubmission() {
    if (
      pendingRequest &&
      !submissionInFlightRef.current
    ) {
      sendSubmission(
        pendingRequest,
      );
    }
  }

  function renderDeadlineTiming() {
    return (
      <>
        <p>
          Online submissions and
          revisions are accepted
          until{" "}
          <strong>
            {
              siteContent.rsvp
                .deadline.display
            }
          </strong>
          .
        </p>

        {rsvpTiming.showCountdown && (
          <p className="rsvp-countdown">
            Time remaining before
            online RSVP closes:{" "}
            <strong>
              {formatRsvpCountdown(
                rsvpTiming.remaining,
              )}
            </strong>
            .
          </p>
        )}
      </>
    );
  }

  function renderEntry() {
    return (
      <>
        <p>
          To RSVP online, enter the
          six-character invitation
          code printed with the RSVP
          information on your
          invitation.
        </p>

        <section className="rsvp-entry-guidance">
          <h2>
            Where to Find Your Code
          </h2>
          <p>
            Use the six-character
            invitation code printed
            with the RSVP information
            on your invitation.
            Example:{" "}
            <strong>XXX-XXX</strong>.
          </p>

          <h2>
            Using the QR Code
          </h2>
          <p>
            The QR code printed on
            your invitation opens the
            general wedding website.
            The invitation code must
            still be entered manually
            here to open your RSVP
            form.
          </p>
        </section>

        <form
          className="form-stack"
          onSubmit={handleLookup}
        >
          <div className="form-field">
            <label htmlFor="rsvp-invite-code">
              Invitation code
            </label>
            <input
              id="rsvp-invite-code"
              type="text"
              inputMode="text"
              autoComplete="off"
              maxLength="20"
              value={inviteCode}
              disabled={
                displayState ===
                RSVP_STATES
                  .LOOKING_UP
              }
              onChange={(event) =>
                setInviteCode(
                  event.target.value,
                )
              }
              placeholder="XXX-XXX"
              aria-describedby="rsvp-code-help"
            />
            <p
              className="form-help"
              id="rsvp-code-help"
            >
              Format: XXX-XXX. Enter
              the code manually from
              your invitation. It is
              never placed in the
              website address.
            </p>
          </div>

          <Button
            type="submit"
            disabled={
              displayState ===
                RSVP_STATES
                  .LOOKING_UP ||
              inviteCode.trim() ===
                ""
            }
          >
            Find My RSVP
          </Button>
        </form>
      </>
    );
  }

  function renderState() {
    if (
      displayState ===
      RSVP_STATES.CLOSED
    ) {
      return (
        <div
          className="rsvp-state-focus-target"
          ref={stateFocusRef}
          tabIndex="-1"
        >
          <StatusMessage
            type="closed"
            title="Online RSVP Is Closed"
          >
            Online submissions and
            revisions closed{" "}
            <strong>
              {
                siteContent.rsvp
                  .deadline.display
              }
            </strong>
            . For a late correction or
            special circumstance,
            contact{" "}
            <a
              href={
                "mailto:" +
                siteContent.rsvp
                  .assistanceEmail
              }
            >
              {
                siteContent.rsvp
                  .assistanceEmail
              }
            </a>
            .
          </StatusMessage>

          <div className="rsvp-action-row">
            <Link to="/">
              Return Home
            </Link>
          </div>
        </div>
      );
    }

    if (
      displayState ===
      RSVP_STATES
        .INVALID_INVITATION
    ) {
      return (
        <div
          className="rsvp-state-focus-target"
          ref={stateFocusRef}
          tabIndex="-1"
        >
          <StatusMessage
            type="error"
            title="Invitation Code Not Recognized"
          >
            We could not locate an
            invitation associated with
            that code. Please check the
            code as printed on your
            invitation and try again.
          </StatusMessage>
          {renderEntry()}
        </div>
      );
    }

    if (
      displayState ===
      RSVP_STATES
        .SERVICE_UNAVAILABLE
    ) {
      return (
        <div
          className="rsvp-state-focus-target"
          ref={stateFocusRef}
          tabIndex="-1"
        >
          <StatusMessage
            type="error"
            title="RSVP Service Temporarily Unavailable"
          >
            {serviceMessage}
          </StatusMessage>

          <div className="rsvp-action-row">
            <Button
              type="button"
              onClick={
                retryServiceOperation
              }
            >
              Try Again
            </Button>

            <Link to="/">
              Return Home
            </Link>

            <a
              href={
                "mailto:" +
                siteContent.rsvp
                  .assistanceEmail
              }
            >
              Contact for Help
            </a>
          </div>
        </div>
      );
    }

    if (
      displayState ===
      RSVP_STATES
        .SUBMISSION_UNCERTAIN
    ) {
      return (
        <div
          className="rsvp-state-focus-target"
          ref={stateFocusRef}
          tabIndex="-1"
        >
          <StatusMessage
            type="uncertainty"
            title="We Could Not Confirm the Submission Result"
            aria-atomic="true"
          >
            We could not confirm
            whether this RSVP request
            was recorded. Check{" "}
            {selectedConfirmationChannel()}
            {" "}for an RSVP
            confirmation before
            deciding whether to retry.
            The safe retry below sends
            the exact same logical
            request with the same
            submission identifier; it
            does not rebuild the
            request from form fields.
          </StatusMessage>

          <div className="rsvp-action-row">
            <Button
              type="button"
              onClick={
                retryUncertainSubmission
              }
              disabled={
                !pendingRequest
              }
            >
              Retry Safely
            </Button>

            <a
              href={
                "mailto:" +
                siteContent.rsvp
                  .assistanceEmail
              }
            >
              Contact for Help
            </a>
          </div>
        </div>
      );
    }

    if (
      displayState ===
      RSVP_STATES.SUBMITTING
    ) {
      return (
        <StatusMessage
          type="information"
          title="Submitting Your RSVP"
          aria-atomic="true"
        >
          Please do not submit again.
          This submission is being
          processed using one logical
          request identifier. The
          submit action is protected
          while the result is pending.
        </StatusMessage>
      );
    }

    if (
      lookup &&
      draft &&
      (
        displayState ===
          RSVP_STATES
            .VALIDATED_FORM ||
        displayState ===
          RSVP_STATES
            .VALIDATION_FAILURE
      )
    ) {
      return (
        <>
          <section
            className="rsvp-personalized-intro rsvp-state-focus-target"
            ref={stateFocusRef}
            tabIndex="-1"
          >
            <p className="rsvp-kicker">
              RSVP for
            </p>
            <h2>
              {lookup.invitation
                .greeting ||
                lookup.invitation
                  .partyDisplayName}
            </h2>

            {renderDeadlineTiming()}

            <StatusMessage
              type="information"
              title="This Form Always Opens Blank"
            >
              Previously submitted
              answers and confirmation
              contact details are not
              displayed here. For a
              first RSVP, complete
              every required
              applicable field. For a
              revision, re-enter your
              confirmation method and
              destination, then
              provide only the RSVP
              changes you intend to
              make. RSVP fields you
              leave untouched normally
              remain unchanged unless
              another submitted change
              makes them inapplicable
              or requires complete
              replacement.
            </StatusMessage>

            <section className="rsvp-personalized-support">
              <h3>
                Revisions
              </h3>
              <p>
                You may return to this
                RSVP page and re-enter
                your invitation code to
                submit revisions until
                the online deadline.
                Each validated form
                opens blank rather than
                displaying previously
                stored answers.
              </p>

              <h3>
                Printed RSVP Option
              </h3>
              <p>
                You may return the
                printed RSVP slip
                included with your
                invitation instead of
                using the online form.
              </p>

              <h3>
                Need Help?
              </h3>
              <p>
                If you would like to
                use the online RSVP but
                have difficulty,
                contact{" "}
                <a
                  href={
                    "mailto:" +
                    siteContent.rsvp
                      .assistanceEmail
                  }
                >
                  {
                    siteContent.rsvp
                      .assistanceEmail
                  }
                </a>
                .
              </p>

              <h3>
                Privacy
              </h3>
              <p>
                Your invitation code is
                used to open the RSVP
                form configured for
                your invitation. RSVP
                and confirmation-contact
                information is
                processed and stored
                for wedding
                administration. This
                form opens blank and
                does not display
                previously stored
                answers or confirmation
                destinations. Complete
                RSVP confirmations are
                sent to the couple and
                to you through the
                confirmation method you
                select.{" "}
                <Link to="/privacy">
                  Read the full RSVP
                  Privacy Notice
                </Link>
                .
              </p>
            </section>
          </section>

          <RsvpForm
            lookup={lookup}
            draft={draft}
            setDraft={setDraft}
            errors={errors}
            onSubmit={
              handleSubmission
            }
          />
        </>
      );
    }

    return (
      <>
        {displayState ===
          RSVP_STATES
            .LOOKING_UP && (
          <StatusMessage
            type="information"
            title="Checking Invitation Code"
            aria-atomic="true"
          >
            Please wait while we check
            the code printed on your
            invitation.
          </StatusMessage>
        )}

        {renderEntry()}
      </>
    );
  }

  return (
    <PageContainer>
      <div className="form-width rsvp-page">
        <h1>RSVP</h1>

        {renderState()}

        {displayState !==
          RSVP_STATES.CLOSED &&
          displayState !==
            RSVP_STATES
              .VALIDATED_FORM &&
          displayState !==
            RSVP_STATES
              .VALIDATION_FAILURE &&
          displayState !==
            RSVP_STATES
              .SUBMITTING &&
          displayState !==
            RSVP_STATES
              .SUBMISSION_UNCERTAIN && (
          <>
            <h2>
              Deadline and Revisions
            </h2>
            {renderDeadlineTiming()}
            <p>
              Before the deadline,
              you may return and
              re-enter your code to
              submit a deliberate
              revision.
            </p>

            <h2>
              Printed RSVP Option
            </h2>
            <p>
              You may return the
              printed RSVP slip
              included with your
              invitation instead of
              using the online form.
            </p>

            <h2>Privacy</h2>
            <p>
              Your invitation code is
              used to open the RSVP
              form configured for your
              invitation. RSVP and
              confirmation-contact
              information is processed
              and stored for wedding
              administration. Forms
              open blank and do not
              display previously stored
              answers or confirmation
              destinations. Complete
              RSVP confirmations are
              sent to the couple and to
              you through the
              confirmation method you
              select.{" "}
              <Link to="/privacy">
                Read the full RSVP
                Privacy Notice
              </Link>
              .
            </p>

            <h2>Need Help?</h2>
            <p>
              If you would like to use
              the online RSVP but have
              difficulty, contact{" "}
              <a
                href={
                  "mailto:" +
                  siteContent.rsvp
                    .assistanceEmail
                }
              >
                {
                  siteContent.rsvp
                    .assistanceEmail
                }
              </a>
              .
            </p>
          </>
        )}
      </div>
    </PageContainer>
  );
}

export default RsvpPage;
