import { Link } from "react-router-dom";
import { siteContent } from "../data/siteContent.js";
import ContentSection from "../components/layout/ContentSection";
import PageContainer from "../components/layout/PageContainer";
import BackToTop from "../components/navigation/BackToTop";
import howlBreakfast from "../assets/images/howl_breakfast.jpg";
import marklBreakfast from "../assets/images/Markl_Breakfast.jpg";

function DayOfPage() {
  return (
    <PageContainer>
      <ContentSection labelledBy="day-of-heading">
        <h1 id="day-of-heading">Day-Of Details</h1>

        <div className="prose-width">
          <p>
            Our wedding day is intentionally simple: the ceremony and
            reception are both at the Sphinx Banquet &amp; Catering Center, and
            the celebration flows directly from one into the other. See below for a simple breakdown of the day's events, the menu, and our gift policy.
          </p>

          <p>
            <strong>Explore this page:</strong>{" "}
            <a href="#schedule-heading">Schedule</a>
            {" · "}
            <a href="#menu-heading">Menu</a>
            {" · "}
            <a href="#gift-policy-heading">Gift Policy</a>
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="schedule-heading">
        <h2 id="schedule-heading">The Schedule</h2>

        <div className="prose-width">
          <h3>11:30 a.m. — Ceremony</h3>
          <p>
            Please arrive a little early to get settled before the ceremony
            begins.
          </p>

          <h3>After the Ceremony — Brunch &amp; Celebration</h3>
          <p>
            We&rsquo;ll move straight into a relaxed afternoon of buffet brunch,
            dancing, and celebrating together. There is no formal cocktail
            hour or minute-by-minute itinerary for guests to follow. Speeches
            and other little moments will be announced during the reception.
          </p>

          <h3>4:30 p.m. — Festivities Conclude</h3>
          <p>
            Everything takes place at the Sphinx Banquet &amp; Catering Center
            in Roselle. See the <Link to="/venue">Venue</Link> page for
            directions and parking information.
          </p>
        </div>

      </ContentSection>

      <ContentSection labelledBy="menu-heading">
        <h2 id="menu-heading">The Menu</h2>
        <figure className="day-of-figure day-of-figure--markl">
          <img
            className="day-of-image day-of-image--markl"
            src={marklBreakfast}
            alt="Markl enjoying breakfast in Howl's Moving Castle."

            title="Markl enjoying breakfast in Howl's Moving Castle."
          />

          <figcaption className="day-of-caption">
            <em>
              &ldquo;Which d&apos;you want? You only get one, &apos;cause the rest&apos;re dirty.&rdquo;
              <br />
              &mdash;Howl&apos;s Apprentice Markl,{" "}
              <cite>Howl&apos;s Moving Castle</cite> (2004)
            </em>
          </figcaption>
        </figure>

        <div className="prose-width">
          <h3>Hot Brunch Buffet</h3>

          <p>
            Scrambled Eggs
            <br />
            Scrambled Eggs with Cheese
            <br />
            Turkey Sausage
            <br />
            Turkey Bacon
            <br />
            Home Fries
            <br />
            Pastrami Hash
          </p>

          <h3>Bagels &amp; Schmears</h3>

          <p>
            <strong>Bagels</strong>
            <br />
            Plain · Everything · Sesame · Poppy · Onion · Cinnamon Raisin
          </p>

          <p>
            <strong>Gluten-Free Bagels</strong>
            <br />
            Plain · Everything · Sesame
          </p>

          <p>
            <strong>Schmears</strong>
            <br />
            Plain Cream Cheese · Lox Spread · Herb and Chive · Vegetable ·
            Everything · Cinnamon Walnut Raisin
          </p>

          <p>
            <strong>Appetizing</strong>
            <br />
            Whitefish Salad
          </p>

          <p>
            <strong>Etcetera</strong>
            <br />
            Assorted Seasonal Fruit
          </p>

          <p>
            <strong>Beverages</strong>
            <br />
            Coffee · Tea · Mockmosas
          </p>

          <h2>Dessert selection to be announced.</h2>
        </div>

      </ContentSection>

      <ContentSection 
      labelledBy="dietary-heading">
        <h2 id="dietary-heading">Dietary Needs</h2>

        <div className="prose-width">
          <p>
            Gluten-free and non-dairy options will be available. If you or
            anyone in your party has food allergies, dietary restrictions, or
            other food-related needs, please include them with your RSVP.
          </p>

          <p>
            Please note that food may be prepared or served in environments
            where common allergens are present.
          </p>
        <img
          className="day-of-image day-of-image--howl"
          src={howlBreakfast}
          alt="Breakfast, cooked over a hot open fire demon"

          title="Breakfast, cooked over a hot open fire demon"
        />
          <p>
            <Link to="/rsvp/">Go to RSVP</Link>
          </p>
        </div>

      </ContentSection>

      <ContentSection labelledBy="gift-policy-heading">
  <h2 id="gift-policy-heading">Gift Policy</h2>

  <div className="prose-width">
    <p>
      Because we have plenty of stuff and not so much an abundance of space, we've decided against using a traditional wedding registry. If you would like
      to give us a gift, we would be delighted by something thoughtful and handcrafted.
      <br />
      …Or perhaps you'd like to help us put a little aside for the
      adventures and plans ahead of us?
    </p>

    <p>
      Some ideas that would be especially useful or meaningful to us include:
    </p>

    <ul>
      {siteContent.giftPolicy.preferredCategories.map((category) => (
        <li key={category}>{category}</li>
      ))}
    </ul>

    <p>
      We would prefer not to receive:
    </p>

    <ul>
      {siteContent.giftPolicy.nonPreferredCategories.map((category) => (
        <li key={category}>{category}</li>
      ))}
    </ul>

    <p>
      Of course, the greatest gift we could hope to receive is your company on our special day.
      <br />
      Hope to see you there!
    </p>
  </div>

</ContentSection>

      <BackToTop />
    </PageContainer>
  );
}

export default DayOfPage;