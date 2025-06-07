// user-frontend/src/pages/LicensePage.tsx
import React, { useContext } from 'react';
import { AppContext } from '../App';

const LicensePage: React.FC = () => {
  const { setCurrentPage } = useContext(AppContext);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-8">
      <div className="container mx-auto bg-gray-800 p-6 rounded-lg shadow-lg max-w-4xl">
        <button
          onClick={() => setCurrentPage('homepage')}
          className="mb-6 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors duration-200"
        >
          &larr; Back to Home
        </button>

        <h2 className="text-3xl font-bold text-orange-500 mb-6 text-center">License Agreement</h2>

        <div className="prose prose-invert text-gray-300 max-w-none leading-relaxed">
          <p className="mb-4">
            Watchnime and its services are a non-profit project created purely for educational and personal use. We do not promote or support any form of copyright infringement. All anime, videos, and related media displayed on this website are the property of their respective copyright holders.
          </p>

          <p className="mb-4">
            We do not host any content on this website. All video streams are embedded from external third-party hosting services. We take no responsibility for the content hosted on those platforms.
          </p>

          <h3 className="text-xl font-semibold text-orange-400 mt-6 mb-3">User Conduct</h3>
          <ul className="list-disc list-inside mb-4">
            <li>The use of this website must be strictly for lawful purposes only.</li>
            <li>Uploading, posting, or transmitting any offensive, harmful, or illegal content is strictly prohibited.</li>
            <li>Do not attempt to reverse-engineer, decompile, or disassemble any part of the website.</li>
            <li>Do not interfere with the website's performance or functionality.</li>
          </ul>

          <h3 className="text-xl font-semibold text-orange-400 mt-6 mb-3">Content Disclaimer</h3>
          <p className="mb-4">
            While we strive to provide accurate and up-to-date information, we make no warranties or representations regarding the completeness, accuracy, reliability, suitability, or availability of any content on the website. Your reliance on any information is strictly at your own risk.
          </p>

          <h3 className="text-xl font-semibold text-orange-400 mt-6 mb-3">Third-Party Links</h3>
          <p className="mb-4">
            Our website may contain links to websites that are not under our control. We are not responsible for the content, privacy policies, or practices of any linked sites. You access and use such third-party sites entirely at your own risk.
          </p>

          <h3 className="text-xl font-semibold text-orange-400 mt-6 mb-3">Changes to This License</h3>
          <p className="mb-4">
            We reserve the right to update or modify this license agreement at any time. Any changes will become effective immediately upon posting on the website. Continued use of the website after any such changes will constitute your acceptance of the revised license agreement.
          </p>

          <h3 className="text-xl font-semibold text-orange-400 mt-6 mb-3">Contact Us</h3>
          <p>
            If you have any questions about this license agreement, please reach out to us through the Contact page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LicensePage;
