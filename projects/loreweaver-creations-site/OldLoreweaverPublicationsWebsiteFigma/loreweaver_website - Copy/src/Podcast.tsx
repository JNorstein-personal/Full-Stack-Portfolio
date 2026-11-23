import { PageNavDropdown } from "./components/PageNavDropdown";
import { Mic, Play, Calendar, Clock, Download, Headphones, Rss } from "lucide-react";

export default function Podcast() {
  // Define page sections for jump-to navigation
  const pageSections = [
    { label: "Latest Episodes", id: "latest-episodes" },
    { label: "Subscribe", id: "subscribe" },
    { label: "Archive", id: "archive" },
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
        {/* Latest Episodes Section */}
        <section id="latest-episodes">
          <h1 className="mb-6">LOREWEAVER Podcast</h1>
          <div className="space-y-4 text-gray-700 mb-8">
            <p>
              Welcome to the LOREWEAVER Podcast, where we explore the art of storytelling, interview creators, and dive deep into the worlds we create. Join us for conversations about writing, world-building, and the creative process.
            </p>
          </div>

          {/* Featured Episode */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-lg border border-blue-200 overflow-hidden mb-8">
            <div className="grid md:grid-cols-5 gap-6">
              <div className="md:col-span-2 bg-gray-200 border-r-2 border-gray-300 min-h-[300px] flex items-center justify-center">
                <div className="bg-purple-600 rounded-full p-8">
                  <Mic className="w-16 h-16 text-white" />
                </div>
              </div>
              <div className="md:col-span-3 p-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs">Latest Episode</span>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">Episode 47</span>
                </div>
                <h2 className="mb-3">Featured Episode Title: An In-Depth Conversation</h2>
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>November 15, 2025</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>52 minutes</span>
                  </div>
                </div>
                <p className="text-gray-700 mb-6">
                  In this week's episode, we sit down with a special guest to discuss their creative process, inspirations, and upcoming projects. This conversation explores themes of world-building, character development, and the challenges of bringing fantastical stories to life.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    <Play className="w-5 h-5" />
                    Play Episode
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download className="w-5 h-5" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Episodes List */}
          <h2 className="mb-6">Recent Episodes</h2>
          <div className="space-y-4">
            {[
              { num: 46, title: "World-Building 101: Creating Believable Fantasy Worlds", duration: "45 min", date: "November 8, 2025" },
              { num: 45, title: "Author Interview: Behind the Scenes of a Bestseller", duration: "58 min", date: "November 1, 2025" },
              { num: 44, title: "The Art of Character Development", duration: "41 min", date: "October 25, 2025" },
              { num: 43, title: "Writing Dialogue That Sings", duration: "38 min", date: "October 18, 2025" },
              { num: 42, title: "Fan Creations Showcase: Community Spotlight", duration: "50 min", date: "October 11, 2025" },
            ].map((episode) => (
              <div key={episode.num} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="bg-gray-200 border-2 border-gray-300 rounded w-20 h-20 flex-shrink-0 flex items-center justify-center">
                    <div className="bg-purple-600 rounded-full p-3">
                      <Mic className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Episode {episode.num}</span>
                    </div>
                    <h3 className="mb-2">{episode.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{episode.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{episode.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                      <Play className="w-4 h-4" />
                      Play
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <a href="#archive" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              View All Episodes
            </a>
          </div>
        </section>

        {/* Subscribe Section */}
        <section id="subscribe">
          <h2 className="mb-6">Subscribe to the Podcast</h2>
          <div className="space-y-4 text-gray-700 mb-8">
            <p>
              Never miss an episode! Subscribe to the LOREWEAVER Podcast on your favorite platform and get new episodes delivered automatically.
            </p>
          </div>

          {/* Subscribe Platforms */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <a href="#" className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow group">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <Headphones className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="mb-0">Apple Podcasts</h3>
              </div>
              <p className="text-sm text-gray-700">
                Listen and subscribe on Apple Podcasts for iOS and Mac.
              </p>
            </a>

            <a href="#" className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow group">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
                  <Headphones className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="mb-0">Spotify</h3>
              </div>
              <p className="text-sm text-gray-700">
                Stream episodes on Spotify and add to your library.
              </p>
            </a>

            <a href="#" className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow group">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Headphones className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="mb-0">Google Podcasts</h3>
              </div>
              <p className="text-sm text-gray-700">
                Subscribe and listen on Google Podcasts for Android.
              </p>
            </a>

            <a href="#" className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow group">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-orange-100 p-3 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <Headphones className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="mb-0">Overcast</h3>
              </div>
              <p className="text-sm text-gray-700">
                Subscribe on Overcast with smart speed features.
              </p>
            </a>

            <a href="#" className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow group">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-red-100 p-3 rounded-lg group-hover:bg-red-200 transition-colors">
                  <Headphones className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="mb-0">Pocket Casts</h3>
              </div>
              <p className="text-sm text-gray-700">
                Listen on Pocket Casts across all your devices.
              </p>
            </a>

            <a href="#" className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow group">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-gray-100 p-3 rounded-lg group-hover:bg-gray-200 transition-colors">
                  <Rss className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="mb-0">RSS Feed</h3>
              </div>
              <p className="text-sm text-gray-700">
                Use our RSS feed with your preferred podcast app.
              </p>
            </a>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-md border border-purple-200 p-8">
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Mic className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2">Get Episode Updates</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Sign up for our newsletter to receive notifications about new podcast episodes, show notes, and exclusive bonus content.
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Archive Section */}
        <section id="archive">
          <h2 className="mb-6">Podcast Archive</h2>
          <div className="space-y-4 text-gray-700 mb-8">
            <p>
              Browse our complete collection of podcast episodes. From our very first episode to the latest conversations, explore the full archive of LOREWEAVER Podcast content.
            </p>
          </div>

          {/* Filter Options */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
            <h3 className="mb-4">Filter Episodes</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Search Episodes</label>
                <input
                  type="text"
                  placeholder="Search by title or guest..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Category</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Categories</option>
                  <option>Author Interviews</option>
                  <option>Writing Tips</option>
                  <option>World-Building</option>
                  <option>Community</option>
                  <option>Behind the Scenes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Year</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Years</option>
                  <option>2025</option>
                  <option>2024</option>
                  <option>2023</option>
                  <option>2022</option>
                </select>
              </div>
            </div>
          </div>

          {/* Archive by Season */}
          <div className="space-y-6">
            {/* Season 3 - 2025 */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
                <h3 className="mb-1 text-white">Season 3 (2025)</h3>
                <p className="text-sm text-purple-100">Episodes 37-47 • Currently Airing</p>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {Array.from({ length: 11 }, (_, i) => 47 - i).map((episodeNum) => (
                    <div key={episodeNum} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-gray-600">Episode {episodeNum}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-xs text-gray-500">November {20 - (47 - episodeNum)}, 2025</span>
                        </div>
                        <h4 className="text-sm">Episode Title: Topic and Guest Name</h4>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button className="text-purple-600 hover:text-purple-700 transition-colors">
                          <Play className="w-5 h-5" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-700 transition-colors">
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Season 2 - 2024 */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                <h3 className="mb-1 text-white">Season 2 (2024)</h3>
                <p className="text-sm text-blue-100">Episodes 20-36 • 17 Episodes</p>
              </div>
              <div className="p-6">
                <div className="text-center text-gray-600 py-4">
                  <p className="text-sm mb-4">17 episodes from our second season</p>
                  <button className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
                    View Season 2 Episodes →
                  </button>
                </div>
              </div>
            </div>

            {/* Season 1 - 2022-2023 */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
                <h3 className="mb-1 text-white">Season 1 (2022-2023)</h3>
                <p className="text-sm text-indigo-100">Episodes 1-19 • 19 Episodes</p>
              </div>
              <div className="p-6">
                <div className="text-center text-gray-600 py-4">
                  <p className="text-sm mb-4">Where it all began - our first 19 episodes</p>
                  <button className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
                    View Season 1 Episodes →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="mb-4 text-center">Podcast Statistics</h3>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl text-blue-600 mb-1">47</div>
                <div className="text-sm text-gray-600">Total Episodes</div>
              </div>
              <div>
                <div className="text-3xl text-purple-600 mb-1">3</div>
                <div className="text-sm text-gray-600">Seasons</div>
              </div>
              <div>
                <div className="text-3xl text-green-600 mb-1">45</div>
                <div className="text-sm text-gray-600">Avg. Length (min)</div>
              </div>
              <div>
                <div className="text-3xl text-orange-600 mb-1">35+</div>
                <div className="text-sm text-gray-600">Guest Interviews</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
