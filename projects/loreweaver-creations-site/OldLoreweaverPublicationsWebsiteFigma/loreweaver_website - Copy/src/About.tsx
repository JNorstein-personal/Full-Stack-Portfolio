import { PageNavDropdown } from "./components/PageNavDropdown";

export default function About() {
  // Define page sections for jump-to navigation
  const pageSections = [
    { label: "Our Story", id: "our-story" },
    { label: "Contact", id: "contact" },
    { label: "FAQ", id: "faq" },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 flex-1">
      {/* Page Navigation Dropdown - Between header and content on mobile, floating on desktop */}
      <div className="mb-6 flex justify-end lg:mb-0 lg:absolute lg:top-0 lg:right-0 lg:z-10">
        <PageNavDropdown
  items={pageSections}
  onSelect={(id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }}
/>
      </div>

      {/* Full Width Content */}
      <div className="space-y-12">
        {/* Our Story Section */}
        <section id="our-story">
          <h1 className="mb-6">Our Story</h1>
          <div className="space-y-4 text-gray-700">
            <p>
              Welcome to the story of LOREWEAVER Publications - a journey from imagination to reality.
            </p>
            <p>
              What began as one person's vision has grown into a platform for diverse voices and creative storytelling. Our mission is to weave together tales that transport readers to new worlds, challenge perspectives, and celebrate the power of narrative.
            </p>
            <p>
              We believe in the magic of stories - whether they're told through novels, comics, podcasts, or interactive media. Every format has its place in our ever-expanding universe, and we're committed to exploring them all.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact">
          <h2 className="mb-6">Contact</h2>
          <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
            <div className="space-y-6">
              <div>
                <h3 className="mb-2">General Inquiries</h3>
                <p className="text-gray-700">
                  For general questions about LOREWEAVER Publications, please reach out to us at:
                </p>
                <a href="mailto:info@loreweaverpub.com" className="text-blue-600 hover:text-blue-700 transition-colors">
                  info@loreweaverpub.com
                </a>
              </div>
              
              <div>
                <h3 className="mb-2">Submissions</h3>
                <p className="text-gray-700">
                  Interested in submitting your work? Contact our editorial team at:
                </p>
                <a href="mailto:submissions@loreweaverpub.com" className="text-blue-600 hover:text-blue-700 transition-colors">
                  submissions@loreweaverpub.com
                </a>
              </div>

              <div>
                <h3 className="mb-2">Press & Media</h3>
                <p className="text-gray-700">
                  For press inquiries and media requests:
                </p>
                <a href="mailto:press@loreweaverpub.com" className="text-blue-600 hover:text-blue-700 transition-colors">
                  press@loreweaverpub.com
                </a>
              </div>

              <div>
                <h3 className="mb-2">Social Media</h3>
                <p className="text-gray-700">
                  Connect with us on Instagram, Bluesky, and TikTok to stay updated on our latest releases and community events.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq">
          <h2 className="mb-6">FAQ</h2>
          <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
            <div className="space-y-6">
              <div>
                <h3 className="mb-2">What is LOREWEAVER Publications?</h3>
                <p className="text-gray-700">
                  LOREWEAVER Publications is a small press publishing house dedicated to bringing unique voices and stories to readers who love fantasy, science fiction, and related genres. We publish novels, short stories, webcomics, and more.
                </p>
              </div>

              <div>
                <h3 className="mb-2">Do you accept submissions?</h3>
                <p className="text-gray-700">
                  Yes! We welcome submissions from authors and artists. Please check our submissions guidelines and send your work to submissions@loreweaverpub.com.
                </p>
              </div>

              <div>
                <h3 className="mb-2">How can I support LOREWEAVER?</h3>
                <p className="text-gray-700">
                  You can support us by purchasing our titles, joining our mailing list, engaging with our community, sharing our content on social media, and spreading the word about our authors and artists.
                </p>
              </div>

              <div>
                <h3 className="mb-2">What is the LOREWEAVER multiverse?</h3>
                <p className="text-gray-700">
                  The LOREWEAVER multiverse is our shared story universe where different tales, worlds, and characters can intersect. Learn more on our Wiki and through our published titles.
                </p>
              </div>

              <div>
                <h3 className="mb-2">How can I contribute to the LOREWEAVER FANTHOLOGY?</h3>
                <p className="text-gray-700">
                  The LOREWEAVER FANTHOLOGY is our curated collection of fan-written stories. Check our Community section for guidelines and submission details.
                </p>
              </div>

              <div>
                <h3 className="mb-2">Where can I listen to THE UNESCAPIST PODCAST?</h3>
                <p className="text-gray-700">
                  Our monthly podcast is available on all major podcast platforms. Visit our Podcast page for the latest episodes and subscription links.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
