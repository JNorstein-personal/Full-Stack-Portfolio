import { PageNavDropdown } from "./components/PageNavDropdown";

export default function Creators() {
  // Define page sections for jump-to navigation
  const pageSections = [
    { label: "Meet the Team", id: "meet-the-team" },
    { label: "Our Authors", id: "our-authors" },
    { label: "Our Artists", id: "our-artists" },
    { label: "Join Us", id: "join-us" },
    { label: "Creator Resources", id: "creator-resources" },
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
        {/* Meet the Team Section */}
        <section id="meet-the-team">
          <h1 className="mb-6">Meet the Team</h1>
          <div className="space-y-4 text-gray-700">
            <p>
              Behind every great story is a team of passionate creators, editors, and visionaries working together to bring worlds to life.
            </p>
            <p>
              At LOREWEAVER Publications, we're proud to collaborate with talented authors, artists, editors, and creative professionals who share our commitment to exceptional storytelling.
            </p>
          </div>

          {/* Team Member Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="bg-gray-200 border-2 border-gray-300 rounded-lg aspect-square mb-4"></div>
              <h3 className="mb-2">Team Member Name</h3>
              <p className="text-sm text-gray-600 mb-2">Founder & Publisher</p>
              <p className="text-sm text-gray-700">
                Brief bio about this team member and their role at LOREWEAVER Publications.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="bg-gray-200 border-2 border-gray-300 rounded-lg aspect-square mb-4"></div>
              <h3 className="mb-2">Team Member Name</h3>
              <p className="text-sm text-gray-600 mb-2">Editor-in-Chief</p>
              <p className="text-sm text-gray-700">
                Brief bio about this team member and their role at LOREWEAVER Publications.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="bg-gray-200 border-2 border-gray-300 rounded-lg aspect-square mb-4"></div>
              <h3 className="mb-2">Team Member Name</h3>
              <p className="text-sm text-gray-600 mb-2">Art Director</p>
              <p className="text-sm text-gray-700">
                Brief bio about this team member and their role at LOREWEAVER Publications.
              </p>
            </div>
          </div>
        </section>

        {/* Our Authors Section */}
        <section id="our-authors">
          <h2 className="mb-6">Our Authors</h2>
          <div className="space-y-4 text-gray-700 mb-8">
            <p>
              Our authors are storytellers, world-builders, and dreamers who craft narratives that transport readers to new realms.
            </p>
          </div>

          {/* Author Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex gap-4">
                <div className="bg-gray-200 border-2 border-gray-300 rounded-lg w-24 h-24 flex-shrink-0"></div>
                <div className="flex-1">
                  <h3 className="mb-2">Author Name</h3>
                  <p className="text-sm text-gray-600 mb-2">Genre Specialization</p>
                  <p className="text-sm text-gray-700">
                    Brief bio and notable works by this author.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex gap-4">
                <div className="bg-gray-200 border-2 border-gray-300 rounded-lg w-24 h-24 flex-shrink-0"></div>
                <div className="flex-1">
                  <h3 className="mb-2">Author Name</h3>
                  <p className="text-sm text-gray-600 mb-2">Genre Specialization</p>
                  <p className="text-sm text-gray-700">
                    Brief bio and notable works by this author.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex gap-4">
                <div className="bg-gray-200 border-2 border-gray-300 rounded-lg w-24 h-24 flex-shrink-0"></div>
                <div className="flex-1">
                  <h3 className="mb-2">Author Name</h3>
                  <p className="text-sm text-gray-600 mb-2">Genre Specialization</p>
                  <p className="text-sm text-gray-700">
                    Brief bio and notable works by this author.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex gap-4">
                <div className="bg-gray-200 border-2 border-gray-300 rounded-lg w-24 h-24 flex-shrink-0"></div>
                <div className="flex-1">
                  <h3 className="mb-2">Author Name</h3>
                  <p className="text-sm text-gray-600 mb-2">Genre Specialization</p>
                  <p className="text-sm text-gray-700">
                    Brief bio and notable works by this author.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Artists Section */}
        <section id="our-artists">
          <h2 className="mb-6">Our Artists</h2>
          <div className="space-y-4 text-gray-700 mb-8">
            <p>
              Our artists bring stories to life through stunning visuals, cover designs, and sequential art that captivate the imagination.
            </p>
          </div>

          {/* Artist Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="bg-gray-200 border-2 border-gray-300 rounded-lg aspect-square mb-4"></div>
              <h3 className="mb-2">Artist Name</h3>
              <p className="text-sm text-gray-600 mb-2">Illustration & Cover Design</p>
              <p className="text-sm text-gray-700">
                Portfolio highlights and artistic style.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="bg-gray-200 border-2 border-gray-300 rounded-lg aspect-square mb-4"></div>
              <h3 className="mb-2">Artist Name</h3>
              <p className="text-sm text-gray-600 mb-2">Sequential Art & Comics</p>
              <p className="text-sm text-gray-700">
                Portfolio highlights and artistic style.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="bg-gray-200 border-2 border-gray-300 rounded-lg aspect-square mb-4"></div>
              <h3 className="mb-2">Artist Name</h3>
              <p className="text-sm text-gray-600 mb-2">Character Design</p>
              <p className="text-sm text-gray-700">
                Portfolio highlights and artistic style.
              </p>
            </div>
          </div>
        </section>

        {/* Join Us Section */}
        <section id="join-us">
          <h2 className="mb-6">Join Us</h2>
          <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
            <div className="space-y-6">
              <p className="text-gray-700">
                Are you a creator looking for a home for your work? LOREWEAVER Publications is always seeking talented authors, artists, and creative professionals to join our growing family.
              </p>

              <div>
                <h3 className="mb-2">We're Looking For:</h3>
                <ul className="list-none space-y-2 ml-4 text-gray-700">
                  <li><span className="inline-block mr-2">•</span>Authors of fantasy, science fiction, and related genres</li>
                  <li><span className="inline-block mr-2">•</span>Illustrators and cover artists</li>
                  <li><span className="inline-block mr-2">•</span>Comic artists and sequential storytellers</li>
                  <li><span className="inline-block mr-2">•</span>Editors and proofreaders</li>
                  <li><span className="inline-block mr-2">•</span>Marketing and social media specialists</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2">How to Apply</h3>
                <p className="text-gray-700 mb-4">
                  Please send your portfolio, resume, and a brief introduction to:
                </p>
                <a href="mailto:join@loreweaverpub.com" className="text-blue-600 hover:text-blue-700 transition-colors">
                  join@loreweaverpub.com
                </a>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> We review all applications carefully. Due to the volume of submissions, please allow 4-6 weeks for a response.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Creator Resources Section */}
        <section id="creator-resources">
          <h2 className="mb-6">Creator Resources</h2>
          <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
            <div className="space-y-6">
              <p className="text-gray-700">
                Resources and guidelines for LOREWEAVER creators to help you succeed.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="mb-3">Submission Guidelines</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Detailed guidelines for submitting your work to LOREWEAVER Publications.
                  </p>
                  <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
                    View Guidelines →
                  </a>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="mb-3">Style Guide</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Our editorial style guide and formatting requirements.
                  </p>
                  <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
                    Download PDF →
                  </a>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="mb-3">Contract Templates</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Sample contracts and agreements for creators.
                  </p>
                  <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
                    View Templates →
                  </a>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="mb-3">Marketing Toolkit</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Resources to help promote your work and build your audience.
                  </p>
                  <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
                    Access Toolkit →
                  </a>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="mb-3">Creator Community</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Join our private Discord server for LOREWEAVER creators.
                  </p>
                  <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
                    Join Discord →
                  </a>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="mb-3">FAQ for Creators</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Frequently asked questions about working with LOREWEAVER.
                  </p>
                  <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
                    Read FAQ →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
