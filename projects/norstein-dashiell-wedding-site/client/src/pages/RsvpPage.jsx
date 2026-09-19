import { Link } from "react-router-dom";

import StatusMessage from "../components/common/StatusMessage";
import PageContainer from "../components/layout/PageContainer";
import { siteContent } from "../data/siteContent.js";

function RsvpPage() {
  return (
    <PageContainer>
      <div className="form-width">
        <h1>RSVP</h1>

        <p>
          To RSVP online, enter the six-character invitation
          code printed with the RSVP information on your
          invitation.
        </p>

        <StatusMessage
          type="information"
          title="Online RSVP Coming Soon"
        >
          Invitation lookup and RSVP submission are not yet
          enabled in this development build. The information
          below describes the planned RSVP process.
        </StatusMessage>

        <h2>Invitation Code</h2>

        <p>
          Your invitation code uses the format{" "}
          <strong>XXX-XXX</strong>. When online RSVP is
          enabled, entering a valid code here will open the
          blank RSVP form associated with your invitation.
        </p>

        <p>
          Invitation codes are entered directly on this page
          and are not placed in personalized website links.
        </p>

        <h2>Using the QR Code</h2>

        <p>
          The QR code printed on your invitation opens the
          general wedding website. You will still enter your
          printed invitation code separately on the RSVP
          page.
        </p>

        <h2>Deadline and Revisions</h2>

        <p>
          Online RSVP submissions and revisions are accepted
          until{" "}
          <strong>
            {siteContent.rsvp.deadline.display}
          </strong>
          .
        </p>

        <p>
          Before the deadline, you may return to the RSVP
          page and re-enter your invitation code if you need
          to revise a response. RSVP forms load blank rather
          than displaying previously stored answers.
        </p>

        <h2>Printed RSVP Option</h2>

        <p>
          If you prefer not to use the online RSVP system,
          you may return the printed RSVP slip included with
          your invitation.
        </p>

        <h2>Privacy</h2>

        <p>
          Your invitation code is used to retrieve the RSVP
          form that applies to your invitation. RSVP and
          confirmation-contact information is processed and
          stored privately for managing your response and
          providing the applicable transactional
          confirmations. Previously stored RSVP answers are
          not displayed when a form is opened again.
        </p>

        <p>
          <Link to="/privacy">
            Read the full RSVP Privacy Notice
          </Link>
        </p>

        <h2>Need Help?</h2>

        <p>
          If you would like to RSVP online but experience
          difficulty with your invitation code or the RSVP
          process, email{" "}
          <a
            href={`mailto:${siteContent.rsvp.assistanceEmail}`}
          >
            {siteContent.rsvp.assistanceEmail}
          </a>
          .
        </p>
      </div>
    </PageContainer>
  );
}

export default RsvpPage;