'use client';

import { useState, useEffect } from 'react';
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this review?')) {
      onDelete(id);
    }
  };

  if (!mounted) {
    return null; // Return null on server-side and first render
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 my-4 hover:shadow-lg transition-shadow duration-300">
      {/* Header Section */}
      <div className="flex items-center mb-6">
        <div className="w-20 h-20 rounded-full border-2 border-blue-400 overflow-hidden shadow-md">
          <img
            src={avatars[avatar] || avatars[0]}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="ml-6">
          <h3 className="text-xl font-bold text-gray-800">{username}</h3>
          <p className="text-md text-gray-600">{locationName}</p>
          <p className="text-sm text-gray-500">{date}</p>
          <p className="text-sm text-gray-600">
            {numAttempt} Attempt{numAttempt > 1 ? 's' : ''} - {examResult}
          </p>
        </div>
      </div>

      {/* Details Section - Always Visible */}
      <div className="space-y-6">
        {/* Minimal Errors */}
        {minimalMistake.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-md font-bold text-gray-800 mb-2">Minimal Errors:</p>
            <ul className="grid grid-cols-2 gap-2">
              {minimalMistake.map((error, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <span className="mr-2">•</span>
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Critical Errors */}
        {criticalMistake.length > 0 && (
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-md font-bold text-gray-800 mb-2">Critical Errors:</p>
            <ul className="list-disc ml-5 text-gray-700">
              {criticalMistake.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Examiner */}
        {examiner && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-md font-bold text-gray-800 mb-2">Examiner:</p>
            <p className="text-gray-700">{examiner}</p>
          </div>
        )}

        {/* Tips */}
        {tips && (
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-md font-bold text-gray-800 mb-2">Tips:</p>
            <p className="text-gray-700">{tips}</p>
          </div>
        )}
      </div>

      {/* Footer Section */}
      <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
        <LikeButton initialLikes={initialLikes} user={user} postId={id} />
        {isDeletable && (
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 font-medium transition-colors duration-200"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
