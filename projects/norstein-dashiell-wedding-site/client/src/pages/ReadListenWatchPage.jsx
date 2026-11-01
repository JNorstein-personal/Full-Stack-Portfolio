import ContentSection from "../components/layout/ContentSection";
import ExternalLink from "../components/common/ExternalLink";
import BackToTop from "../components/navigation/BackToTop";
import PageContainer from "../components/layout/PageContainer";

import bookCover from "../assets/images/HowlsCastleBookCover.png";
import moviePoster from "../assets/images/HowlCastleMoviePoster.png";

function JumpToNav() {
  return (
    <nav className="read-listen-watch-jump-nav" aria-label="Jump to page section">
      <p>
        <strong>Jump To:</strong>{" "}
        <a href="#about-the-book">About the Book</a>
        {" · "}
        <a href="#about-the-movie">About the Movie</a>
        {" · "}
        <a href="#experience-the-story">Read, Listen or Watch for Yourself</a>
      </p>
    </nav>
  );
}

function ReadListenWatchPage() {
  return (
    <PageContainer>
      <ContentSection labelledBy="read-listen-watch-heading">
        <h1 id="read-listen-watch-heading">Read, Listen &amp; Watch</h1>

        <div className="prose-width">
          <p>
            Our wedding theme draws its inspiration in equal measure from two
            works very dear to our hearts: Diana Wynne Jones&apos; beloved 1986
            fantasy novel <cite>Howl&apos;s Moving Castle</cite>, and Studio Ghibli&apos;s
            breathtaking 2004 animated film of the same name, written and
            directed by Hayao Miyazaki.
          </p>

          <p>
            Although the film shares its central characters and much of its
            premise with the book, Miyazaki took considerable creative liberties
            with the source material, introducing new themes, changing elements
            of the story, and reimagining its magical world through his own
            artistic vision. The result is not simply the same story told twice,
            but two wonderfully distinct works, each brilliant in its own way.
          </p>

          <p>
            Both have inspired the atmosphere, imagery, and spirit of our
            wedding, and we would love to share a little of what makes them so
            special to us.
          </p>

          <p>
            <strong>Explore this page:</strong>{" "}
            <a href="#about-the-book">About the Book</a>
            {" · "}
            <a href="#about-the-movie">About the Movie</a>
            {" · "}
            <a href="#experience-the-story">Read, Listen or Watch for Yourself</a>
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="about-the-book">
        <h2 id="about-the-book">About the Book</h2>

        <div className="prose-width">
          <img
            className="read-listen-watch-feature-image"
            src={bookCover}
            alt="Cover of Diana Wynne Jones' Howl's Moving Castle"
          />

          <h3>A Little About the Story</h3>

          <p>
            First published in 1986, <cite>Howl&apos;s Moving Castle</cite>
            introduces readers to the magical kingdom of Ingary, where
            seven-league boots, enchanted objects, and mysterious wizards are
            all part of everyday life.
          </p>

          <p>
            Sophie Hatter, the eldest of three sisters, believes that her place
            in the family has already determined her fate: as everyone knows,
            the eldest child in a fairy tale is destined to fail miserably
            should they ever seek their fortune. Resigned to an uneventful
            existence making hats, Sophie finds her life unexpectedly
            transformed when the formidable Witch of the Waste places a curse
            upon her, turning her into an elderly woman.
          </p>

          <p>
            With little left to lose, Sophie ventures into the hills and takes
            refuge in the extraordinary moving castle belonging to the
            notorious Wizard Howl. There she encounters Howl&apos;s young apprentice
            Michael, the cantankerous fire demon Calcifer, and Howl himself,
            whose terrifying reputation conceals a considerably more
            complicated personality.
          </p>

          <p>
            What follows is a delightfully unpredictable adventure involving
            curses, bargains, mistaken identities, unexpected friendships, an
            extradimensional visit to Wales, and more than a little romantic
            confusion. Beneath its humor and magical misadventures lies a
            touching story about discovering one&apos;s own worth, challenging
            expectations, and finding love in the most unlikely circumstances.
          </p>

          <h3>About the Author: Diana Wynne Jones</h3>

          <p>
            Diana Wynne Jones (1934–2011) was a celebrated British fantasy
            author whose extraordinary imagination, sharp wit, and inventive
            approach to storytelling have enchanted generations of readers.
            Over a writing career spanning several decades, she created richly
            imagined worlds filled with eccentric characters, unconventional
            magic, and clever subversions of familiar fairy-tale traditions.
          </p>

          <p>
            Among her best-known works are the Chrestomanci series, The
            Dalemark Quartet, and, of course, <cite>Howl&apos;s Moving Castle</cite>.
            Her stories frequently explore the complicated relationships
            between fate and free will, appearances and reality, and the
            extraordinary possibilities hidden within seemingly ordinary
            people. Rather than relying upon traditional heroes and villains,
            Jones gave her characters recognizable human flaws, insecurities,
            and strengths, making even her most fantastical creations feel
            remarkably real.
          </p>

          <h3>How the Book Inspired Our Wedding</h3>

          <p>
            One of the qualities we love most about Diana Wynne Jones&apos;{" "}
            <cite>Howl&apos;s Moving Castle</cite> is its affectionate disregard for
            the conventions of a proper fairy tale. Its heroes are imperfect,
            its magic is frequently inconvenient, and its most meaningful
            relationships develop through misunderstandings, stubbornness,
            kindness, and the everyday business of sharing a life together.
          </p>

          <p>
            The novel&apos;s playful treatment of destiny holds particular
            significance for us. Sophie begins her adventure convinced that
            being the eldest of three sisters means she is fated to fail.
            Considering that our own love story brings together not one, but
            two eldest children of four, we couldn&apos;t resist embracing that
            particular bit of fairy-tale misfortune and putting our own spin on
            it.
          </p>

          <p>
            The book also contributed to our wedding&apos;s fondness for
            old-fashioned charm, eccentric personalities, unconventional
            romance, and the occasional magical absurdity. Its world of curious
            enchantments, elaborate clothing, mysterious doors, and
            extraordinary hats fits rather neatly with our vision, full as it is
            with whimsy and playful anachronism: a celebration where
            individuality is very much encouraged.
          </p>

          <p>
            Above all, the novel reminds us that happily-ever-after need not
            look anything like the ending we once imagined. Sometimes the
            greatest adventures begin when we abandon the roles we thought we
            were supposed to play and discover the life we truly wish to share
            with someone else.
          </p>

          <h3>Prefer to Listen?</h3>

          <p>
            For those who would rather experience the story by listening,
            <cite>Howl&apos;s Moving Castle</cite> is also available as an unabridged
            audiobook narrated by Jenny Sterlin. Her expressive performance
            gives wonderful life to Jones&apos; eccentric cast of characters,
            capturing the humor, magic, and emotional warmth of the original
            novel.
          </p>

          <ul>
            <li>
              <ExternalLink href="https://www.youtube.com/watch?v=m3-jntWsalU&list=PL-sV4Mlwrf8oz1shIZ65VWS5N12ghSGmy">
                Listen on YouTube
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://www.audible.com/pd/Howls-Moving-Castle-Audiobook/B002V5BB5U?source_code=ASSGB149080119000H&share_location=pdp">
                Listen on Audible
              </ExternalLink>
            </li>
          </ul>

          <p>
            And, if you find yourself reluctant to leave Ingary behind once the
            story ends, there are further adventures to discover!{" "}
            <cite>Howl&apos;s Moving Castle</cite> is followed by two companion
            novels, <cite>Castle in the Air</cite> (1990) and{" "}
            <cite>House of Many Ways</cite> (2008), which expand upon its
            magical world and revisit some familiar faces.
          </p>

          <JumpToNav />
        </div>
      </ContentSection>

      <ContentSection labelledBy="about-the-movie">
        <h2 id="about-the-movie">About the Movie</h2>

        <div className="prose-width">
          <img
            className="read-listen-watch-feature-image"
            src={moviePoster}
            alt="Poster for Studio Ghibli's Howl's Moving Castle"
          />

          <h3>A Glimpse Into Howl and Sophie&apos;s World</h3>

          <iframe
            src="https://www.youtube.com/embed/iwROgK94zcM"
            title="Howl's Moving Castle official trailer"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{
              width: "100%",
              aspectRatio: "16 / 9",
              border: 0,
            }}
          />

          <p>
            <ExternalLink href="https://youtu.be/iwROgK94zcM">
              Open the trailer on YouTube
            </ExternalLink>
          </p>

          <h3>A Little About the Film</h3>

          <p>
            Released in Japan in 2004, Studio Ghibli&apos;s{" "}
            <cite>Howl&apos;s Moving Castle</cite> reimagines Diana Wynne Jones&apos;
            enchanting novel as a visually spectacular tale of love, courage,
            transformation, and the human cost of war.
          </p>

          <p>
            Sophie is a quiet young woman working in her family&apos;s hat shop when
            a chance encounter with the mysterious wizard Howl changes her life
            forever. After attracting the jealousy of the Witch of the Waste,
            Sophie finds herself transformed into an elderly woman and sets out
            in search of a way to break the curse.
          </p>

          <p>
            Her journey leads her to Howl&apos;s remarkable moving castle, a
            sprawling, mechanical marvel that wanders across the countryside on
            enormous legs. Within its walls, Sophie discovers an unlikely
            household consisting of an enigmatic wizard, his young apprentice
            Markl, and Calcifer, a decidedly temperamental fire demon who keeps
            the castle moving.
          </p>

          <p>
            As Sophie gradually becomes part of this unconventional family, she
            discovers that Howl is caught in a growing conflict between powerful
            kingdoms, and that the magic surrounding him carries a terrible
            price.
          </p>

          <p>
            Against a backdrop of breathtaking landscapes, fantastical
            machines, and a world threatened by war, Sophie and Howl must
            confront their fears, discover their own courage, and learn what it
            truly means to care for another person.
          </p>

          <h3>About Studio Ghibli</h3>

          <p>
            Founded in Japan in 1985, Studio Ghibli has become one of the most
            celebrated animation studios in the world, renowned for its
            extraordinary artistry, imaginative storytelling, and remarkable
            ability to find beauty and wonder in everyday life.
          </p>

          <p>
            Responsible for beloved films including <cite>My Neighbor Totoro</cite>,{" "}
            <cite>Kiki&apos;s Delivery Service</cite>, <cite>Princess Mononoke</cite>,
            and <cite>Spirited Away</cite>, the studio has established a
            distinctive tradition of animation that combines richly detailed
            environments, memorable characters, and stories that resonate with
            audiences of all ages.
          </p>

          <p>
            From the quiet beauty of a countryside garden to the fantastical
            workings of an impossible machine, Studio Ghibli&apos;s films invite
            viewers to appreciate both the extraordinary and the seemingly
            ordinary. Their worlds feel lived-in, lovingly crafted, and filled
            with small details that reward curiosity, making them places
            audiences long to visit and revisit.
          </p>

          <h3>About the Director: Hayao Miyazaki</h3>

          <p>
            Hayao Miyazaki, born in 1941, is a Japanese animator, filmmaker, and
            co-founder of Studio Ghibli, widely regarded as one of the most
            influential figures in the history of animated cinema.
          </p>

          <p>
            Throughout his career, Miyazaki has created imaginative worlds that
            blend fantasy with deeply human experiences, exploring themes of
            compassion, environmental stewardship, personal growth, and the
            consequences of violence and conflict. His films frequently feature
            independent, resourceful protagonists whose greatest strengths are
            not supernatural powers, but determination, kindness, and the
            courage to challenge the world around them.
          </p>

          <p>
            In adapting <cite>Howl&apos;s Moving Castle</cite>, Miyazaki brought his
            own artistic sensibilities to Jones&apos; original story, substantially
            expanding its exploration of war, peace, and the destructive
            consequences of human ambition. His interpretation transformed the
            novel&apos;s magical setting into an extraordinary visual landscape,
            combining European-inspired architecture, intricate mechanical
            inventions, lush natural scenery, and moments of remarkable
            tenderness.
          </p>

          <p>
            The result is a film that honors the spirit of its literary
            inspiration while telling a distinctly Miyazaki story.
          </p>

          <h3>How the Movie Inspired Our Wedding</h3>

          <p>
            While the novel provided much of our wedding&apos;s literary whimsy and
            playful approach to fairy-tale conventions, Studio Ghibli&apos;s
            adaptation helped bring that inspiration to life visually and
            emotionally.
          </p>

          <p>
            The film&apos;s romantic landscapes, sweeping fields of flowers,
            fanciful architecture, and beautiful contrasts between the natural
            and mechanical worlds all contributed to the atmosphere we hope to
            create. Its blend of vintage European fashions, elaborate hats,
            colorful gardens, and fantastical details helped shape our vision of
            a celebration that feels simultaneously elegant, nostalgic, and
            just a little outside of time.
          </p>

          <iframe
            src="https://www.youtube.com/embed/HMGetv40FkI"
            title="Merry Go Round of Life from Howl's Moving Castle"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{
              width: "100%",
              aspectRatio: "16 / 9",
              border: 0,
            }}
          />

          <p>
            <ExternalLink href="https://youtu.be/HMGetv40FkI?list=RDHMGetv40FkI">
              Listen to Merry-Go-Round of Life on YouTube
            </ExternalLink>
          </p>

          <p>
            The music also plays an important role in the film&apos;s enchanting
            atmosphere. Joe Hisaishi&apos;s magnificent score, particularly the
            now-iconic waltz <cite>Merry-Go-Round of Life</cite>, lends the
            story a sense of sweeping romance, joyful movement, and wistful
            nostalgia that feels especially appropriate for a wedding.
          </p>

          <p>
            Beyond its visual splendor, however, what speaks to us most is the
            film&apos;s understanding of love as an act of courage and compassion.
            Sophie&apos;s affection does not simply transform Howl; her willingness
            to care for others helps her discover strength and confidence
            within herself. Their relationship develops through patience,
            sacrifice, mutual acceptance, and the gradual creation of a home
            together.
          </p>

          <p>
            In a world filled with conflict and uncertainty, the film offers a
            beautiful reminder that tenderness, loyalty, and the courage to love
            are powerful forces in their own right.
          </p>

          <p>
            These are the sentiments we most hope to carry into our marriage,
            and the spirit we hope will be felt throughout our celebration.
          </p>

          <JumpToNav />
        </div>
      </ContentSection>

      <ContentSection labelledBy="experience-the-story">
        <h2 id="experience-the-story">Read, Listen or Watch for Yourself</h2>

        <div className="prose-width">
          <p>
            Whether you&apos;ve loved <cite>Howl&apos;s Moving Castle</cite> for years,
            have only encountered one of its two interpretations, or are
            discovering Sophie, Howl, and Calcifer for the very first time, we
            wholeheartedly encourage you to explore both versions of the story.
          </p>

          <p>
            Neither the book nor the film requires familiarity with the other,
            and each offers its own delightful surprises. We think experiencing
            both makes their shared characters and wonderfully different worlds
            all the more rewarding.
          </p>

          <h3>Read the Book</h3>

          <p>
            If you&apos;d like to read the novel for yourself, you can find it
            through either of the following retailers:
          </p>

          <ul>
            <li>
              <ExternalLink href="https://bookshop.org/p/books/howl-s-moving-castle-diana-wynne-jones/fa7899e763cf8c37?ean=9780061478789">
                Purchase the book on Bookshop.org
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://www.amazon.com/Howls-Moving-Castle-Diana-Wynne/dp/0061478784/">
                Purchase the book on Amazon
              </ExternalLink>
            </li>
          </ul>

          <h3>Watch the Movie</h3>

          <p>
            Learn more about the film, purchase a physical copy, or stream it
            online:
          </p>

          <ul>
            <li>
              <ExternalLink href="https://www.imdb.com/title/tt0347149/">
                View Howl&apos;s Moving Castle on IMDb
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://www.amazon.com/Howls-Moving-Castle-Blu-ray-Christian/dp/B074121MFS/">
                Purchase the movie on Blu-ray from Amazon
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://www.hbomax.com/movie/7a7a03ca-dd3a-4e62-9e43-e845f338f85e">
                Stream Howl&apos;s Moving Castle on HBO Max
              </ExternalLink>
            </li>
          </ul>

          <p>
            We hope these stories bring you as much joy as they have brought us.
            Whether you find yourself enchanted by the clever humor of the
            original novel, swept away by the breathtaking beauty of the film,
            or simply developing a newfound appreciation for the company of an
            occasionally irritable fire demon, we&apos;re delighted to share a little
            of the magic that helped inspire our wedding.
          </p>

          <p>
            After all, the best stories are the ones we get to share. And
            perhaps, if we&apos;re lucky, the ones we get to live together.
          </p>

          <JumpToNav />
        </div>
      </ContentSection>
      <BackToTop />
    </PageContainer>
  );
}

export default ReadListenWatchPage;
