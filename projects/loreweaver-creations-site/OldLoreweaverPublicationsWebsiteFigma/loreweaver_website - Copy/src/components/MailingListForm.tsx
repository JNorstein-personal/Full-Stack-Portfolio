import { useState } from "react";

export function MailingListForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    receiveASAP: false,
    monthlyNewsletter: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // Check if form is valid (name and email filled, at least one checkbox checked)
  const isFormValid = formData.name.trim() !== "" && 
                      formData.email.trim() !== "" && 
                      (formData.receiveASAP || formData.monthlyNewsletter);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="mb-4 text-center">Sign up here to join our mailing list and be updated on all the latest LOREWEAVER news and events!</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm mb-1 text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm mb-1 text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="receiveASAP"
            name="receiveASAP"
            checked={formData.receiveASAP}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="receiveASAP" className="text-sm text-gray-700">
            Receive updates as soon as they are available
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="monthlyNewsletter"
            name="monthlyNewsletter"
            checked={formData.monthlyNewsletter}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="monthlyNewsletter" className="text-sm text-gray-700">
            Receive our monthly newsletter
          </label>
        </div>
        
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md transition-colors ${
            isFormValid 
              ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!isFormValid}
        >
          Subscribe
        </button>

        {/* Terms of Use Link with Hover Tooltip */}
        <div className="relative group text-center">
          <a
            href="#"
            className="text-xs text-gray-600 hover:text-blue-600 underline transition-colors"
          >
            Terms of Use
          </a>
          
          {/* Hover Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 max-w-[90vw] bg-gray-900 text-white text-xs rounded-lg p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
            <div className="space-y-2">
              <p className="font-semibold">Terms of Use & Privacy</p>
              <p>
                By subscribing, you agree to receive promotional emails from LOREWEAVER Publications. We respect your privacy and will never share your information with third parties. You may unsubscribe at any time.
              </p>
              <p>
                We collect only your name and email address for newsletter purposes. Your data is stored securely and used solely for LOREWEAVER communications.
              </p>
            </div>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
              <div className="border-8 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}