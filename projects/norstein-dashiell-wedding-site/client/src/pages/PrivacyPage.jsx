import { Link } from "react-router-dom";

import ContentSection from "../components/layout/ContentSection";
import PageContainer from "../components/layout/PageContainer";
import { siteContent } from "../data/siteContent.js";

function PrivacyPage() {
  return (
    <PageContainer>
      <ContentSection labelledBy="privacy-heading">
        <h1 id="privacy-heading">
          RSVP Privacy
        </h1>

        <div className="prose-width">
          <p>
            This notice explains how the wedding website’s
            RSVP system is designed to use invitation codes,
            RSVP responses, confirmation contact
            information, and related administrative records.
          </p>

          <p>
            It applies to the online RSVP process and the
            confirmations associated with an RSVP.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="invitation-code-heading">
        <h2 id="invitation-code-heading">
          Invitation Codes
        </h2>

        <div className="prose-width">
          <p>
            The invitation code printed with your invitation
            is a limited access token used to select the
            blank RSVP form configuration that applies to
            your invitation. It is not a traditional account
            password and should not be treated as strong
            account authentication.
          </p>

          <p>
            The public RSVP system does not provide a guest
            directory, invitation-code recovery search,
            close-match suggestions, or a public page for
            retrieving a previously saved RSVP.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="information-collected-heading">
        <h2 id="information-collected-heading">
          Information Collected
        </h2>

        <div className="prose-width">
          <p>
            Depending on the RSVP form assigned to an
            invitation, the system may collect:
          </p>

          <ul>
            <li>
              Attendance or decline information.
            </li>
            <li>
              Ceremony and reception selections.
            </li>
            <li>
              Additional-guest information when applicable.
            </li>
            <li>
              Attendance totals by age category when
              applicable.
            </li>
            <li>
              Party-level dietary or allergy information.
            </li>
            <li>
              A confirmation method and the associated email
              address or SMS-capable mobile number.
            </li>
            <li>
              Transactional text-message authorization when
              that confirmation option is available and
              requires it.
            </li>
            <li>
              Submission and revision records needed to
              operate the RSVP system.
            </li>
          </ul>

          <p>
            Different invitations may use different approved
            RSVP profiles. Fields that do not belong to the
            applicable profile are not collected for that
            invitation.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="purpose-heading">
        <h2 id="purpose-heading">
          Why This Information Is Used
        </h2>

        <div className="prose-width">
          <p>
            RSVP information is used to record and manage
            responses, plan attendance and seating, prepare
            for dietary needs, provide confirmation to the
            invited party, provide a protected
            administrative confirmation to the couple, and
            support corrections, revisions, delivery
            troubleshooting, and approved confirmation
            resends.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="blank-forms-heading">
        <h2 id="blank-forms-heading">
          Blank Forms and Revisions
        </h2>

        <div className="prose-width">
          <p>
            Each RSVP form opens blank. Previously stored
            RSVP answers and confirmation destinations are
            not displayed when an invitation is looked up
            again.
          </p>

          <p>
            When a response is revised, submitted RSVP
            changes are merged privately with the current
            response. RSVP fields that are omitted remain
            unchanged unless an applicable dependency makes
            a stored answer no longer relevant. Clearing a
            stored answer requires an explicit applicable
            action rather than simply leaving a field blank.
          </p>

          <p>
            Confirmation method and destination information
            entered for a revision replaces the applicable
            previously stored confirmation information. A
            successful revision confirmation contains the
            complete current RSVP rather than only the fields
            changed by that revision.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="confirmation-heading">
        <h2 id="confirmation-heading">
          Confirmations and Mobile Numbers
        </h2>

        <div className="prose-width">
          <p>
            When online RSVP is enabled and a response is
            successfully stored, the system is designed to
            attempt a complete confirmation for the invited
            party and a separate protected administrative
            confirmation for the couple. These delivery
            attempts are handled independently, and their
            results are recorded separately.
          </p>

          <p>
            Email is an approved guest confirmation method.
            Text Message confirmation will be offered only
            if the production messaging provider, required
            disclosure language, authorization wording, and
            production testing have been completed.
          </p>

          <p>
            If Text Message confirmation is enabled, a mobile
            number supplied for RSVP confirmation will be
            used only for the guest-requested transactional
            RSVP confirmation and an approved manual resend
            unless another use is separately authorized in
            the future. A complete RSVP may require more than
            one message segment.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="storage-heading">
        <h2 id="storage-heading">
          Storage and Authorized Access
        </h2>

        <div className="prose-width">
          <p>
            The production design keeps invitation
            configuration and RSVP records within the private
            administrative system. The private
            administrative workbook is limited to the couple,
            explicitly authorized administrators, and the
            backend service account used to operate the RSVP
            system.
          </p>

          <p>
            The public React application does not directly
            access the private administrative workbook.
            Protected administrative confirmations are
            private correspondence sent only through the
            approved administrative process.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="dietary-heading">
        <h2 id="dietary-heading">
          Dietary and Allergy Information
        </h2>

        <div className="prose-width">
          <p>
            Dietary and allergy information is treated as
            private RSVP information. It may appear in the
            submitting party’s own confirmation, the
            protected administrative confirmation, and
            authorized private administrative records when
            those records contain the complete current RSVP.
          </p>

          <p>
            This information is not intended for public
            pages, public metadata, analytics, ordinary
            application logs, unrelated administrative
            messages, or other invited parties.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="safeguards-heading">
        <h2 id="safeguards-heading">
          Data-Exposure Safeguards
        </h2>

        <div className="prose-width">
          <p>
            The production RSVP design keeps invitation
            codes and RSVP details out of personalized
            browser URLs. RSVP and confirmation routes are
            not intended for public search indexing.
          </p>

          <p>
            Analytics and routine logging are designed to
            avoid intentionally sending or recording
            personalized RSVP values such as invitation
            codes, RSVP answers, dietary information, email
            addresses, mobile numbers, and confirmation
            destinations.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="retention-heading">
        <h2 id="retention-heading">
          Retention and Retirement
        </h2>

        <div className="prose-width">
          <p>
            Complete active RSVP-operational data may be
            retained through <strong>July 30, 2027</strong>,
            which is 90 days after the wedding.
          </p>

          <p>
            No later than that date, RSVP-operational data
            that is no longer needed for a concrete
            unresolved administrative purpose will be
            deleted or irreversibly de-identified from the
            active RSVP system. This includes current and
            superseded RSVP responses, dietary or allergy
            information, confirmation destinations, SMS
            authorization records, submission identifiers,
            delivery-attempt history, and RSVP transaction
            history that is no longer operationally needed.
          </p>

          <p>
            Protected backups containing retired
            RSVP-operational data will expire through the
            ordinary protected backup rotation no later than{" "}
            <strong>August 29, 2027</strong>.
          </p>

          <p>
            Non-identifying aggregate wedding statistics may
            remain after RSVP retirement when they cannot
            reasonably be used to reconstruct an invited
            party’s RSVP. The couple’s separate private
            Invitees List may also remain as a personal
            planning and address record outside the active
            RSVP system.
          </p>

          <p>
            If a minimum amount of RSVP information must
            temporarily remain beyond the ordinary
            retirement date for a concrete unresolved
            correction, dispute, delivery investigation, or
            comparable administrative need, it will be
            deleted when that need ends.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="assistance-heading">
        <h2 id="assistance-heading">
          Assistance and Corrections
        </h2>

        <div className="prose-width">
          <p>
            For help with an RSVP or to request a correction,
            contact{" "}
            <a
              href={`mailto:${siteContent.rsvp.assistanceEmail}`}
            >
              {siteContent.rsvp.assistanceEmail}
            </a>
            .
          </p>

          <p>
            Invitation codes and private RSVP information
            should not be placed in a public website URL.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="security-heading">
        <h2 id="security-heading">
          Security Limitations
        </h2>

        <div className="prose-width">
          <p>
            The RSVP system is designed with access limits,
            data minimization, private administrative
            storage, and other safeguards appropriate to the
            information it handles. These safeguards reduce
            exposure but do not constitute a guarantee
            against every possible form of unauthorized
            access or technical failure.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="privacy-return-heading">
        <h2 id="privacy-return-heading">
          Return to RSVP
        </h2>

        <div className="prose-width">
          <p>
            <Link to="/rsvp/">
              Return to the RSVP page
            </Link>
          </p>
        </div>
      </ContentSection>
    </PageContainer>
  );
}

export default PrivacyPage;