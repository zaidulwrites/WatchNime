// admin-frontend/src/pages/AddEditEpisode.tsx

import React from 'react';
import { useParams } from 'react-router-dom';
import AddEpisodeForm from '../components/forms/AddEpisodeForm.tsx'; // Import the form component

const AddEditEpisode = () => {
  const { seasonId, id } = useParams<{ seasonId: string; id: string }>(); // Get seasonId and episode ID from URL

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
      {/* Pass seasonId for adding, and id for editing */}
      <AddEpisodeForm seasonId={seasonId} episodeId={id} />
    </div>
  );
};

export default AddEditEpisode;
