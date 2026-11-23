import { PageNavDropdown } from "./components/PageNavDropdown";
import { Calendar, Upload, Users, Music, BookOpen, Sparkles } from "lucide-react";

export default function Community() {
  // Define page sections for jump-to navigation
  const pageSections = [
    { label: "Community", id: "community" },
    { label: "Fan Art", id: "fan-art" },
    { label: "Fan Fiction", id: "fan-fiction" },
    { label: "Filk", id: "filk" },
    { label: "Fanthology", id: "fanthology" },
    { label: "Events", id: "events" },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 flex-1">
      {/* Page Navigation Dropdown - Floats over page below nav banner */}
      <PageNavDropdown items={pageSections} />

      {/* Full Width Content */}
      <div className="space-y-12">
        {/* Community Section */}
        <section id="community">
          <h1 className="mb-6">Welcome to the LOREWEAVER Community</h1>
          <div className="space-y-4 text-gray-700">
            <p>
              The LOREWEAVER community is a vibrant gathering of readers, writers, artists, and fans who share a passion for storytelling and world-building.
            </p>
            <p>
              Whether you're creating fan art, writing stories set in our worlds, composing music inspired by our tales, or simply connecting with fellow enthusiasts, this is your space to share, collaborate, and celebrate the stories we love.
            </p>
          </div>

          {/* Community Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="mb-0">Connect</h3>
              </div>
              <p className="text-sm text-gray-700">
                Join our Discord server and social media communities to connect with fellow fans and creators.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="mb-0">Create</h3>
              </div>
              <p className="text-sm text-gray-700">
                Share your fan creations, from art and fiction to music and crafts inspired by LOREWEAVER worlds.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="mb-0">Participate</h3>
              </div>
              <p className="text-sm text-gray-700">
                Attend community events, contests, and collaborative projects throughout the year.
              </p>
            </div>
          </div>
        </section>

        {/* Fan Art Section */}
        <section id="fan-art">
          <h2 className="mb-6">Fan Art</h2>
          <div className="space-y-4 text-gray-700 mb-8">
            <p>
              We love seeing our worlds and characters through your artistic vision! Share your LOREWEAVER-inspired artwork with the community.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200 mb-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="mb-2">Submit Your Art</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Share your fan art with us! Tag us on social media or submit through our community portal.
                </p>
                <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
                  Submission Guidelines →
                </a>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="mb-4">Fan Art Gallery Highlights</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gray-200 border-2 border-gray-300 rounded-lg aspect-square"></div>
                <div className="bg-gray-200 border-2 border-gray-300 rounded-lg aspect-square"></div>
                <div className="bg-gray-200 border-2 border-gray-300 rounded-lg aspect-square"></div>
              </div>
              <div className="mt-4 text-center">
                <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
                  View Full Gallery →
                </a>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="mb-2">Community Guidelines</h3>
            <p className="text-sm text-gray-700">
              All fan art submissions must follow our community guidelines. Please be respectful, credit other artists when applicable, and keep content appropriate for all ages. Fan works remain the property of their creators.
            </p>
          </div>
        </section>

        {/* Fan Fiction Section */}
        <section id="fan-fiction">
          <h2 className="mb-6">Fan Fiction</h2>
          <div className="space-y-4 text-gray-700 mb-8">
            <p>
              Expand the LOREWEAVER universe with your own stories! We encourage fans to explore our worlds through their creative writing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="mb-3">Writing Resources</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>World-building reference guides</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Character background information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Timeline and chronology resources</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Fan fiction writing tips and best practices</span>
                </li>
              </ul>
              <a href="#" className="inline-block mt-4 text-blue-600 hover:text-blue-700 transition-colors text-sm">
                Access Resources →
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="mb-3">Share Your Stories</h3>
              <p className="text-sm text-gray-700 mb-4">
                Post your fan fiction to our community archive or link your stories from Archive of Our Own, Wattpad, or your personal blog.
              </p>
              <div className="space-y-2">
                <a href="#" className="block text-blue-600 hover:text-blue-700 transition-colors text-sm">
                  Community Archive →
                </a>
                <a href="#" className="block text-blue-600 hover:text-blue-700 transition-colors text-sm">
                  Submit Your Story →
                </a>
                <a href="#" className="block text-blue-600 hover:text-blue-700 transition-colors text-sm">
                  Browse Fan Fiction →
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="mb-3">Featured Fan Fiction</h3>
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h4 className="text-sm mb-1">Story Title Here</h4>
                <p className="text-xs text-gray-600 mb-2">By FanAuthor123 | Genre: Adventure | Rating: PG</p>
                <p className="text-sm text-gray-700">
                  A brief excerpt or summary of the featured fan fiction story...
                </p>
                <a href="#" className="inline-block mt-2 text-blue-600 hover:text-blue-700 transition-colors text-xs">
                  Read More →
                </a>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h4 className="text-sm mb-1">Story Title Here</h4>
                <p className="text-xs text-gray-600 mb-2">By FanAuthor456 | Genre: Mystery | Rating: PG-13</p>
                <p className="text-sm text-gray-700">
                  A brief excerpt or summary of the featured fan fiction story...
                </p>
                <a href="#" className="inline-block mt-2 text-blue-600 hover:text-blue-700 transition-colors text-xs">
                  Read More →
                </a>
              </div>

              <div className="pb-4">
                <h4 className="text-sm mb-1">Story Title Here</h4>
                <p className="text-xs text-gray-600 mb-2">By FanAuthor789 | Genre: Romance | Rating: G</p>
                <p className="text-sm text-gray-700">
                  A brief excerpt or summary of the featured fan fiction story...
                </p>
                <a href="#" className="inline-block mt-2 text-blue-600 hover:text-blue-700 transition-colors text-xs">
                  Read More →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Filk Section */}
        <section id="filk">
          <h2 className="mb-6">Filk</h2>
          <div className="space-y-4 text-gray-700 mb-8">
            <p>
              Filk music—songs and ballads inspired by our stories and worlds—is a beloved tradition in the LOREWEAVER community.
            </p>
            <p>
              Whether you're writing original songs, creating parodies, or performing covers inspired by our tales, we'd love to hear your musical creations!
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200 mb-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Music className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2">What is Filk?</h3>
                <p className="text-sm text-gray-700">
                  Filk is a musical culture, genre, and community tied to science fiction, fantasy, and fandom. It includes original songs, parodies, and ballads that celebrate and expand upon the stories we love.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm mb-2">Share Your Filk</h4>
                <p className="text-xs text-gray-700 mb-3">
                  Upload your recordings, share lyrics, or link to your performances.
                </p>
                <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-xs">
                  Submit Your Music →
                </a>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm mb-2">Filk Events</h4>
                <p className="text-xs text-gray-700 mb-3">
                  Join our online filk circles and virtual concerts.
                </p>
                <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-xs">
                  Upcoming Events →
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="mb-4">Featured Filk</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="bg-purple-100 p-2 rounded">
                  <Music className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm mb-1">Song Title - Artist Name</h4>
                  <p className="text-xs text-gray-600">Inspired by [LOREWEAVER Title]</p>
                </div>
                <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-xs">
                  Listen
                </a>
              </div>

              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="bg-purple-100 p-2 rounded">
                  <Music className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm mb-1">Song Title - Artist Name</h4>
                  <p className="text-xs text-gray-600">Inspired by [LOREWEAVER Title]</p>
                </div>
                <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-xs">
                  Listen
                </a>
              </div>

              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="bg-purple-100 p-2 rounded">
                  <Music className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm mb-1">Song Title - Artist Name</h4>
                  <p className="text-xs text-gray-600">Inspired by [LOREWEAVER Title]</p>
                </div>
                <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-xs">
                  Listen
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Fanthology Section */}
        <section id="fanthology">
          <h2 className="mb-6">Fanthology</h2>
          <div className="space-y-4 text-gray-700 mb-8">
            <p>
              A fanthology is a special anthology created by and for fans, featuring the best community-submitted content. These curated collections celebrate the creativity and passion of the LOREWEAVER community.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200 mb-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-green-100 p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2">About Fanthologies</h3>
                <p className="text-sm text-gray-700">
                  Each year, we compile the best fan-created stories, art, and other content into official community fanthologies. Selected contributors receive a complimentary copy and are featured in our community spotlight.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="bg-gray-200 border-2 border-gray-300 rounded-lg aspect-[2/3] mb-3"></div>
                <h4 className="text-sm mb-1">Fanthology 2025</h4>
                <p className="text-xs text-gray-600 mb-2">Now Accepting Submissions</p>
                <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-xs">
                  Submit Your Work →
                </a>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="bg-gray-200 border-2 border-gray-300 rounded-lg aspect-[2/3] mb-3"></div>
                <h4 className="text-sm mb-1">Fanthology 2024</h4>
                <p className="text-xs text-gray-600 mb-2">Available Now</p>
                <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-xs">
                  Purchase Copy →
                </a>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="bg-gray-200 border-2 border-gray-300 rounded-lg aspect-[2/3] mb-3"></div>
                <h4 className="text-sm mb-1">Fanthology 2023</h4>
                <p className="text-xs text-gray-600 mb-2">Available Now</p>
                <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-xs">
                  Purchase Copy →
                </a>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="mb-2">Submission Information</h3>
            <p className="text-sm text-gray-700 mb-3">
              Submissions for the 2025 Fanthology are open until March 31st, 2026. We accept fan fiction (up to 5,000 words), fan art (high-resolution digital files), poetry, and essays.
            </p>
            <a href="#" className="text-green-700 hover:text-green-800 transition-colors text-sm">
              View Full Submission Guidelines →
            </a>
          </div>
        </section>

        {/* Events Section */}
        <section id="events">
          <h2 className="mb-6">Community Events</h2>
          <div className="space-y-4 text-gray-700 mb-8">
            <p>
              Join us for community events throughout the year, including virtual meetups, contests, collaborative projects, and special celebrations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 px-3 py-2 rounded text-center">
                  <div className="text-xs text-red-600">DEC</div>
                  <div className="text-red-600">15</div>
                </div>
                <div className="flex-1">
                  <h3 className="mb-1">Holiday Art Contest</h3>
                  <p className="text-xs text-gray-600">Online Event</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                Create holiday-themed art featuring LOREWEAVER characters and worlds. Prizes for top three entries!
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
                Learn More →
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 px-3 py-2 rounded text-center">
                  <div className="text-xs text-red-600">JAN</div>
                  <div className="text-red-600">20</div>
                </div>
                <div className="flex-1">
                  <h3 className="mb-1">Community Book Club</h3>
                  <p className="text-xs text-gray-600">Virtual Meeting</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                Monthly discussion of LOREWEAVER titles. This month: [Book Title]. Join us on Discord for lively conversation!
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
                Join Discussion →
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 px-3 py-2 rounded text-center">
                  <div className="text-xs text-red-600">FEB</div>
                  <div className="text-red-600">14</div>
                </div>
                <div className="flex-1">
                  <h3 className="mb-1">Flash Fiction Challenge</h3>
                  <p className="text-xs text-gray-600">Online Event</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                Write a 500-word story based on a surprise prompt. All entries will be featured on our blog!
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
                Register Now →
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 px-3 py-2 rounded text-center">
                  <div className="text-xs text-red-600">MAR</div>
                  <div className="text-red-600">10</div>
                </div>
                <div className="flex-1">
                  <h3 className="mb-1">Virtual Convention Panel</h3>
                  <p className="text-xs text-gray-600">Live Stream</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                Join LOREWEAVER authors and editors for a live Q&A and behind-the-scenes look at upcoming releases.
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
                RSVP →
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="mb-4">Event Calendar</h3>
            <p className="text-sm text-gray-700 mb-4">
              View our complete event calendar for all upcoming community activities, deadlines, and special occasions.
            </p>
            <a href="#" className="inline-block text-blue-600 hover:text-blue-700 transition-colors text-sm">
              View Full Calendar →
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}