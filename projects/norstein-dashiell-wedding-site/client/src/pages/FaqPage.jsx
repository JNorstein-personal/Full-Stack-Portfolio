import { Link } from "react-router-dom";

import ContentSection from "../components/layout/ContentSection";
import BackToTop from "../components/navigation/BackToTop";
import PageContainer from "../components/layout/PageContainer";
import { siteContent } from "../data/siteContent.js";

function FaqPage() {
  return (
    <PageContainer>
      <ContentSection labelledBy="faq-heading">
        <h1 id="faq-heading">Frequently Asked Questions</h1>
      </ContentSection>

      <ContentSection labelledBy="faq-location-heading">
        <h2 id="faq-location-heading">
          Where are the ceremony and reception?
        </h2>

        <div className="prose-width">
          <p>
            Both will take place at the Sphinx Banquet &amp; Catering Center,
            121 East 2nd Avenue, Roselle, NJ 07203. There is no separate
            ceremony venue.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="faq-arrival-heading">
        <h2 id="faq-arrival-heading">When should I arrive?</h2>

        <div className="prose-width">
          <p>
            The ceremony begins at 11:30 a.m. on Saturday, May 1, 2027. Please
            arrive a little early to allow time for parking and finding your
            seat.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="faq-parking-heading">
        <h2 id="faq-parking-heading">Where can I park?</h2>

        <div className="prose-width">
          <p>
            Municipal parking is available in the lot directly across the
            street from the venue.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="faq-attire-heading">
        <h2 id="faq-attire-heading">What should I wear?</h2>

        <div className="prose-width">
          <p>
            Our dress code is <strong>Vintage Garden Formal</strong>, with
            statement hats strongly encouraged. See{" "}
            <Link to="/theme">Theme &amp; Attire</Link> for inspiration; the
            suggestions are not restricted by gender.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="faq-schedule-heading">
        <h2 id="faq-schedule-heading">Is there a detailed schedule?</h2>

        <div className="prose-width">
          <p>
            Only a few times are fixed for guests: the ceremony begins at
            11:30 a.m., and festivities conclude at 4:30 p.m. Brunch, dancing,
            speeches, and any other poignant moments will unfold during the afternoon, with
            announcements as needed.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="faq-rsvp-deadline-heading">
        <h2 id="faq-rsvp-deadline-heading">When is the RSVP deadline?</h2>

        <div className="prose-width">
          <p>
            Online RSVPs and revisions are accepted until{" "}
            {siteContent.rsvp.deadline.display}. Your invitation includes the
            code needed to access your RSVP form.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="faq-printed-rsvp-heading">
        <h2 id="faq-printed-rsvp-heading">
          Can I mail in my RSVP instead?
        </h2>

        <div className="prose-width">
          <p>
            Absolutely. We enclosed a printed RSVP slip along with your
            invitation, and you are welcome to mail it in to the address provided, if you prefer not to complete the online form.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="faq-rsvp-revision-heading">
        <h2 id="faq-rsvp-revision-heading">
          Can I change an RSVP I&apos;ve already submitted?
        </h2>

        <div className="prose-width">
          <p>
            Yes, before the deadline. Re-enter your invitation code to open a
            blank form and follow its revision instructions. Previously stored
            answers are not displayed.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="faq-dietary-heading">
        <h2 id="faq-dietary-heading">What if I have dietary needs?</h2>

        <div className="prose-width">
          <p>
            Please provide food allergies or dietary restrictions in the
            appropriate RSVP fields. Some gluten-free and non-dairy options are
            planned, but food may be prepared or served around common
            allergens.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="faq-hotels-heading">
        <h2 id="faq-hotels-heading">Are hotels arranged?</h2>

        <div className="prose-width">
          <p>
            Hotel recommendations and booking details have not yet been
            finalized, but the plan is to reserve rooms for guests with available check-in the day before (Friday, 04/30/2027) until the morning following (Sunday, 05/02/2027). The <Link to="/travel">Travel</Link> page will be
            updated when confirmed information is available.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="faq-help-heading">
        <h2 id="faq-help-heading">How do I get RSVP help?</h2>

        <div className="prose-width">
          <p>
            Email{" "}
            <a href={`mailto:${siteContent.rsvp.assistanceEmail}`}>
              {siteContent.rsvp.assistanceEmail}
            </a>
            .
          </p>
        </div>
      </ContentSection>

      <BackToTop />
    </PageContainer>
  );
}

export default FaqPage;
