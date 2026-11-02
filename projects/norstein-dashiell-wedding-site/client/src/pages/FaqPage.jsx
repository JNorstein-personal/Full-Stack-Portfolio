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
            Both our ceremony and reception will take place at the Sphinx
            Banquet &amp; Catering Center, 121 East 2nd Avenue, Roselle, New
            Jersey. Once you arrive, you&rsquo;re in the right place for the
            whole celebration&mdash;no venue-hopping required.
          </p>

          <p>
            You can find directions, parking information, and more on our{" "}
            <Link to="/venue">Venue</Link> page.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="faq-arrival-heading">
        <h2 id="faq-arrival-heading">When should I arrive?</h2>

        <div className="prose-width">
          <p>
            Our ceremony begins at{" "}
            <strong>11:30 a.m. on Saturday, May 1, 2027</strong>. We recommend
            arriving a little early so you have plenty of time to park, cross
            the street, find your seat, and settle in before things get
            underway.
          </p>

          <p>
            You can find the rest of the day&rsquo;s timing on our{" "}
            <Link to="/day-of">Day-Of Details</Link> page.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="faq-parking-heading">
        <h2 id="faq-parking-heading">Where can I park?</h2>

        <div className="prose-width">
          <p>
            Municipal parking is available in the lot directly across the
            street from the Sphinx. Please give yourself a few extra minutes
            to park and cross safely before the ceremony.
          </p>

          <p>
            See our <Link to="/venue">Venue</Link> page for the full location
            and parking details.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="faq-attire-heading">
        <h2 id="faq-attire-heading">What should I wear?</h2>

        <div className="prose-width">
          <p>
            Our dress code is <strong>Vintage Garden Formal</strong>, and
            statement hats are very much encouraged! Think elegant garden
            party, vintage influence, botanical details, whimsical touches,
            and whatever makes you feel celebratory and comfortable.
          </p>

          <p>
            Our <Link to="/theme">Theme &amp; Attire</Link> page has examples,
            color inspiration, and plenty of ideas.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="faq-schedule-heading">
        <h2 id="faq-schedule-heading">What does the day look like?</h2>

        <div className="prose-width">
          <p>
            We&rsquo;re keeping the day intentionally relaxed. The ceremony
            begins at <strong>11:30 a.m.</strong>, followed by brunch, dancing,
            speeches, and the rest of the celebration, with festivities
            concluding at <strong>4:30 p.m.</strong> There is no formal cocktail
            hour or minute-by-minute itinerary guests need to follow.
          </p>

          <p>
            Our <Link to="/day-of">Day-Of Details</Link> page has the schedule,
            menu, dietary information, and gift policy all in one place.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="faq-rsvp-deadline-heading">
        <h2 id="faq-rsvp-deadline-heading">When is the RSVP deadline?</h2>

        <div className="prose-width">
          <p>
            Online RSVPs and revisions are welcome through{" "}
            <strong>{siteContent.rsvp.deadline.display}</strong>. Your invitation
            includes the code you&rsquo;ll need to open your RSVP form.
          </p>

          <p>
            Visit the <Link to="/rsvp/">RSVP</Link> page whenever you&rsquo;re
            ready to respond.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="faq-printed-rsvp-heading">
        <h2 id="faq-printed-rsvp-heading">
          Can I mail in my RSVP instead?
        </h2>

        <div className="prose-width">
          <p>
            Absolutely! A printed RSVP slip is included with your invitation,
            and you&rsquo;re welcome to mail that back instead if you would
            rather not use the online form.
          </p>

          <p>
            If you prefer to RSVP online, or want to review the available
            options, visit our <Link to="/rsvp/">RSVP</Link> page.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="faq-rsvp-revision-heading">
        <h2 id="faq-rsvp-revision-heading">
          Can I change an RSVP I&apos;ve already submitted?
        </h2>

        <div className="prose-width">
          <p>
            Yes. Until the RSVP deadline, you can return to the{" "}
            <Link to="/rsvp/">RSVP</Link> page and enter your invitation code
            again to submit a revision.
          </p>

          <p>
            For privacy, the form will open blank rather than displaying your
            previously stored answers, so simply enter the complete information
            you would like us to use going forward.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="faq-dietary-heading">
        <h2 id="faq-dietary-heading">What if I have dietary needs?</h2>

        <div className="prose-width">
          <p>
            Please let us know about food allergies, dietary restrictions, or
            other food-related needs when you RSVP. Gluten-free and non-dairy
            options will be available, although food may be prepared or served
            in environments where common allergens are present.
          </p>

          <p>
            You can read more about the menu and dietary accommodations on our{" "}
            <Link to="/day-of">Day-Of Details</Link> page, and provide your own
            information through the <Link to="/rsvp/">RSVP</Link> page.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="faq-hotels-heading">
        <h2 id="faq-hotels-heading">Are hotels arranged?</h2>

        <div className="prose-width">
          <p>
            We&rsquo;re still putting the final accommodation details together.
            We plan to provide lodging information for guests staying from{" "}
            <strong>Friday, April 30 through Sunday, May 2</strong>, but the
            hotel recommendations, booking instructions, and any block details
            are not yet finalized.
          </p>

          <p>
            We&rsquo;ll post everything on our <Link to="/travel">Travel</Link>{" "}
            page as soon as those details are confirmed.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="faq-gifts-heading">
        <h2 id="faq-gifts-heading">What is your gift policy?</h2>

        <div className="prose-width">
          <p>
            We will not be using a traditional wedding registry. If you would
            like to give us something, we&rsquo;re happiest with thoughtful,
            handcrafted, or practical gifts that can help us save toward the
            adventures and plans ahead of us&mdash;but your presence at the
            celebration matters far more to us than bringing a gift.
          </p>

          <p>
            You can read our complete Gift Policy on the{" "}
            <Link to="/day-of">Day-Of Details</Link> page.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="faq-privacy-heading">
        <h2 id="faq-privacy-heading">
          How does RSVP information stay private?
        </h2>

        <div className="prose-width">
          <p>
            Our RSVP system is designed to collect only the information we need
            to plan the wedding and communicate about your response. Previously
            submitted answers are not displayed when you reopen the form, and
            RSVP information is kept out of public pages and personalized
            website addresses.
          </p>

          <p>
            Our <Link to="/privacy">Privacy</Link> page explains what
            information is collected, how it is used, and how long it is
            retained in plain language.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="faq-help-heading">
        <h2 id="faq-help-heading">How do I get RSVP help?</h2>

        <div className="prose-width">
          <p>
            If anything about the RSVP process gives you trouble, please reach
            out&mdash;we&rsquo;re happy to help.
          </p>

          <p>
            You can return to the <Link to="/rsvp/">RSVP</Link> page for the
            online form, or email{" "}
            <a href={`mailto:${siteContent.rsvp.assistanceEmail}`}>
              {siteContent.rsvp.assistanceEmail}
            </a>{" "}
            for assistance.
          </p>
        </div>
      </ContentSection>

      <BackToTop />
    </PageContainer>
  );
}

export default FaqPage;
