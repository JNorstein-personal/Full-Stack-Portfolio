import { Clock, Bell, Sparkles, Mail } from "lucide-react";

export default function Comingsoon() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12 flex-1">
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-8 rounded-full">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 rounded-full">
                <Clock className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h1 className="mb-6">Coming Soon</h1>

          {/* Description */}
          <div className="space-y-4 text-gray-700 mb-8">
            <p className="text-lg">
              We're working on something special! This page is currently under construction, but exciting new content is on the way.
            </p>
            <p>
              Stay tuned for updates as we continue to expand the LOREWEAVER universe with new stories, features, and experiences.
            </p>
          </div>

          {/* Features Coming Soon */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="bg-purple-100 p-3 rounded-lg inline-block mb-4">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="mb-2">New Content</h3>
              <p className="text-sm text-gray-700">
                Fresh stories, articles, and exclusive material coming your way.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="bg-blue-100 p-3 rounded-lg inline-block mb-4">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="mb-2">Updates</h3>
              <p className="text-sm text-gray-700">
                Regular updates and improvements to enhance your experience.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="bg-green-100 p-3 rounded-lg inline-block mb-4">
                <Sparkles className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="mb-2">Features</h3>
              <p className="text-sm text-gray-700">
                Exciting new features and interactive elements in development.
              </p>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-md border border-blue-200 p-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="mb-0">Get Notified</h2>
            </div>
            <p className="text-gray-700 mb-6">
              Sign up to receive an email notification when this page goes live. Be the first to know about new content and features!
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Notify Me
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-3">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-12">
            <a
              href="#"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-block text-blue-600 hover:text-blue-700 transition-colors"
            >
              ← Return to Home
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
