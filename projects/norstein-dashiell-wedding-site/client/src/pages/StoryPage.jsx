import { useEffect } from "react";
import { Link } from "react-router-dom";

import ContentSection from "../components/layout/ContentSection";
import PageContainer from "../components/layout/PageContainer";
import BackToTop from "../components/navigation/BackToTop";
import MediaAwareYouTube from "../components/media/MediaAwareYouTube";
import { useBackgroundMusic } from "../components/media/BackgroundMusicContext";
import HowlSophieUs from "../assets/icons/HowlSophieUs.png";
import engagementRing from "../assets/images/EngagementRing.jpg";
import proposalAftermath from "../assets/images/ProposalAftermath.jpg";
import proposalProof from "../assets/images/ProposalProof.jpg";
import proposalProp1 from "../assets/images/ProposalProp1of5.jpg";
import proposalProp2 from "../assets/images/ProposalProp2of5.jpg";
import proposalProp3 from "../assets/images/ProposalProp3of5.jpg";
import proposalProp4 from "../assets/images/ProposalProp4of5.jpg";
import proposalProp5 from "../assets/images/ProposalProp5of5.jpg";
import proposalSetup from "../assets/images/ProposalSetup.jpg";
import proposalVideo from "../assets/videos/ProposalVideo.mp4";

const PROPOSAL_VIDEO_MEDIA_ID = "story-proposal-video";

function StoryPage() {
  const {
    registerForegroundPlayback,
    unregisterForegroundPlayback,
  } = useBackgroundMusic();

  useEffect(() => {
    return () => {
      unregisterForegroundPlayback(
        PROPOSAL_VIDEO_MEDIA_ID,
      );
    };
  }, [unregisterForegroundPlayback]);

  return (
    <PageContainer>
      <ContentSection labelledBy="story-heading">
        <h1 id="story-heading">Our Story</h1>

        <div className="prose-width">
          <p>
            Read on to find out more about us, the life we&apos;ve built together,
            and the path that brought us to our wedding day.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="relationship-heading">
        <h2 id="relationship-heading">A Hair-Raising Happily-Ever-After</h2>
       <div className="prose-width">
                  <img
                    className="studio-ghibli-style-caricatures"
                    src={HowlSophieUs}
                    alt="Studio Ghibli-style caricatures of Taylor and Joshua"

                    title="Studio Ghibli-style caricatures of Taylor and Joshua"
                  />
        </div>
        <div className="prose-width">
          <blockquote>
            <p>
              “In the land of Ingary, where such things as seven-league boots
              and cloaks of invisibility really exist, it is quite a misfortune
              to be born the eldest of three. Everyone knows you are the one who
              will fail first, and worst, if the three of you set out to seek
              your fortunes.”
            </p>
            <footer>
              — Excerpt from Diana Wynne Jones&apos;{" "}
              <cite>Howl&apos;s Moving Castle</cite>
            </footer>
          </blockquote>

          <p>
            There is, perhaps, only one fate more misfortunate than being the
            eldest of three, and it is this very fate which brings us together
            to celebrate this coming May Day: Taylor Dashiell and Joshua
            Norstein are both not merely the eldest of three, but the eldest of
            four!
          </p>

          <p>
            When the two first met in January of 2023, they bonded immediately
            over three things:
          </p>

          <ol>
            <li>
              A deep and abiding passion for stories and narratives of all
              shapes and sizes.
            </li>
            <li>
              A mutual confusion over why anyone thinks golf should be a
              spectator sport.
            </li>
            <li>The long-suffering plight of the eldest sibling.</li>
          </ol>

          <p>
            No true romance can persist without its tribulations, and the two
            did their best to get as many of these out of the way as early on
            as possible. Whether it was Taylor telling Joshua he bore the
            fragrance of day-old pasta sauce on their second date (an effect
            quickly remedied by a reduction of onions in his diet), or Joshua&apos;s
            rambling over-the-phone admission to bearing a nearly irrational
            dislike of flip-flops. Yet somehow, despite his bombastic eyebrows
            and the fashion sense of a substitute chemistry teacher, and her
            vehement antipathy towards loading the dishwasher, they made it
            work.
          </p>

          <p>
            Theirs is the love of two best friends; the sort of couple who will
            absolutely cancel plans last-minute and realize after hours of
            feeling guilty about it that they really prefer each other&apos;s company
            more anyway.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="planning-heading">
        <h2 id="planning-heading">From Engagement to Wedding Day</h2>

        <div className="prose-width">
          <p>
            Having long since established that they were quite content to spend
            the rest of their lives in one another&apos;s company, Joshua decided
            that the next logical step was to make the arrangement official.
            Naturally, this called for an elaborate conspiracy involving many
            accomplices, a botanical garden preserve, an assortment of shipping
            tags, carbon transfer paper and what was in hindsight a thoroughly
            unnecessary visit to a fish market.
          </p>

          <p>
            The setting was Innisfree Garden in Millbrook, New York, one of
            Joshua&apos;s favorite places in the world, and the occasion was Mother&apos;s
            Day. Under the pretense of an eagerly anticipated first visit of the
            season, he led Taylor along the garden&apos;s winding paths toward a
            particularly beloved landmark: the wishing tree.
          </p>

          <img
            className="story-photo story-photo--standard"
            src={proposalSetup}
            alt="The proposal setup at Innisfree Garden near the wishing tree"

            title="The proposal setup at Innisfree Garden near the wishing tree"
            loading="lazy"
          />

          <p>
            There, hanging from its branches, were five seemingly innocuous
            tags, each bearing a portion of a quotation from Diana Wynne Jones&apos;{" "}
            <cite>Howl&apos;s Moving Castle</cite>, a story particularly dear to them
            both:
          </p>

          <img
            className="story-photo story-photo--eighty"
            src={proposalProp1}
            alt="Tag 1 of 5. Howl said, ‘I think we ought to live happily ever after,’ and she thought he meant it…"

            title="Tag 1 of 5. Howl said, ‘I think we ought to live happily ever after,’ and she thought he meant it…"
            loading="lazy"
          />

          <img
            className="story-photo story-photo--eighty"
            src={proposalProp2}
            alt="Tag 2 of 5. …Sophie knew that living happily ever after with Howl would be a good deal more eventful than any story made it sound, though she was determined to try…"

            title="Tag 2 of 5. …Sophie knew that living happily ever after with Howl would be a good deal more eventful than any story made it sound, though she was determined to try…"
            loading="lazy"
          />

          <img
            className="story-photo story-photo--eighty"
            src={proposalProp3}
            alt="Tag 3 of 5. …‘It should be hair-raising,’ added Howl. ‘And you’ll exploit me,’ Sophie said. ‘And then you’ll cut up all my suits to teach me,’ said Howl…"

            title="Tag 3 of 5. …‘It should be hair-raising,’ added Howl. ‘And you’ll exploit me,’ Sophie said. ‘And then you’ll cut up all my suits to teach me,’ said Howl…"
            loading="lazy"
          />

          <img
            className="story-photo story-photo--eighty"
            src={proposalProp4}
            alt="Tag 4 of 5. …If Sophie or Howl had had any attention to spare, they might have noticed that Prince Justin, Wizard Suliman, and Mrs. Fairfax were all trying to speak to Howl…"

            title="Tag 4 of 5. …If Sophie or Howl had had any attention to spare, they might have noticed that Prince Justin, Wizard Suliman, and Mrs. Fairfax were all trying to speak to Howl…"
            loading="lazy"
          />

          <img
            className="story-photo story-photo--eighty"
            src={proposalProp5}
            alt="Tag 5 of 5. …And that Fanny, Martha, and Lettie were plucking at Sophie’s sleeves, while Michael was dragging at Howl’s jacket. But Sophie and Howl were holding one another’s hands and smiling and smiling, quite unable to stop. Now would be an excellent time to turn around."

            title="Tag 5 of 5. …And that Fanny, Martha, and Lettie were plucking at Sophie’s sleeves, while Michael was dragging at Howl’s jacket. But Sophie and Howl were holding one another’s hands and smiling and smiling, quite unable to stop. Now would be an excellent time to turn around."
            loading="lazy"
          />

          <p>
            When Taylor obliged the directions at the end of the final tag, she
            found Joshua on one knee, ring box in hand.
          </p>

          <img
            className="story-photo story-photo--half"
            src={proposalProof}
            alt="She said ‘Yes’!"

            title="She said ‘Yes’!"
            loading="lazy"
          />

          <p>
            I hope, dear readers, that I&apos;m not spoiling the ending for you much,
            when I tell you that she did in fact say yes!
          </p>

          <img
            className="story-photo story-photo--eighty"
            src={engagementRing}
            alt="Taylor's engagement ring"

            title="Taylor's engagement ring"
            loading="lazy"
          />

          <img
            className="story-photo story-photo--standard"
            src={proposalAftermath}
            alt="Taylor and Joshua together after the proposal"

            title="Taylor and Joshua together after the proposal"
            loading="lazy"
          />

          <p>
            Of course, what Taylor didn&apos;t know was that the entire outing had
            been the culmination of several months of meticulous preparation,
            misdirection and improvisation; that in order to make his enthusiasm
            for this trip to Innisfree simultaneously as innocuous, natural and
            above all necessary as possible, her usually honest-to-a-fault
            partner had spent the preceding months orchestrating a ruse of truly
            ridiculous proportions.
          </p>

          <p>
            For the full story behind the proposal, Joshua tells the tale in his
            own words below.
          </p>

          <MediaAwareYouTube
            videoId="fThuwOTq7p8"
            mediaId="story-proposal-youtube"
            title="The story behind Joshua and Taylor's proposal"
          />

          <p>
            It was, by any reasonable standard, an absurd amount of trouble to
            go through for a question to which Joshua already suspected he knew
            the answer. But then, neither half of this couple has ever been
            particularly inclined to do things by halves.
          </p>

          <p>
            And so, with a little help from their families, and with the
            spontaneous assistance of a kindly stranger who happened to capture
            the moment on video, the next chapter of their lives began.
          </p>

          <video
            className="story-proposal-video"
            controls
            preload="metadata"
            onPlay={() => {
              registerForegroundPlayback(
                PROPOSAL_VIDEO_MEDIA_ID,
              );
            }}
            onPause={() => {
              unregisterForegroundPlayback(
                PROPOSAL_VIDEO_MEDIA_ID,
              );
            }}
            onEnded={() => {
              unregisterForegroundPlayback(
                PROPOSAL_VIDEO_MEDIA_ID,
              );
            }}
            onError={() => {
              unregisterForegroundPlayback(
                PROPOSAL_VIDEO_MEDIA_ID,
              );
            }}
          >
            <source src={proposalVideo} type="video/mp4" />
            Your browser does not support embedded video.
          </video>

          <p>
            In the time since, that same love of stories, whimsical sense of
            humor, and shared enthusiasm for making life just a little more
            magical have helped shape the celebration they have planned for May
            Day, 2027.
          </p>

          <p>
            Every good story deserves a memorable ending. And every truly great
            love story deserves the opportunity to begin another chapter.
          </p>

          <p>
            Preferably one involving considerably less convoluted misdirection
            or tours of a fish market&apos;s dumpsters.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="story-next-step-heading">
        <h2 id="story-next-step-heading">Join Us</h2>

        <div className="prose-width">
          <p>
            Wedding-day information and RSVP details are available throughout
            the site.
          </p>

          <p>
            <Link className="button button--primary" to="/rsvp/">
              RSVP
            </Link>
          </p>

          <p>
            <Link to="/">Return to the wedding homepage</Link>
          </p>
        </div>
      </ContentSection>
      <BackToTop />
    </PageContainer>
  );
}

export default StoryPage;
