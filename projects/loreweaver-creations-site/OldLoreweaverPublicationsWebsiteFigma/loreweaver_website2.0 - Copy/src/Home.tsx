import { MailingListForm } from "./components/MailingListForm";
import { LoreweaverCalendar } from "./components/LoreweaverCalendar";
import { PageNavDropdown } from "./components/PageNavDropdown";
import { useNavigate } from "react-router";

export default function Home() {
  const navigate = useNavigate();
  
  // Define page sections for jump-to navigation
  const pageSections = [
    { label: "Welcome to LOREWEAVER Publications", id: "welcome" },
    { label: "Featured", id: "featured" },
    { label: "Latest Updates", id: "latest-updates" },
    { label: "Join Our Mailing List", id: "mailing-list" },
    { label: "LOREWEAVER Calendar", id: "calendar" },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 flex-1">
      {/* Page Navigation Dropdown - Floats over page below nav banner */}
      <PageNavDropdown items={pageSections} />

      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        {/* Left Column - Only visible on desktop */}
        <div className="hidden lg:block lg:col-span-1 space-y-6">
          {/* Empty Image Box */}
          <div className="bg-gray-200 border-2 border-gray-300 rounded-lg aspect-square"></div>
          
          {/* Mailing List Form */}
          <MailingListForm />
        </div>

        {/* Right Column - Full width on mobile, 3/4 width on desktop */}
        <div className="lg:col-span-3 relative" id="welcome">
          {/* Mobile: Image left of heading */}
          <div className="flex items-start gap-4 mb-6 lg:hidden">
            <div className="bg-gray-200 border-2 border-gray-300 rounded-lg w-24 h-24 flex-shrink-0"></div>
            <h1 className="mb-0 text-3xl font-bold">Welcome to LOREWEAVER Publications!</h1>
          </div>

          {/* Desktop: Heading only */}
          <h1 className="hidden lg:block mb-6 text-3xl font-bold">Welcome to LOREWEAVER Publications!</h1>
          
          <div className="space-y-4 text-gray-700">
            <p>
              Wander roads untraveled, with LOREWEAVER PUBLICATIONS!
            </p>
            
            <p>
              Stay tuned for titles and diverse content, including:
            </p>
            
            <ul className="list-none space-y-3 ml-4">
              <li>
                <span className="inline-block mr-2">-</span>
                <strong>Novels</strong> - We are a small press publishing house, after all, meaning we'll be showcasing more than just the one title from more than one author, eventually!
              </li>
              <li>
                <span className="inline-block mr-2">-</span>
                <strong>Short Stories</strong> - see above
              </li>
              <li>
                <span className="inline-block mr-2">-</span>
                <strong>Webcomics & other Sequential Media</strong> - because there's more than one way to tell a story!
              </li>
              <li>
                <span className="inline-block mr-2">-</span>
                <strong>Audiobooks</strong>
              </li>
              <li>
                <span className="inline-block mr-2">-</span>
                <strong>RAISING THE TOWER</strong> - a weekly blog, chronicling the ascent of the LOREWEAVER brand, from one man's hairbrained idea, to (eventually) Eternal God-Emperor of all small press publishing moguls!
              </li>
              <li>
                <span className="inline-block mr-2">-</span>
                <strong>THE UNESCAPIST PODCAST</strong> - A monthly podcast, exploring the best of creative content for fans of Fantasy and Science Fiction, the myriad of related sub- and hybrid genres, the craft of writing, and managing a lifestyle of creative polymathy (get your mind out of the gutter!), among other things.
              </li>
              <li>
                <span className="inline-block mr-2">-</span>
                <strong>LOREWEAVERPEDIA</strong> - a routinely updated lore wiki detailing the fabric of the LOREWEAVER multiverse.
              </li>
              <li>
                <span className="inline-block mr-2">-</span>
                <strong>LOREWEAVER FANTHOLOGY</strong> - a fan-written, curated anthology of multiversal adventures, set in the infinite possibilities of the LOREWEAVER universe.
              </li>
            </ul>
            
            <p>
              ...And more to come - stay tuned!
            </p>
          </div>
        </div>
      </div>

      {/* Single Column Sections Below */}
      <div className="mt-16 space-y-12">
        {/* Featured Section */}
        <section id="featured">
          <h2 className="mb-6 text-3xl font-bold">Featured</h2>
          <div className="space-y-6">
            {/* New Releases Feature */}
            <div className="bg-[#48454f] rounded-lg shadow-md p-8 border border-gray-600">
              <h3 className="mb-4 text-white">New Releases</h3>
              <div className="space-y-4">
                <p className="text-gray-200">
                  Discover the latest additions to the LOREWEAVER multiverse! From epic fantasy novels to gripping science fiction adventures, our newest titles are ready to transport you to worlds untold.
                </p>
                <div className="bg-[#5618c9] rounded-lg p-6 border border-purple-400">
                  <h4 className="text-white mb-2">Featured New Release</h4>
                  <p className="text-gray-100 mb-4 text-sm">
                    Experience our most recent publication - a journey through uncharted territories where magic and mystery intertwine. This title represents the cutting edge of LOREWEAVER storytelling.
                  </p>
                  <button 
                    onClick={() => {
                      navigate('/titles');
                      setTimeout(() => {
                        const element = document.querySelector('#new-releases');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 100);
                    }}
                    className="inline-block px-6 py-2 bg-[#3d0099] text-white rounded hover:bg-[#2e0073] transition-colors"
                  >
                    View All New Releases →
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Author */}
            <div className="bg-[#48454f] rounded-lg shadow-md p-8 border border-gray-600">
              <h3 className="mb-4 text-white">Featured Author</h3>
              <div className="flex gap-6 items-start">
                <div className="bg-gray-200 border-2 border-gray-300 rounded-lg w-32 h-32 flex-shrink-0"></div>
                <div className="flex-1 space-y-3">
                  <h4 className="text-white">Author Name</h4>
                  <p className="text-gray-200 text-sm">
                    Meet one of LOREWEAVER's talented storytellers whose imagination brings vivid worlds and unforgettable characters to life. Specializing in epic fantasy with a touch of dark mystery, this author has captivated readers with their unique narrative voice.
                  </p>
                  <p className="text-gray-300 text-sm italic">
                    Notable Works: Title One, Title Two, Title Three
                  </p>
                  <button 
                    onClick={() => {
                      navigate('/creators');
                      setTimeout(() => {
                        const element = document.querySelector('#our-authors');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 100);
                    }}
                    className="inline-block px-6 py-2 bg-[#3d0099] text-white rounded hover:bg-[#2e0073] transition-colors"
                  >
                    Meet Our Authors →
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Artist */}
            <div className="bg-[#48454f] rounded-lg shadow-md p-8 border border-gray-600">
              <h3 className="mb-4 text-white">Featured Artist</h3>
              <div className="flex gap-6 items-start">
                <div className="bg-gray-200 border-2 border-gray-300 rounded-lg w-32 h-32 flex-shrink-0"></div>
                <div className="flex-1 space-y-3">
                  <h4 className="text-white">Artist Name</h4>
                  <p className="text-gray-200 text-sm">
                    Discover the visual magic behind LOREWEAVER's stunning cover art and illustrations. This artist brings stories to life through breathtaking imagery that captures the essence of fantasy and wonder.
                  </p>
                  <p className="text-gray-300 text-sm italic">
                    Specialties: Cover Design, Character Illustration, Sequential Art
                  </p>
                  <button 
                    onClick={() => {
                      navigate('/creators');
                      setTimeout(() => {
                        const element = document.querySelector('#our-artists');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 100);
                    }}
                    className="inline-block px-6 py-2 bg-[#3d0099] text-white rounded hover:bg-[#2e0073] transition-colors"
                  >
                    Meet Our Artists →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Updates Section */}
        <section id="latest-updates">
          <h2 className="mb-6">Latest Updates</h2>
          <div className="bg-[#48454f] rounded-lg shadow-md p-8 border border-gray-600">
            <p className="text-gray-200">Latest updates will be displayed here.</p>
          </div>
        </section>

        {/* Mailing List Section - Only visible on mobile */}
        <section id="mailing-list" className="lg:hidden">
          <h2 className="mb-6">Join Our Mailing List</h2>
          <MailingListForm />
        </section>

        {/* LOREWEAVER Calendar Section */}
        <section id="calendar">
          <h2 className="mb-6 text-3xl font-bold">LOREWEAVER Calendar</h2>
          <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
            <LoreweaverCalendar />
          </div>
        </section>
      </div>
    </main>
  );
}