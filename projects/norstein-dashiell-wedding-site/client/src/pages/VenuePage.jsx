import { Link } from "react-router-dom";

import ExternalLink from "../components/common/ExternalLink";
import ContentSection from "../components/layout/ContentSection";
import PageContainer from "../components/layout/PageContainer";
import { activeEventConfiguration } from "../data/eventConfigurations.js";
import { siteContent } from "../data/siteContent.js";

function VenuePage() {
  const event = activeEventConfiguration.schedule[0];
  const address =
    activeEventConfiguration.ceremony.address ??
    activeEventConfiguration.reception.address;

  return (
    <PageContainer>
      <ContentSection labelledBy="venue-heading">
        <h1 id="venue-heading">Venue</h1>

        <div className="prose-width">
          <h2>The Sphinx Banquet &amp; Catering Center</h2>

          <p>
            Sadly, we were unable to arrange for our wedding to take place in
            an enchanted moving castle wandering across the hills of a fantasy
            kingdom, but we rather think we've found the next best thing: a
            place where our family and friends can gather beneath one roof to
            witness the beginning of our marriage and celebrate everything
            that follows. 
          </p>  
          <p>
            It's even named after a mythological creature!
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="venue-when-where-heading">
        <h2 id="venue-when-where-heading">When &amp; Where</h2>

        <div className="prose-width">
          <p>
            On {siteContent.wedding.date.fullDisplay}, our ceremony and
            reception will both take place at the Sphinx Banquet &amp; Catering
            Center in Roselle, New Jersey.
          </p>

          <p>
            <strong>{siteContent.wedding.date.fullDisplay}</strong>
            <br />
            {event.time}
          </p>

          <p>
            <strong>{event.venueName}</strong>
            <br />
            {address}
          </p>

          <p>
            <strong>Directions:</strong>
            <br />
            <ExternalLink href={event.directions.googleMaps}>
              Google Maps
            </ExternalLink>
            {" · "}
            <ExternalLink href={event.directions.waze}>Waze</ExternalLink>
            {" · "}
            <ExternalLink href={event.directions.appleMaps}>
              Apple Maps
            </ExternalLink>
          </p>

          <p>
            Both the ceremony and reception will take place at the Sphinx, so
            there will be no need to leave one venue, make your way across
            town, find another parking space, or wonder whether you have
            accidentally taken the wrong enchanted doorway between one part of
            the wedding and the next.
          </p>

          <p><i>...Probably.</i></p>

          <p>
            The ceremony begins at <strong>11:30 a.m.</strong>, followed by a
            relaxed afternoon of buffet brunch, dancing, and other festivities.
            We are intentionally keeping the celebration more fluid than a
            traditional minute-by-minute wedding itinerary.
          </p>

          <p>
            For the guest-facing outline of the day, visit our{" "}
            <Link to="/schedule-menu">Schedule &amp; Menu</Link> page.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="venue-parking-heading">
        <h2 id="venue-parking-heading">Parking</h2>

        <div className="prose-width">
          <p>
            Municipal parking is available in the lot directly across the
            street from the Sphinx Banquet &amp; Catering Center.
          </p>

          <p>
            Please take care when crossing the street, and allow yourself a
            little extra time to park and make your way inside before the
            ceremony begins.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="venue-planning-heading">
        <h2 id="venue-planning-heading">Continue Planning Your Visit</h2>

        <div className="prose-width">
          <ul>
            <li>
              <Link to="/travel">Travel</Link> — hotels, transportation,
              driving, and information for guests coming from near and far.
            </li>
            <li>
              <Link to="/schedule-menu">Schedule &amp; Menu</Link> — a closer
              look at the day&rsquo;s schedule, reception, and brunch menu.
            </li>
            <li>
              <Link to="/theme">Theme and Attire</Link> — vintage garden
              formal, with statement hats strongly encouraged.
            </li>
            <li>
              <Link to="/rsvp/">RSVP</Link> — let us know whether you&rsquo;ll
              be joining us this May Day.
            </li>
          </ul>
        </div>
      </ContentSection>
    </PageContainer>
  );
}

export default VenuePage;
