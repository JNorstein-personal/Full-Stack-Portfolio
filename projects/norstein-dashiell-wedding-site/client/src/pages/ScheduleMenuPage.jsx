import { Link } from "react-router-dom";

import ContentSection from "../components/layout/ContentSection";
import PageContainer from "../components/layout/PageContainer";
import BackToTop from "../components/navigation/BackToTop";
import howlBreakfast from "../assets/images/howl_breakfast.jpg";
import marklBreakfast from "../assets/images/Markl_breakfast.png";

function ScheduleMenuPage() {
  return (
    <PageContainer>
      <ContentSection labelledBy="schedule-menu-heading">
        <h1 id="schedule-menu-heading">Schedule &amp; Menu</h1>

        <div className="prose-width">
          <p>
            Our wedding day is intentionally simple: the ceremony and
            reception are both at the Sphinx Banquet &amp; Catering Center, and
            the celebration flows directly from one into the other.
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

          <h3>4:30 p.m. — Celebration Concludes</h3>
          <p>
            Everything takes place at the Sphinx Banquet &amp; Catering Center
            in Roselle. See the <Link to="/venue">Venue</Link> page for
            directions and parking information.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="menu-heading">
                <img
          className="schedule-menu-image schedule-menu-image--markl"
          src={marklBreakfast}
          alt="Markl enjoying breakfast in Howl's Moving Castle."
        />
        <h2 id="menu-heading">The Menu</h2>

        
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
          className="schedule-menu-image schedule-menu-image--howl"
          src={howlBreakfast}
          alt="Breakfast scene from Howl's Moving Castle."
        />
          <p>
            <Link to="/rsvp/">Go to RSVP</Link>
          </p>
        </div>
      </ContentSection>
      <BackToTop />
    </PageContainer>
  );
}

export default ScheduleMenuPage;
