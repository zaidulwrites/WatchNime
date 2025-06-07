// user-frontend/src/pages/RequestAnimePage.tsx

import React, { useState } from 'react'; // CORRECTED: Removed '=>'

const RequestAnimePage: React.FC = () => {
  const [status, setStatus] = useState<string>(''); // For form submission status

  // UPDATED: Replace 'YOUR_FORMSPREE_FORM_ID' with your actual Formspree form ID
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/movwjenp"; // Use your Formspree ID here

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Submitting...");

    const form = e.currentTarget;
    const data = new FormData(form);
    data.append("Subject", "Anime Request from AnimeFlix Website"); // Add a subject for your email

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus("Your anime request has been sent! Thank you for your suggestion.");
        form.reset(); // Clear the form
      } else {
        const errorData = await response.json();
        setStatus(errorData.error || "Oops! There was an error submitting your request.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus("Oops! There was a network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-white mb-6 text-center text-orange-500">Request Anime</h2>
        <p className="text-gray-300 mb-6 text-center">
          Can't find your favorite anime? Request it here and we'll try to add it!
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="animeName" className="block text-gray-300 text-sm font-bold mb-2">
              Anime Title
            </label>
            <input
              type="text"
              id="animeName"
              name="Anime Title" // Name for Formspree
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
              placeholder="e.g., My Hero Academia"
              required
            />
          </div>
          <div>
            <label htmlFor="yourEmail" className="block text-gray-300 text-sm font-bold mb-2">
              Your Email (Optional)
            </label>
            <input
              type="email"
              id="yourEmail"
              name="Your Email" // Name for Formspree
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label htmlFor="additionalNotes" className="block text-gray-300 text-sm font-bold mb-2">
              Additional Notes
            </label>
            <textarea
              id="additionalNotes"
              name="Additional Notes" // Name for Formspree
              rows={4}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
              placeholder="Any details, season preference, etc."
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-md transition-colors duration-200"
            disabled={status === "Submitting..."}
          >
            {status === "Submitting..." ? "Sending Request..." : "Send Request"}
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

export default RequestAnimePage;
