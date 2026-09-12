import PageContainer from "../components/layout/PageContainer";
import StatusMessage from "../components/common/StatusMessage";

function RsvpPage() {
  return (
    <PageContainer>
      <div className="form-width">
        <h1>RSVP</h1>

        <p>
          Online RSVP functionality is being prepared.
        </p>

        <StatusMessage type="information">
          Invitation lookup and RSVP submission are
          not yet available in this development build.
        </StatusMessage>
      </div>
    </PageContainer>
  );
}

export default RsvpPage;