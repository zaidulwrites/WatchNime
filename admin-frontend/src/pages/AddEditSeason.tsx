// admin-frontend/src/pages/AddEditSeason.tsx

import React from 'react';
import { useParams } from 'react-router-dom';
import AddSeasonForm from '../components/forms/AddSeasonForm.tsx'; // Correctly import AddSeasonForm

const AddEditSeason = () => {
  const { animeId, id } = useParams<{ animeId: string; id: string }>(); // Get animeId and season ID from URL

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
      {/* Pass animeId for adding, and id for editing */}
      <AddSeasonForm animeId={animeId} seasonId={id} />
    </div>
  );
};

export default AddEditSeason;
