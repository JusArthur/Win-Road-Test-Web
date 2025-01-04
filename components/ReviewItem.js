'use client';

import { useState } from 'react';
import supabase from '@/lib/supabase';
import LikeButton from '@/components/LikeButton';

const avatars = [
  '/images/avatars/bear_profile.png',
  '/images/avatars/cat_profile.png',
  '/images/avatars/deer_profile.png',
  '/images/avatars/dog_profile.png',
  '/images/avatars/wolf_profile.png',
];

export default function ReviewItem({
  id,
  username,
  locationName,
  date,
  numAttempt,
  examResult,
  minimalMistake = [],
  criticalMistake = [],
  examiner,
  tips,
  isDeletable,
  onDelete,
  avatar,
  initialLikes,
  user,
}) {
  const [detailsVisible, setDetailsVisible] = useState(false);

  const toggleDetails = () => {
    setDetailsVisible((prev) => !prev);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this review?')) {
      onDelete(id);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 my-4">
      {/* Header Section */}
      <div className="flex items-center mb-4">
        <div className="w-16 h-16 rounded-full border-2 border-blue-400 overflow-hidden">
          <img
            src={avatars[avatar] || avatars[0]}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-bold">{username}</h3>
          <p className="text-sm text-gray-500">{locationName}</p>
          <p className="text-sm text-gray-400">{date}</p>
          <p className="text-sm text-gray-500">
            {numAttempt} Attempt{numAttempt > 1 ? 's' : ''} - {examResult}
          </p>
        </div>
      </div>

      {/* Details Section */}
      {detailsVisible && (
        <div className="mt-4">
          {/* Minimal Errors */}
          {minimalMistake.length > 0 && (
            <div>
              <p className="text-sm font-bold">Minimal Errors:</p>
              <ul className="list-disc ml-5 text-sm text-gray-600">
                {minimalMistake.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Critical Errors */}
          {criticalMistake.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-bold">Critical Errors:</p>
              <ul className="list-disc ml-5 text-sm text-gray-600">
                {criticalMistake.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Examiner */}
          {examiner && (
            <div className="mt-4">
              <p className="text-sm font-bold">Examiner:</p>
              <p className="text-sm text-gray-600">{examiner}</p>
            </div>
          )}

          {/* Tips */}
          {tips && (
            <div className="mt-4">
              <p className="text-sm font-bold">Tips:</p>
              <p className="text-sm text-gray-600">{tips}</p>
            </div>
          )}
        </div>
      )}

      <button
        onClick={toggleDetails}
        className="text-sm text-blue-500 mt-2 hover:underline"
      >
        {detailsVisible ? 'Hide Details' : 'Show Details'}
      </button>

      {/* Footer Section */}
      <div className="mt-4 border-t pt-4 flex justify-between items-center">
        <LikeButton initialLikes={initialLikes} user={user} postId={id} />
        {isDeletable && (
          <button
            onClick={handleDelete}
            className="text-sm text-red-500 hover:underline"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
