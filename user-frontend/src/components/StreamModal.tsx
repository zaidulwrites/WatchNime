// user-frontend/src/components/StreamModal.tsx
import React from 'react';

interface StreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  // content: React.ReactNode; // Could be video player, etc.
}

const StreamModal: React.FC<StreamModalProps> = ({ isOpen, onClose, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl font-bold focus:outline-none"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-700 pb-2">{title}</h2>
        <div className="text-gray-300">
          <p>This is a placeholder for a streaming modal.</p>
          <p>As per requirements, direct downloads are preferred over streaming modals for episodes.</p>
          <p className="mt-2">If you need a streaming feature, this component would contain the video player.</p>
        </div>
      </div>
    </div>
  );
};

export default StreamModal;
