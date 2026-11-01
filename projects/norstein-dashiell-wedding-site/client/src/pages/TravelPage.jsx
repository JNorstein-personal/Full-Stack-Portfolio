import { Link } from "react-router-dom";
import BackToTop from "../components/navigation/BackToTop";
import ExternalLink from "../components/common/ExternalLink";
import Card from "../components/common/Card";
import ContentSection from "../components/layout/ContentSection";
import PageContainer from "../components/layout/PageContainer";
import { activeEventConfiguration } from "../data/eventConfigurations.js";
import { siteContent } from "../data/siteContent.js";

function TravelPage() {
  const event = activeEventConfiguration.schedule[0];
  const address =
    activeEventConfiguration.ceremony.address ??
    activeEventConfiguration.reception.address;

  return (
    <PageContainer>
      <ContentSection labelledBy="travel-heading">
        <h1 id="travel-heading">Travel</h1>

        <div className="prose-width">
          <h2>Planning Your Visit</h2>

          <p>
            We&rsquo;re delighted to welcome friends and family to Roselle, New
            Jersey, for our May Day celebration. Both the ceremony and
            reception will be held at the Sphinx Banquet &amp; Catering Center,
            so there is only one wedding-day destination to plan around.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="travel-location-heading">
        <h2 id="travel-location-heading">Wedding Location</h2>

        <div className="prose-width">
          <p>
            <strong>{event.venueName}</strong>
            <br />
            {address}
          </p>

          <p>
            {siteContent.wedding.date.fullDisplay}
            <br />
            Ceremony begins at <strong>11:30 a.m.</strong>
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
        </div>
      </ContentSection>

      <ContentSection labelledBy="travel-driving-heading">
        <h2 id="travel-driving-heading">Driving &amp; Parking</h2>

        <div className="prose-width">
          <p>
            Municipal parking is available in the lot directly across the
            street from the venue. Please allow extra time to park and cross
            the street before the ceremony.
          </p>

          <p>
            See the <Link to="/venue">Venue</Link> page for additional
            wedding-day location information.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="travel-hotels-heading">
        <h2 id="travel-hotels-heading">Hotels &amp; Overnight Stays</h2>

        <div className="prose-width">
          <Card>
            <p>
              <strong>Accommodation details are still being finalized.</strong>
            </p>

            <p>
              We&rsquo;re still gathering hotel recommendations and any booking
              details. No hotel room block or negotiated rate has been
              confirmed yet. We&rsquo;ll add accommodation information here once it
              is available.
            </p>
          </Card>
        </div>
      </ContentSection>

      <ContentSection labelledBy="travel-transit-heading">
        <h2 id="travel-transit-heading">Arriving by Train or Air</h2>

        <div className="prose-width">
          <p>
            Guests traveling from farther away should plan their journey to
            Roselle and confirm their own schedules and onward transportation.
            Specific station, airport, and local-transfer recommendations will
            be added only after those details are verified.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="travel-next-heading">
        <h2 id="travel-next-heading">Continue Planning</h2>

        <div className="prose-width">
          <p>
            For wedding-day timing and food information, visit our{" "}
            <Link to="/schedule-menu">Schedule &amp; Menu</Link> page.
          </p>
        </div>
      </ContentSection>
      <BackToTop />
    </PageContainer>
  );
}

export default TravelPage;
