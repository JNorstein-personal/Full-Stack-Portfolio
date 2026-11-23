import { MailingListForm } from "./components/MailingListForm";
import { LoreweaverCalendar } from "./components/LoreweaverCalendar";
import { PageNavDropdown } from "./components/PageNavDropdown";

export default function Home() {
  // Define page sections for jump-to navigation
  const pageSections = [
    {
      label: "Welcome to LOREWEAVER Publications",
      id: "welcome",
    },
    { label: "Featured", id: "featured" },
    { label: "Latest Updates", id: "latest-updates" },
    { label: "Join Our Mailing List", id: "mailing-list" },
    { label: "LOREWEAVER Calendar", id: "calendar" },
  ];

  // Smooth scroll to section by id
  const handleJumpTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    // If you have a fixed header, offset a bit (optional)
    const headerOffset = 80; // tweak as needed
    const rect = el.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const targetY = rect.top + scrollTop - headerOffset;

    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 flex-1">
      {/* Page Navigation Dropdown - Between header and content on mobile, floating on desktop */}
      <div className="mb-6 flex justify-end lg:mb-0 lg:absolute lg:top-0 lg:right-0 lg:z-10">
        {/* 👇 Pass onSelect so dropdown can trigger scrolling */}
        <PageNavDropdown items={pageSections} onSelect={handleJumpTo} />
      </div>

      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        {/* Left Column - Only visible on desktop */}
        <div className="hidden lg:block lg:col-span-1 space-y-6">
          {/* Empty Image Box */}
          <div className="bg-gray-200 border-2 border-gray-300 rounded-lg aspect-square"></div>

          {/* Mailing List Form */}
          <MailingListForm />
        </div>

        {/* Right Column - Full width on mobile, 3/4 width on desktop */}
        {/* Give the main welcome area the 'welcome' id */}
        <section className="lg:col-span-3 relative" id="welcome">
          {/* Mobile: Image left of heading */}
          <div className="flex items-start gap-4 mb-6 lg:hidden">
            <div className="bg-gray-200 border-2 border-gray-300 rounded-lg w-24 h-24 flex-shrink-0"></div>
            <h1 className="mb-0">
              Welcome to LOREWEAVER Publications!
            </h1>
          </div>

          {/* Desktop: Heading only */}
          <h1 className="hidden lg:block mb-6">
            Welcome to LOREWEAVER Publications!
          </h1>

          <div className="space-y-4 text-gray-700">
            <p>
              Wander roads untraveled, with LOREWEAVER
              PUBLICATIONS!
            </p>

            <p>
              Stay tuned for titles and diverse content,
              including:
            </p>

            <ul className="list-none space-y-3 ml-4">
              <li>
                <span className="inline-block mr-2">-</span>
                <strong>Novels</strong> - We are a small press
                publishing house, after all, meaning we'll be
                showcasing more than just the one title from
                more than one author, eventually!
              </li>
              <li>
                <span className="inline-block mr-2">-</span>
                <strong>Short Stories</strong> - see above
              </li>
              <li>
                <span className="inline-block mr-2">-</span>
                <strong>
                  Webcomics & other Sequential Media
                </strong>{" "}
                - because there's more than one way to tell a
                story!
              </li>
              <li>
                <span className="inline-block mr-2">-</span>
                <strong>Audiobooks</strong>
              </li>
              <li>
                <span className="inline-block mr-2">-</span>
                <strong>RAISING THE TOWER</strong> - a weekly
                blog, chronicling the ascent of the LOREWEAVER
                brand, from one man's hairbrained idea, to
                (eventually) Eternal God-Emperor of all small
                press publishing moguls!
              </li>
              <li>
                <span className="inline-block mr-2">-</span>
                <strong>THE UNESCAPIST PODCAST</strong> - A
                monthly podcast, exploring the best of creative
                content for fans of Fantasy and Science Fiction,
                the myriad of related sub- and hybrid genres,
                the craft of writing, and managing a lifestyle
                of creative polymathy (get your mind out of the
                gutter!), among other things.
              </li>
              <li>
                <span className="inline-block mr-2">-</span>
                <strong>LOREWEAVERPEDIA</strong> - a routinely
                updated lore wiki detailing the fabric of the
                LOREWEAVER multiverse.
              </li>
              <li>
                <span className="inline-block mr-2">-</span>
                <strong>LOREWEAVER FANTHOLOGY</strong> - a
                fan-written, curated anthology of multiversal
                adventures, set in the infinite possibilities of
                the LOREWEAVER universe.
              </li>
            </ul>

            <p>...And more to come - stay tuned!</p>
          </div>
        </section>
      </div>

      {/* Single Column Sections Below */}
      <div className="mt-16 space-y-12">
        {/* Featured Section */}
        <section id="featured">
          <h2 className="mb-6">Featured</h2>
          <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
            <p className="text-gray-600">
              Featured content will be displayed here.
            </p>
          </div>
        </section>

        {/* Latest Updates Section */}
        <section id="latest-updates">
          <h2 className="mb-6">Latest Updates</h2>
          <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
            <p className="text-gray-600">
              Latest updates will be displayed here.
            </p>
          </div>
        </section>

        {/* Mailing List Section - Only visible on mobile */}
        <section id="mailing-list" className="lg:hidden">
          <h2 className="mb-6">Join Our Mailing List</h2>
          <MailingListForm />
        </section>

        {/* LOREWEAVER Calendar Section */}
        <section id="calendar">
          <h2 className="mb-6">LOREWEAVER Calendar</h2>
          <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
            <LoreweaverCalendar />
          </div>
        </section>
      </div>
    </main>
  );
}