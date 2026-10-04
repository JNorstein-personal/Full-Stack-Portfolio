import { Link } from "react-router-dom";

import ContentSection from "../components/layout/ContentSection";
import PageContainer from "../components/layout/PageContainer";

function ThemePage() {
  return (
    <PageContainer>
      <ContentSection labelledBy="theme-heading">
        <h1 id="theme-heading">Theme and Attire</h1>

        <div className="prose-width">
          <p>
            Our wedding is inspired by the whimsical world of{" "}
            <cite>Howl’s Moving Castle</cite>, drawing from both Diana Wynne
            Jones’ novel and Hayao Miyazaki’s film adaptation. We love the
            story’s mixture of romance, humor, magic, transformation, and the
            unexpected families and homes people create together.
          </p>

          <p>
            You do not need to know the book or film to enjoy the theme. Think
            of it simply as the inspiration behind an elegant spring garden
            celebration with a little storybook magic mixed in.
          </p>

          <p>
            For more information on <cite>Howl’s Moving Castle</cite>, and for links to where you can get yourself a copy of the book, the audiobook or the movie, check out
            our <Link to="/read-listen-watch">Read, Listen & Watch</Link>{" "}
            page.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="attire-heading">
        <h2 id="attire-heading">What to Wear: Vintage Garden Formal</h2>

        <div className="prose-width">
          <p>
            Our dress code is <strong>Vintage Garden Formal</strong>.
          </p>

          <p>
            Think Kentucky Derby or an elegant garden party, with room for
            vintage influence, dramatic details, botanical touches, and at least
            a little (but preferably more than a little) whimsy!
          </p>

          <p>
            Dresses,suits, separates, jumpsuits, waistcoats, frock coats,
            flowing skirts, tailored trousers, and other formal or semi-formal
            combinations are all welcome.
          </p>

          <p>
            Our attire suggestions are not divided by gender, so choose the
            style and silhouette that feels most comfortable and authentic to
            you.
          </p>

          <p>
            Historical accuracy is neither expected nor required. Victorian,
            Edwardian, Art Nouveau, cottagecore, storybook, fantasy, and other
            period-inspired elements can all fit beautifully—even when mixed
            together somewhat anachronistically.
          </p>

          <p>
            Above all, choose something that feels celebratory, comfortable, and
            like <strong>you</strong>.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="hats-accessories-heading">
        <h2 id="hats-accessories-heading">
          Hats, Accessories &amp; a Little Magic
        </h2>

        <div className="prose-width">
          <p>
            <strong>Statement hats are strongly encouraged.</strong>
          </p>

          <p>
            Wide-brimmed garden hats, fascinators, boaters, top hats, floral or
            botanical millinery, vintage-inspired hats, and wonderfully
            imaginative creations are all fair game.
          </p>

          <p>
            Accessories are also a great place to have fun with the theme:
            flowers, feathers, antique-style jewelry, brooches, pocket watches,
            parasols, scarves, embroidered details, botanical motifs, or subtle
            magical touches can all work.
          </p>

          <p>
            If you want to lean farther into the{" "}
            <cite>Howl’s Moving Castle</cite> inspiration, whimsical or
            deliberately anachronistic elements are welcome—but entirely
            optional.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="color-palette-heading">
        <h2 id="color-palette-heading">Color Palette</h2>

        <div className="prose-width">
          <p>
            Our guest palette draws from spring wildflowers, garden greenery,
            soft neutrals, jewel tones, weathered metals, and richer botanical
            colors.
          </p>

          <p>
            The palette is meant to provide inspiration,{" "}
            <strong>not to assign colors or restrict what you may wear</strong>.
            You are welcome to build an outfit from a single color, combine
            several, use them only as accents, or simply choose something that
            feels harmonious with the overall garden atmosphere.
          </p>

          <p>
            There is no expectation that couples, families, or groups coordinate
            with one another unless they want to.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="have-fun-heading">
        <h2 id="have-fun-heading">Have Fun With It</h2>

        <div className="prose-width">
          <p>
            Most importantly: <strong>have fun with it.</strong>
          </p>

          <p>
            The theme, palette, examples, and inspiration on this page are
            suggestions—not a rulebook. You do not need to dress as a character,
            reproduce a historical period, or purchase anything specifically for
            the wedding.
          </p>

          <p>
            Whether your interpretation is subtle, theatrical, vintage, modern,
            floral, fantastical, or simply a favorite formal outfit that makes
            you feel wonderful, we want you to be comfortable and enjoy
            celebrating with us.
          </p>
        </div>

        {/*
          MULTIMEDIA PHASE

          The following approved assets will eventually appear
          at the bottom of this page:

          1. Guest Color Palette.png
             - Guest color-palette reference

          2. Inspirations General Guest Attire.png
             - General guest-attire inspiration collage

          Do not add the wedding-party Character Design Guide
          here. It contains substantially more detailed
          character-specific guidance than general guests need.
        */}
      </ContentSection>
    </PageContainer>
  );
}

export default ThemePage;
