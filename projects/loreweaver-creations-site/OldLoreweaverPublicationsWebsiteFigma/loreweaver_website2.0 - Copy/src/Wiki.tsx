import { PageNavDropdown } from "./components/PageNavDropdown";
import { BookOpen, Search, Edit, Users, Map, Sparkles, Globe, Book, Sword, Crown } from "lucide-react";

export default function Wiki() {
  // Define page sections for jump-to navigation
  const pageSections = [
    { label: "Browse", id: "browse" },
    { label: "Search", id: "search" },
    { label: "Contribute", id: "contribute" },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 flex-1">
      {/* Page Navigation Dropdown - Floats over page below nav banner */}
      <PageNavDropdown items={pageSections} />

      {/* Full Width Content */}
      <div className="space-y-12">
        {/* Browse Section */}
        <section id="browse">
          <h1 className="mb-6">LOREWEAVER Wiki</h1>
          <div className="space-y-4 text-gray-700 mb-8">
            <p>
              Welcome to the LOREWEAVER Wiki, your comprehensive resource for exploring the worlds, characters, lore, and histories within the LOREWEAVER universe. This community-maintained encyclopedia grows with each new story and contribution.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 text-center">
              <div className="text-2xl text-blue-600 mb-1">1,247</div>
              <div className="text-xs text-gray-600">Total Articles</div>
            </div>
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 text-center">
              <div className="text-2xl text-purple-600 mb-1">342</div>
              <div className="text-xs text-gray-600">Active Contributors</div>
            </div>
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 text-center">
              <div className="text-2xl text-green-600 mb-1">89</div>
              <div className="text-xs text-gray-600">Worlds & Realms</div>
            </div>
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 text-center">
              <div className="text-2xl text-orange-600 mb-1">523</div>
              <div className="text-xs text-gray-600">Character Entries</div>
            </div>
          </div>

          {/* Browse by Category */}
          <h2 className="mb-6">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <a href="#" className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow group">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="mb-0">Worlds & Realms</h3>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                Explore the diverse worlds, realms, and dimensions of the LOREWEAVER universe.
              </p>
              <div className="text-xs text-gray-600">89 articles</div>
            </a>

            <a href="#" className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow group">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="mb-0">Characters</h3>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                Detailed profiles of heroes, villains, and everyone in between.
              </p>
              <div className="text-xs text-gray-600">523 articles</div>
            </a>

            <a href="#" className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow group">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
                  <Map className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="mb-0">Locations</h3>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                Cities, landmarks, and places of significance across the multiverse.
              </p>
              <div className="text-xs text-gray-600">187 articles</div>
            </a>

            <a href="#" className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow group">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 p-3 rounded-lg group-hover:bg-red-200 transition-colors">
                  <Book className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="mb-0">Stories & Books</h3>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                Information about published titles, story arcs, and series.
              </p>
              <div className="text-xs text-gray-600">156 articles</div>
            </a>

            <a href="#" className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow group">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-orange-100 p-3 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <Sparkles className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="mb-0">Magic & Powers</h3>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                Magic systems, abilities, and supernatural phenomena.
              </p>
              <div className="text-xs text-gray-600">94 articles</div>
            </a>

            <a href="#" className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow group">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-indigo-100 p-3 rounded-lg group-hover:bg-indigo-200 transition-colors">
                  <Crown className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="mb-0">Organizations & Factions</h3>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                Groups, guilds, kingdoms, and political entities.
              </p>
              <div className="text-xs text-gray-600">73 articles</div>
            </a>

            <a href="#" className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow group">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-yellow-100 p-3 rounded-lg group-hover:bg-yellow-200 transition-colors">
                  <Sword className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="mb-0">Items & Artifacts</h3>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                Legendary weapons, magical items, and important objects.
              </p>
              <div className="text-xs text-gray-600">61 articles</div>
            </a>

            <a href="#" className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow group">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-pink-100 p-3 rounded-lg group-hover:bg-pink-200 transition-colors">
                  <BookOpen className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="mb-0">Lore & History</h3>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                Historical events, timelines, and backstory information.
              </p>
              <div className="text-xs text-gray-600">164 articles</div>
            </a>

            <a href="#" className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow group">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-teal-100 p-3 rounded-lg group-hover:bg-teal-200 transition-colors">
                  <Users className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="mb-0">Species & Races</h3>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                Information about different races, species, and beings.
              </p>
              <div className="text-xs text-gray-600">45 articles</div>
            </a>
          </div>

          {/* Featured Articles */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-md border border-blue-200 p-8 mb-8">
            <h2 className="mb-6">Featured Articles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="bg-gray-200 border-2 border-gray-300 rounded-lg h-32 mb-4"></div>
                <h3 className="mb-2">The Realm of Shadows</h3>
                <p className="text-sm text-gray-700 mb-3">
                  An in-depth exploration of one of the most mysterious dimensions in the LOREWEAVER universe, including its history, inhabitants, and significance to the overarching narrative.
                </p>
                <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
                  Read Article →
                </a>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="bg-gray-200 border-2 border-gray-300 rounded-lg h-32 mb-4"></div>
                <h3 className="mb-2">The Ancient Prophecy</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Discover the origins and interpretations of the prophecy that shapes the destiny of countless characters across multiple LOREWEAVER stories and series.
                </p>
                <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
                  Read Article →
                </a>
              </div>
            </div>
          </div>

          {/* Recent Updates */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="mb-4">Recently Updated Articles</h3>
            <div className="space-y-3">
              {[
                { title: "Character Name - Major Hero", category: "Characters", time: "2 hours ago" },
                { title: "The Crystal Citadel", category: "Locations", time: "5 hours ago" },
                { title: "War of the Five Kingdoms", category: "Lore & History", time: "1 day ago" },
                { title: "Elemental Magic System", category: "Magic & Powers", time: "2 days ago" },
                { title: "The Shadow Guild", category: "Organizations", time: "3 days ago" },
              ].map((article, index) => (
                <a
                  key={index}
                  href="#"
                  className="flex items-center justify-between py-3 px-4 hover:bg-blue-50 rounded transition-colors group"
                >
                  <div className="flex-1">
                    <h4 className="text-sm mb-1 group-hover:text-blue-600">{article.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span>{article.category}</span>
                      <span>•</span>
                      <span>Updated {article.time}</span>
                    </div>
                  </div>
                  <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <BookOpen className="w-4 h-4" />
                  </div>
                </a>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 text-center">
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
                View All Recent Changes →
              </a>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section id="search">
          <h2 className="mb-6">Search the Wiki</h2>
          <div className="space-y-4 text-gray-700 mb-8">
            <p>
              Find exactly what you're looking for with our powerful search tools. Search by article title, category, or content to discover information across the entire wiki.
            </p>
          </div>

          {/* Advanced Search */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="mb-0">Advanced Search</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Search Terms</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter keywords, character names, locations, etc."
                    className="w-full pl-12 pr-4 py-3 bg-[#312d39] text-white border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Category Filter</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>All Categories</option>
                    <option>Worlds & Realms</option>
                    <option>Characters</option>
                    <option>Locations</option>
                    <option>Stories & Books</option>
                    <option>Magic & Powers</option>
                    <option>Organizations & Factions</option>
                    <option>Items & Artifacts</option>
                    <option>Lore & History</option>
                    <option>Species & Races</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Sort By</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Relevance</option>
                    <option>Most Recent</option>
                    <option>Alphabetical (A-Z)</option>
                    <option>Alphabetical (Z-A)</option>
                    <option>Most Popular</option>
                    <option>Recently Updated</option>
                  </select>
                </div>
              </div>

              <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Search Wiki
              </button>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
            <h3 className="mb-4">Popular Searches</h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Main Characters",
                "Magic Systems",
                "World Maps",
                "Timeline",
                "Prophecies",
                "Ancient Artifacts",
                "Legendary Weapons",
                "Royal Families",
                "Major Battles",
                "Creation Myths",
                "Dimensional Travel",
                "Forbidden Knowledge",
              ].map((tag, index) => (
                <a
                  key={index}
                  href="#"
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-blue-100 hover:text-blue-700 transition-colors"
                >
                  {tag}
                </a>
              ))}
            </div>
          </div>

          {/* Browse Alphabetically */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="mb-4">Browse Alphabetically</h3>
            <p className="text-sm text-gray-700 mb-4">
              Explore all wiki articles organized by their first letter.
            </p>
            <div className="flex flex-wrap gap-2">
              {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
                <a
                  key={letter}
                  href="#"
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-700 rounded hover:bg-blue-600 hover:text-white transition-colors"
                >
                  {letter}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Contribute Section */}
        <section id="contribute">
          <h2 className="mb-6">Contribute to the Wiki</h2>
          <div className="space-y-4 text-gray-700 mb-8">
            <p>
              The LOREWEAVER Wiki is a community effort! Whether you're correcting a typo, adding missing information, or creating entirely new articles, your contributions help make this resource better for everyone.
            </p>
          </div>

          {/* Ways to Contribute */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="bg-green-100 p-3 rounded-lg inline-block mb-4">
                <Edit className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="mb-3">Edit Existing Articles</h3>
              <p className="text-sm text-gray-700 mb-4">
                Improve existing content by fixing errors, adding details, or updating outdated information.
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
                Learn How to Edit →
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="bg-purple-100 p-3 rounded-lg inline-block mb-4">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="mb-3">Create New Articles</h3>
              <p className="text-sm text-gray-700 mb-4">
                Start a new wiki page for characters, locations, or concepts that don't yet have entries.
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
                Article Creation Guide →
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="bg-blue-100 p-3 rounded-lg inline-block mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="mb-3">Join the Community</h3>
              <p className="text-sm text-gray-700 mb-4">
                Connect with other wiki contributors, discuss changes, and coordinate on major projects.
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
                Join Discussion →
              </a>
            </div>
          </div>

          {/* Contribution Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-8">
            <h3 className="mb-4">Contribution Guidelines</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="mb-1">Canon Accuracy</h4>
                  <p className="text-sm">All information must be based on published LOREWEAVER works. Fan theories should be clearly labeled as such.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="mb-1">Citation Required</h4>
                  <p className="text-sm">Include citations for major plot points, character information, and quotes. Reference the book, chapter, or source material.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="mb-1">Spoiler Warnings</h4>
                  <p className="text-sm">Use spoiler tags for major plot reveals. Mark spoilers clearly at the beginning of articles containing significant revelations.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <h4 className="mb-1">Neutral Tone</h4>
                  <p className="text-sm">Write in a neutral, encyclopedic tone. Avoid personal opinions or fan preferences in article body text.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  5
                </div>
                <div>
                  <h4 className="mb-1">Community Respect</h4>
                  <p className="text-sm">Be respectful of other contributors. Discuss major changes before implementing them on established articles.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-blue-300">
              <a href="#" className="text-blue-700 hover:text-blue-800 transition-colors">
                Read Full Style Guide →
              </a>
            </div>
          </div>

          {/* Getting Started */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
            <h3 className="mb-4">Getting Started</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-2 rounded flex-shrink-0">
                  <span className="text-purple-600">1</span>
                </div>
                <div>
                  <h4 className="text-sm mb-1">Create a Wiki Account</h4>
                  <p className="text-sm text-gray-700">Sign up for a free wiki contributor account to start editing and creating articles.</p>
                  <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-xs mt-1 inline-block">
                    Sign Up →
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-2 rounded flex-shrink-0">
                  <span className="text-purple-600">2</span>
                </div>
                <div>
                  <h4 className="text-sm mb-1">Review the Tutorial</h4>
                  <p className="text-sm text-gray-700">Learn wiki formatting, how to add images, create links, and structure articles properly.</p>
                  <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-xs mt-1 inline-block">
                    View Tutorial →
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-2 rounded flex-shrink-0">
                  <span className="text-purple-600">3</span>
                </div>
                <div>
                  <h4 className="text-sm mb-1">Start with Small Edits</h4>
                  <p className="text-sm text-gray-700">Begin by fixing typos or adding small details to existing articles to get comfortable with the system.</p>
                  <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-xs mt-1 inline-block">
                    Find Articles to Edit →
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-2 rounded flex-shrink-0">
                  <span className="text-purple-600">4</span>
                </div>
                <div>
                  <h4 className="text-sm mb-1">Join the Discussion</h4>
                  <p className="text-sm text-gray-700">Connect with other contributors in the wiki Discord channel to ask questions and coordinate efforts.</p>
                  <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-xs mt-1 inline-block">
                    Join Discord →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Top Contributors */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-md border border-purple-200 p-6">
            <h3 className="mb-4">Top Contributors This Month</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { name: "LoreKeeper42", edits: 127, articles: 15 },
                { name: "WorldBuilder99", edits: 94, articles: 8 },
                { name: "CanonExpert", edits: 81, articles: 12 },
              ].map((contributor, index) => (
                <div key={index} className="bg-white rounded-lg border border-purple-200 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-sm mb-0">{contributor.name}</h4>
                      <p className="text-xs text-gray-600">{contributor.edits} edits • {contributor.articles} articles</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Thank you to all our contributors for helping build the LOREWEAVER Wiki!
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}