// user-frontend/src/pages/ContactUsPage.tsx

import React, { useState } from 'react'; // CORRECTED: Removed '=>'

const ContactUsPage: React.FC = () => {
  const [status, setStatus] = useState<string>(''); // For form submission status

  // UPDATED: Replace 'YOUR_FORMSPREE_FORM_ID' with your actual Formspree form ID
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/movwjenp"; // Use your Formspree ID here

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Submitting...");

    const form = e.currentTarget;
    const data = new FormData(form);
    data.append("Subject", "Contact Us Message from AnimeFlix"); // Add a subject for your email

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus("Thank you for your message! We will get back to you soon.");
        form.reset(); // Clear the form
      } else {
        const errorData = await response.json();
        setStatus(errorData.error || "Oops! There was an error submitting your form.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus("Oops! There was a network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-white mb-6 text-center text-orange-500">Contact Us</h2>
        <p className="text-gray-300 mb-6 text-center">
          Have questions or feedback? Feel free to reach out to us!
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-300 text-sm font-bold mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-gray-300 text-sm font-bold mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
              placeholder="Write your message here..."
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-md transition-colors duration-200"
            disabled={status === "Submitting..."}
          >
            {status === "Submitting..." ? "Sending..." : "Send Message"}
          </button>
        </form>
        {status && status !== "Submitting..." && (
          <p className={`mt-4 text-center ${status.includes("Oops!") ? 'text-red-400' : 'text-green-400'}`}>
            {status}
          </p>
        )}
      </div>
    </div>
  );
};

export default ContactUsPage;
