// user-frontend/src/components/Sidebar.tsx
import React, { useContext } from 'react';
import { AppContext } from '../App'; // Import AppContext

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const context = useContext(AppContext);
if (!context) throw new Error("AppContext not found");
const { setCurrentPage } = context;


  const handleLinkClick = (page: string) => {
    setCurrentPage(page);
    onClose();
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 w-64 bg-gray-900 text-white shadow-xl transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50`}
    >
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-2xl font-bold text-orange-500">Menu</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-600 rounded-full p-1"
          aria-label="Close Sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <nav className="p-4">
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => handleLinkClick('homepage')}
              className="block w-full text-left text-lg py-2 px-3 rounded-md hover:bg-gray-700 transition-colors duration-200"
            >
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => alert('Contact Us functionality not implemented.')}
              className="block w-full text-left text-lg py-2 px-3 rounded-md hover:bg-gray-700 transition-colors duration-200"
            >
              Contact Us
            </button>
          </li>
          <li>
            <button
              onClick={() => alert('Request Anime functionality not implemented.')}
              className="block w-full text-left text-lg py-2 px-3 rounded-md hover:bg-gray-700 transition-colors duration-200"
            >
              Request Anime
            </button>
          </li>
          <li>
            <button
              onClick={() => alert('Join Us functionality not implemented.')}
              className="block w-full text-left text-lg py-2 px-3 rounded-md hover:bg-gray-700 transition-colors duration-200"
            >
              Join Us
            </button>
          </li>
          <li>
            <button
              onClick={() => alert('License information not implemented.')}
              className="block w-full text-left text-lg py-2 px-3 rounded-md hover:bg-gray-700 transition-colors duration-200"
            >
              License
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
