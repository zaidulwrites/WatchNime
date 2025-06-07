// user-frontend/src/pages/JoinUsPage.tsx

import React, { useState } from 'react'; // CORRECTED: Removed '=>'

const JoinUsPage: React.FC = () => {
  const [status, setStatus] = useState<string>(''); // For form submission status

  // UPDATED: Replace 'YOUR_FORMSPREE_FORM_ID' with your actual Formspree form ID
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/movwjenp"; // Use your Formspree ID here

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Submitting...");

    const form = e.currentTarget;
    const data = new FormData(form);
    data.append("Subject", "Join Us Application from AnimeFlix Website"); // Add a subject for your email

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus("Your application has been submitted! We will review it and get back to you.");
        form.reset(); // Clear the form
      } else {
        const errorData = await response.json();
        setStatus(errorData.error || "Oops! There was an error submitting your application.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus("Oops! There was a network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-white mb-6 text-center text-orange-500">Join Our Team</h2>
        <p className="text-gray-300 mb-6 text-center">
          Interested in contributing to AnimeFlix? Tell us about yourself!
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-gray-300 text-sm font-bold mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="Full Name" // Name for Formspree
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="Email" // Name for Formspree
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-gray-300 text-sm font-bold mb-2">
              Area of Interest
            </label>
            <select
              id="role"
              name="Area of Interest" // Name for Formspree
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
              required
            >
              <option value="">Select an option</option>
              <option value="content_curation">Content Curation</option>
              <option value="development">Development (Frontend/Backend)</option>
              <option value="design">Design</option>
              <option value="marketing">Marketing</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="experience" className="block text-gray-300 text-sm font-bold mb-2">
              Tell us about your experience/skills
            </label>
            <textarea
              id="experience"
              name="Experience/Skills" // Name for Formspree
              rows={5}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
              placeholder="Describe your relevant experience or skills..."
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-md transition-colors duration-200"
            disabled={status === "Submitting..."}
          >
            {status === "Submitting..." ? "Submitting..." : "Submit Application"}
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

export default JoinUsPage;
