export function FooterBanner() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Newsletter Column */}
          <div>
            <p className="text-sm">
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors underline">
                Click Here
              </a>{" "}
              to sign up for our newsletter and keep informed of all the latest LOREWEAVER events and titles
            </p>
          </div>

          {/* Terms and Privacy Column */}
          <div className="text-center">
            <div className="relative group inline-block">
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                Website Terms of Use & Privacy Policy
              </a>
              
              {/* Hover Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-96 max-w-[90vw] bg-white text-gray-900 text-xs rounded-lg p-4 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                <div className="space-y-2">
                  <p className="font-semibold">Terms of Use & Privacy Policy</p>
                  <p>
                    <strong>Terms of Use:</strong> By accessing and using this website, you agree to comply with these terms. All content on LOREWEAVER Publications is protected by copyright. Unauthorized reproduction or distribution is prohibited.
                  </p>
                  <p>
                    <strong>Privacy Policy:</strong> We respect your privacy and are committed to protecting your personal information. We collect only necessary data for newsletter subscriptions and website functionality. Your information will never be sold or shared with third parties without your consent.
                  </p>
                  <p>
                    For full details, please contact us or refer to our complete terms and privacy documentation.
                  </p>
                </div>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                  <div className="border-8 border-transparent border-t-white"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Return to Top Column */}
          <div className="flex justify-center md:justify-end">
            <button
              onClick={scrollToTop}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm"
            >
              RETURN TO TOP OF PAGE
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}