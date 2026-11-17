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
            street from the venue, so you won&rsquo;t have far to go once
            you&rsquo;ve arrived.
          </p>

          <p>
            One small but important heads-up: unfortunately, the municipal
            parking meters are active on most Saturdays as well as weekdays.
            Please be prepared to pay for parking, and give yourself a little
            extra time to find a space, check the posted meter or parking
            instructions, get everything squared away, and cross the street
            safely before the ceremony begins. That way, an unexpected
            ticket&mdash;or, worse, a tow&mdash;doesn&rsquo;t become part of
            your wedding-day adventure.
          </p>

          <p>
            See the <Link to="/venue">Venue</Link> page for additional
            wedding-day location information.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="travel-hotels-heading">
        <h2 id="travel-hotels-heading">Hotel Accommodations</h2>

        <div className="prose-width">
          <Card>
            <p>
              For guests traveling from out of town&mdash;or anyone who would
              simply prefer to stay nearby after the celebration&mdash;we have
              reserved a discounted room block at the <strong>Holiday Inn Clark</strong>.
            </p>

            <p>
              <strong>Holiday Inn Clark</strong>
              <br />
              36 Valley Road
              <br />
              Clark, NJ 07066
            </p>

            <p>
              Rooms are available from <strong>April 30 through May 2, 2027</strong>, At a special group rate of{" "}
              <strong>$129 per night, plus applicable state and local taxes</strong>.
              Breakfast is included with the group rate.
            </p>

            <p>The discounted rate applies to:</p>

            <ul>
              <li>King rooms</li>
              <li>Rooms with two queen beds</li>
              <li>Suites</li>
            </ul>

            <p>
              <strong>Check-in:</strong> Friday, April 30th at 3:00 PM
              <br />
              <strong>Check-out:</strong> Sunday, May 2nd at 11:00 AM
            </p>

            <p>
              The hotel will make every effort to accommodate early check-in
              requests, but early check-in cannot be guaranteed. Guests who need
              a connecting room should contact the hotel directly, as connecting
              rooms are limited and subject to availability.
            </p>

            <h3>Reserving Your Room</h3>

            <p>
              To receive the wedding room-block rate, please reserve your room{" "}
              <strong>no later than March 30, 2027</strong>.
            </p>

            <p>
              Reserve a room by calling{" "}
              <a href="tel:+17325740100">(732) 574-0100</a> and asking for the{" "}
              <strong>Norstein-Dashiell Wedding</strong> room block or providing
              group code: <strong>NDW</strong>.
            </p>

            <p>
              After March 30, the discounted wedding rate will no longer be
              guaranteed. Rooms may still be available at the hotel&rsquo;s regular
              rate, subject to availability.
            </p>
          </Card>
        </div>
      </ContentSection>

      <ContentSection labelledBy="travel-transit-heading">
        <h2 id="travel-transit-heading">Arriving by Train or Air</h2>

        <div className="prose-width">
          <p>
            Guests traveling from farther away have several convenient options
            for reaching Roselle. Please check current schedules and travel times
            before your trip, particularly if you will be making a rail
            connection.
          </p>

          <h3>Roselle Park Station &mdash; NJ Transit</h3>

          <p>
            <strong>Roselle Park Station</strong> is the closest NJ Transit rail
            station to the wedding location and is served by the{" "}
            <strong>Raritan Valley Line</strong>. Guests arriving here can
            continue to the venue or hotel by taxi, rideshare, or other local
            transportation.
          </p>

          <p>
            NJ Transit rail tickets may be purchased online, through the NJ
            Transit mobile app, or at a ticket vending machine at the station.
          </p>

          <p>
            <strong>Tickets:</strong>{" "}
            <ExternalLink href="https://webtickets.prod.njtransit.com/">
              Purchase NJ Transit rail tickets
            </ExternalLink>
          </p>

          <h3>Newark Penn Station &mdash; Amtrak &amp; NJ Transit</h3>

          <p>
            For guests traveling by Amtrak, we recommend arriving at{" "}
            <strong>Newark Penn Station</strong>. The station is served by both{" "}
            <strong>Amtrak</strong> and <strong>NJ Transit</strong>, making it a
            convenient transfer point for continuing toward Roselle.
          </p>

          <p>
            From Newark Penn, guests can transfer to an{" "}
            <strong>NJ Transit Raritan Valley Line</strong> train serving
            Roselle Park Station, then complete the remainder of the trip by
            taxi or rideshare.
          </p>

          <p>
            Amtrak and NJ Transit require separate tickets, so guests making
            this connection should purchase an Amtrak ticket to Newark Penn
            Station and an NJ Transit ticket for their onward trip.
          </p>

          <p>
            <strong>Tickets:</strong>{" "}
            <ExternalLink href="https://www.amtrak.com/tickets-reservations">
              Purchase Amtrak tickets
            </ExternalLink>
            {" · "}
            <ExternalLink href="https://webtickets.prod.njtransit.com/">
              Purchase NJ Transit rail tickets
            </ExternalLink>
          </p>

          <h3>
            Newark Liberty International Airport &mdash; Flights, Amtrak &amp;
            NJ Transit
          </h3>

          <p>
            <strong>Newark Liberty International Airport (EWR)</strong> is the
            most convenient airport for guests flying to the area, with both
            domestic and international service.
          </p>

          <p>
            Guests arriving by air may continue directly to Roselle by taxi or
            rideshare. Public transportation is also available: the
            airport&rsquo;s <strong>AirTrain</strong> connects the passenger
            terminals with{" "}
            <strong>Newark Liberty International Airport Rail Station</strong>,
            which is served by both NJ Transit and Amtrak. Guests traveling
            toward Roselle by rail can take NJ Transit to Newark Penn Station
            and transfer there to the Raritan Valley Line for Roselle Park.
          </p>

          <p>
            Guests traveling by Amtrak may also choose Newark Liberty
            International Airport Rail Station if their train stops there.
            AirTrain provides the connection between the rail station and the
            airport terminals.
          </p>

          <p>
            For airfare, use Newark Liberty International Airport&rsquo;s
            official airline directory to find the airline serving your route
            and book directly with the carrier.
          </p>

          <p>
            <strong>Flights:</strong>{" "}
            <ExternalLink href="https://www.newarkairport.com/flights/airlines">
              View airlines serving Newark Liberty International Airport
            </ExternalLink>
            <br />
            <strong>Rail tickets:</strong>{" "}
            <ExternalLink href="https://www.amtrak.com/tickets-reservations">
              Purchase Amtrak tickets
            </ExternalLink>
            {" · "}
            <ExternalLink href="https://webtickets.prod.njtransit.com/">
              Purchase NJ Transit rail tickets
            </ExternalLink>
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="travel-next-heading">
        <h2 id="travel-next-heading">Continue Planning</h2>

        <div className="prose-width">
          <p>
            For a brief day-of itinerary, menu information and gifting details, visit our{" "}
            <Link to="/day-of">Day-Of Details</Link> page.
          </p>
        </div>
      </ContentSection>
      <BackToTop />
    </PageContainer>
  );
}

export default TravelPage;
