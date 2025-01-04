'use client';

import { useState } from 'react';
import LikeButton from '@/components/LikeButton'; // 确保路径正确

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
  minimalMistake,
  criticalMistake,
  examiner,
  tips,
  avatar,
  initialLikes,
}) {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => setShowDetails((prev) => !prev);

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      {/* Header Section */}
      <div className="flex items-center mb-4">
        <img
          src={avatars[avatar] || avatars[0]}
          alt="User Avatar"
          className="w-12 h-12 rounded-full object-cover mr-4"
        />
        <div>
          <h3 className="text-lg font-bold">{username}</h3>
          <p className="text-gray-500 text-sm">{locationName}</p>
          <p className="text-gray-400 text-xs">{date}</p>
        </div>
      </div>

      {/* Main Content */}
      <div>
        <p className="text-gray-700 text-sm">
          <strong>Attempts:</strong> {numAttempt}
        </p>
        <p className="text-gray-700 text-sm">
          <strong>Result:</strong> {examResult}
        </p>

        {showDetails && (
          <div className="mt-4">
            {/* Minimal Mistakes */}
            {minimalMistake?.length > 0 && (
              <>
                <p className="text-sm font-bold">General Errors:</p>
                <ul className="list-disc list-inside text-gray-700 text-sm">
                  {minimalMistake.map((mistake, index) => (
                    <li key={index}>{mistake}</li>
                  ))}
                </ul>
              </>
            )}

            {/* Critical Mistakes */}
            {criticalMistake?.length > 0 && (
              <>
                <p className="text-sm font-bold mt-2">Critical Errors:</p>
                <ul className="list-disc list-inside text-gray-700 text-sm">
                  {criticalMistake.map((mistake, index) => (
                    <li key={index}>{mistake}</li>
                  ))}
                </ul>
              </>
            )}

            {/* Examiner Details */}
            <p className="text-sm font-bold mt-2">Examiner:</p>
            <p className="text-gray-700 text-sm">{examiner}</p>

            {/* Tips */}
            {tips && (
              <>
                <p className="text-sm font-bold mt-2">Tips:</p>
                <p className="text-gray-700 text-sm">{tips}</p>
              </>
            )}
          </div>
        )}

        <button
          className="text-blue-500 text-sm mt-2"
          onClick={toggleDetails}
        >
          {showDetails ? 'Hide Details' : 'View Details'}
        </button>
      </div>

      {/* Footer Section */}
      <div className="mt-4 border-t pt-4 flex justify-between items-center">
        <LikeButton initialLikes={initialLikes} postId={id} />
      </div>
    </div>
  );
}
