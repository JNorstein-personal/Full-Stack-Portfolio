import {
  useEffect,
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
  const [
    lastOperation,
    setLastOperation,
  ] = useState("lookup");
  const [
    serviceMessage,
    setServiceMessage,
  ] = useState("");

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

      navigate(
        "/rsvp/confirmation",
      );
    } catch (error) {
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
        setErrors({
          form:
            "The RSVP could not be accepted as entered. Review the visible fields and try again. Previously stored answers have not been revealed or changed by this message.",
        });
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

  function retryUncertainSubmission() {
    if (pendingRequest) {
      sendSubmission(
        pendingRequest,
      );
    }
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
                state ===
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
              Enter the code manually
              from your invitation. It
              is never placed in the
              website address.
            </p>
          </div>

          <Button
            type="submit"
            disabled={
              state ===
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
      state ===
      RSVP_STATES.CLOSED
    ) {
      return (
        <StatusMessage
          type="closed"
          title="Online RSVP Is Closed"
        >
          Ordinary online submissions
          and revisions closed at{" "}
          <strong>
            {
              siteContent.rsvp
                .deadline.display
            }
          </strong>
          . For an exceptional late
          correction, contact{" "}
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
      );
    }

    if (
      state ===
      RSVP_STATES
        .INVALID_INVITATION
    ) {
      return (
        <>
          <StatusMessage
            type="error"
            title="Invitation Code Not Recognized"
          >
            We could not open an RSVP
            form from that entry.
            Check the code printed on
            your invitation and try
            again. For help, contact{" "}
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
          {renderEntry()}
        </>
      );
    }

    if (
      state ===
      RSVP_STATES
        .SERVICE_UNAVAILABLE
    ) {
      return (
        <>
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
        </>
      );
    }

    if (
      state ===
      RSVP_STATES
        .SUBMISSION_UNCERTAIN
    ) {
      return (
        <>
          <StatusMessage
            type="uncertainty"
            title="We Could Not Confirm the Submission Result"
          >
            Your RSVP may have been
            recorded. Check the
            selected confirmation
            channel before retrying.
            A safe retry below uses
            the same logical request
            and does not create a new
            submission identifier.
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
        </>
      );
    }

    if (
      state ===
      RSVP_STATES.SUBMITTING
    ) {
      return (
        <StatusMessage
          type="information"
          title="Submitting Your RSVP"
        >
          Please do not submit again.
          Your current logical
          submission is being
          processed.
        </StatusMessage>
      );
    }

    if (
      lookup &&
      draft &&
      (
        state ===
          RSVP_STATES
            .VALIDATED_FORM ||
        state ===
          RSVP_STATES
            .VALIDATION_FAILURE
      )
    ) {
      return (
        <>
          <section className="rsvp-personalized-intro">
            <p className="rsvp-kicker">
              RSVP for
            </p>
            <h2>
              {lookup.invitation
                .greeting ||
                lookup.invitation
                  .partyDisplayName}
            </h2>

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
              make.
            </StatusMessage>
          </section>

          {state ===
            RSVP_STATES
              .VALIDATION_FAILURE && (
            <StatusMessage
              type="error"
              title="Please Review Your RSVP"
            >
              {errors.form ??
                "Correct the highlighted information and submit again. Your current page-entered values have been preserved."}
            </StatusMessage>
          )}

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
        {state ===
          RSVP_STATES
            .LOOKING_UP && (
          <StatusMessage
            type="information"
            title="Looking Up Invitation"
          >
            Please wait while we
            validate your invitation.
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

        {state !==
          RSVP_STATES.CLOSED &&
          state !==
            RSVP_STATES
              .VALIDATED_FORM &&
          state !==
            RSVP_STATES
              .VALIDATION_FAILURE &&
          state !==
            RSVP_STATES
              .SUBMITTING &&
          state !==
            RSVP_STATES
              .SUBMISSION_UNCERTAIN && (
          <>
            <h2>
              Deadline and Revisions
            </h2>
            <p>
              The online RSVP
              deadline is{" "}
              <strong>
                {
                  siteContent.rsvp
                    .deadline.display
                }
              </strong>
              . Before the deadline,
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
              RSVP forms load blank
              and do not display
              previously stored
              answers or confirmation
              destinations.{" "}
              <Link to="/privacy">
                Read the full RSVP
                Privacy Notice
              </Link>
              .
            </p>
          </>
        )}
      </div>
    </PageContainer>
  );
}

export default RsvpPage;
