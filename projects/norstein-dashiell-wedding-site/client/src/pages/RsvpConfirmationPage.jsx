import { Link } from "react-router-dom";

import PageContainer from "../components/layout/PageContainer";
import StatusMessage from "../components/common/StatusMessage";

function RsvpConfirmationPage() {
  return (
    <PageContainer>
      <div className="form-width">
        <h1>RSVP Confirmation</h1>

        <StatusMessage type="information">
          No RSVP confirmation is currently available
          in this development build.
        </StatusMessage>

        <p>
          This route is reserved for the future RSVP
          confirmation experience.
        </p>

        <p>
          <Link to="/rsvp/">
            Return to RSVP
          </Link>
        </p>
      </div>
    </PageContainer>
  );
}

export default RsvpConfirmationPage;