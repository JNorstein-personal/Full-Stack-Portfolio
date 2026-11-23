import { PageNavDropdown } from "./components/PageNavDropdown";
import { BookOpen, Calendar, Tag, Star, TrendingUp, Clock } from "lucide-react";

export default function Blog() {
  // Define page sections for jump-to navigation
  const pageSections = [
    { label: "Recent Posts", id: "recent-posts" },
    { label: "Categories", id: "categories" },
    { label: "Archives", id: "archives" },
    { label: "Reviews & Recommendations", id: "reviews-recommendations" },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 flex-1">
      {/* Page Navigation Dropdown - Between header and content on mobile, floating on desktop */}
      <div className="mb-6 flex justify-end lg:mb-0 lg:absolute lg:top-0 lg:right-0 lg:z-10">
        <PageNavDropdown items={pageSections} />
      </div>

      {/* Full Width Content */}
      <div className="space-y-12">
        {/* Recent Posts Section */}
        <section id="recent-posts">
          <h1 className="mb-6">Recent Posts</h1>
          <div className="space-y-4 text-gray-700 mb-8">
            <p>
              Stay up to date with the latest news, insights, and stories from LOREWEAVER. Our blog features author interviews, behind-the-scenes content, writing tips, and community highlights.
            </p>
          </div>

          {/* Featured Post */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mb-8">
            <div className="bg-gray-200 border-b-2 border-gray-300 h-64"></div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">Featured</span>
                <span className="text-gray-500 text-xs">November 10, 2025</span>
              </div>
              <h2 className="mb-3">Featured Blog Post Title Here</h2>
              <p className="text-gray-700 mb-4">
                This is an excerpt from the featured blog post. It provides a compelling introduction to the content and encourages readers to learn more. The featured post highlights the most important or timely content on the blog.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">By Author Name</span>
                <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
                  Read More →
                </a>
              </div>
            </div>
          </div>

          {/* Recent Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gray-200 border-b-2 border-gray-300 h-40"></div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-500 text-xs">November {15 - index}, 2025</span>
                  </div>
                  <h3 className="mb-2">Blog Post Title {index}</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    A brief excerpt from this blog post that gives readers a taste of the content and entices them to click through...
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">By Author Name</span>
                    <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-xs">
                      Read More →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <a href="#" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Load More Posts
            </a>
          </div>
        </section>

        {/* Categories Section */}
        <section id="categories">
          <h2 className="mb-6">Blog Categories</h2>
          <div className="space-y-4 text-gray-700 mb-8">
            <p>
              Explore our blog posts by category. Whether you're interested in author insights, world-building tips, or community news, we have something for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="mb-0">Author Interviews</h3>
                  <p className="text-xs text-gray-600">24 posts</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Get to know the voices behind LOREWEAVER's stories through in-depth conversations and Q&As.
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
                View Posts →
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="mb-0">Writing Tips</h3>
                  <p className="text-xs text-gray-600">18 posts</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Learn from professional authors and editors about craft, technique, and the writing process.
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
                View Posts →
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="mb-0">Behind the Scenes</h3>
                  <p className="text-xs text-gray-600">31 posts</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Discover the creative process, world-building decisions, and production insights from our team.
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
                View Posts →
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="mb-0">News & Announcements</h3>
                  <p className="text-xs text-gray-600">42 posts</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Stay informed about new releases, events, and important updates from LOREWEAVER.
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
                View Posts →
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Tag className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="mb-0">Community Spotlight</h3>
                  <p className="text-xs text-gray-600">27 posts</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Celebrating fan creations, community members, and the passionate LOREWEAVER community.
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
                View Posts →
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <BookOpen className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="mb-0">World-Building</h3>
                  <p className="text-xs text-gray-600">15 posts</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Deep dives into the lore, history, and mythology of LOREWEAVER worlds and universes.
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
                View Posts →
              </a>
            </div>
          </div>
        </section>

        {/* Archives Section */}
        <section id="archives">
          <h2 className="mb-6">Blog Archives</h2>
          <div className="space-y-4 text-gray-700 mb-8">
            <p>
              Browse through our complete blog history. Find posts from previous months and years to discover content you may have missed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* 2025 */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="mb-4">2025</h3>
              <div className="space-y-2">
                {["November", "October", "September", "August", "July", "June"].map((month) => (
                  <a
                    key={month}
                    href="#"
                    className="flex items-center justify-between py-2 px-3 hover:bg-blue-50 rounded transition-colors group"
                  >
                    <span className="text-sm text-gray-700 group-hover:text-blue-600">{month} 2025</span>
                    <span className="text-xs text-gray-500">{Math.floor(Math.random() * 10) + 3} posts</span>
                  </a>
                ))}
              </div>
            </div>

            {/* 2024 */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="mb-4">2024</h3>
              <div className="space-y-2">
                {["December", "November", "October", "September", "August", "July"].map((month) => (
                  <a
                    key={month}
                    href="#"
                    className="flex items-center justify-between py-2 px-3 hover:bg-blue-50 rounded transition-colors group"
                  >
                    <span className="text-sm text-gray-700 group-hover:text-blue-600">{month} 2024</span>
                    <span className="text-xs text-gray-500">{Math.floor(Math.random() * 10) + 3} posts</span>
                  </a>
                ))}
              </div>
            </div>

            {/* 2023 */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="mb-4">2023</h3>
              <div className="space-y-2">
                {["December", "November", "October", "September", "August", "July"].map((month) => (
                  <a
                    key={month}
                    href="#"
                    className="flex items-center justify-between py-2 px-3 hover:bg-blue-50 rounded transition-colors group"
                  >
                    <span className="text-sm text-gray-700 group-hover:text-blue-600">{month} 2023</span>
                    <span className="text-xs text-gray-500">{Math.floor(Math.random() * 10) + 3} posts</span>
                  </a>
                ))}
              </div>
            </div>

            {/* 2022 */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="mb-4">2022</h3>
              <div className="space-y-2">
                {["December", "November", "October", "September", "August", "July"].map((month) => (
                  <a
                    key={month}
                    href="#"
                    className="flex items-center justify-between py-2 px-3 hover:bg-blue-50 rounded transition-colors group"
                  >
                    <span className="text-sm text-gray-700 group-hover:text-blue-600">{month} 2022</span>
                    <span className="text-xs text-gray-500">{Math.floor(Math.random() * 10) + 3} posts</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="mb-2">Looking for Something Specific?</h3>
            <p className="text-sm text-gray-700 mb-4">
              Use our search function to find blog posts by keyword, author, or topic.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search blog posts..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Search
              </button>
            </div>
          </div>
        </section>

        {/* Reviews & Recommendations Section */}
        <section id="reviews-recommendations">
          <h2 className="mb-6">Reviews & Recommendations</h2>
          <div className="space-y-4 text-gray-700 mb-8">
            <p>
              Our team shares honest reviews and thoughtful recommendations for books, media, and creative works that inspire us and might inspire you too.
            </p>
          </div>

          {/* Featured Review */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-md border border-purple-200 p-8 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs">Editor's Pick</span>
            </div>
            <h3 className="mb-3">Featured Review: Book Title Here</h3>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <span className="text-sm text-gray-600">5.0 / 5.0</span>
            </div>
            <p className="text-gray-700 mb-4">
              An in-depth review of this exceptional work that has captured our attention. This featured review highlights why we think this book/media deserves special recognition and why you might enjoy it too. The review includes thoughtful analysis and specific examples that illustrate the work's strengths.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Reviewed by Editor Name • November 12, 2025</span>
              <a href="#" className="text-purple-600 hover:text-purple-700 transition-colors text-sm">
                Read Full Review →
              </a>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-gray-200 border-2 border-gray-300 rounded w-20 h-28 flex-shrink-0"></div>
                  <div className="flex-1">
                    <h3 className="mb-2">Book/Media Title {index}</h3>
                    <p className="text-xs text-gray-600 mb-2">by Creator Name</p>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex text-yellow-500">
                        {[1, 2, 3, 4].map((star) => (
                          <Star key={star} className="w-4 h-4 fill-current" />
                        ))}
                        <Star className="w-4 h-4" />
                      </div>
                      <span className="text-xs text-gray-600">4.0 / 5.0</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  A concise review excerpt that highlights the key points and overall impression of this work. The review provides insight into what makes this recommendation worth your time.
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-xs text-gray-600">By Reviewer Name</span>
                  <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-xs">
                    Read Review →
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="mb-3">Submit a Review</h3>
            <p className="text-sm text-gray-700 mb-4">
              Have a book or creative work you'd like to recommend to the LOREWEAVER community? We welcome guest reviews from community members! Share your thoughts and help others discover great content.
            </p>
            <a href="#" className="inline-block text-blue-600 hover:text-blue-700 transition-colors text-sm">
              Submission Guidelines →
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
