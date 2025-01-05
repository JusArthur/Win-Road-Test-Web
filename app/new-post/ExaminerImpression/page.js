'use client'; // This component runs on the client side

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import HeaderBar from '@/components/HeaderBar';

export default function ExaminerImpression() {
  const router = useRouter();

  // States for managing examiner impression
  const [impression, setImpression] = useState({
    ethnicity: '',
    gender: '',
    speed: '',
    attitudes: [],
  });

  const [errors, setErrors] = useState({
    ethnicity: '',
    gender: '',
    speed: '',
  });

  const attitudeOptions = [
    { id: 1, value: 'Friendly' },
    { id: 2, value: 'Gentle' },
    { id: 3, value: 'Serious' },
    { id: 4, value: 'Cold' },
    { id: 5, value: 'Amazing' },
    { id: 6, value: 'Well-informed' },
  ];

  const ethnicities = [
    { id: 1, value: 'Asian' },
    { id: 2, value: 'Black' },
    { id: 3, value: 'White' },
    { id: 4, value: 'Latino' },
    { id: 5, value: 'Mid Eastern' },
    { id: 6, value: 'South Asian' },
    { id: 7, value: 'Other' },
    { id: 8, value: 'Prefer Not To Say' },
  ];

  // Toggle attitude selection
  const handleToggleAttitude = (attitudeId) => {
    setImpression((prev) => ({
      ...prev,
      attitudes: prev.attitudes.includes(attitudeId)
        ? prev.attitudes.filter((id) => id !== attitudeId)
        : [...prev.attitudes, attitudeId],
    }));
  };

  // Handle ethnicity selection
  const handleEthnicityChange = (ethnicityId) => {
    setErrors((prev) => ({ ...prev, ethnicity: '' }));
    setImpression((prev) => ({ ...prev, ethnicity: ethnicityId }));
  };

  // Handle gender selection
  const handleGenderChange = (genderId) => {
    setErrors((prev) => ({ ...prev, gender: '' }));
    setImpression((prev) => ({ ...prev, gender: genderId }));
  };

  // Handle speed selection
  const handleSpeedChange = (speedId) => {
    setErrors((prev) => ({ ...prev, speed: '' }));
    setImpression((prev) => ({ ...prev, speed: speedId }));
  };

  // Validation and navigation to the next page
  const handleNext = () => {
    let isValid = true;
    const validationErrors = { ethnicity: '', gender: '', speed: '' };

    if (!impression.ethnicity) {
      validationErrors.ethnicity = 'Please select an ethnicity.';
      isValid = false;
    }
    if (!impression.gender) {
      validationErrors.gender = 'Please select a gender.';
      isValid = false;
    }
    if (!impression.speed) {
      validationErrors.speed = 'Please select a speaking speed.';
      isValid = false;
    }

    setErrors(validationErrors);

    if (isValid) {
      // Save to localStorage (or replace with global state if needed)
      localStorage.setItem('examinerImpression', JSON.stringify(impression));

      // Navigate to the next page
      router.push('/new-post/Tips');
    }
  };

  return (
    <>
      <HeaderBar />
      <div className="p-6 flex justify-center">
        <div className="w-full max-w-screen-md">
          <h1 className="text-xl font-bold mb-4">Examiner Impression</h1>

          {/* Ethnicity Selection */}
          <div className="mb-4">
            <label className="block font-medium mb-2">Ethnic Background</label>
            <select
              value={impression.ethnicity}
              onChange={(e) => handleEthnicityChange(Number(e.target.value))}
              className={`w-full p-2 border rounded ${
                errors.ethnicity ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Ethnic Background</option>
              {ethnicities.map((ethnicity) => (
                <option key={ethnicity.id} value={ethnicity.id}>
                  {ethnicity.value}
                </option>
              ))}
            </select>
            {errors.ethnicity && (
              <p className="text-red-500 text-sm mt-1">{errors.ethnicity}</p>
            )}
          </div>

          {/* Gender Selection */}
          <div className="mb-4">
            <label className="block font-medium mb-2">Gender</label>
            <div className="flex space-x-4">
              <button
                onClick={() => handleGenderChange(1)}
                className={`p-2 rounded border ${
                  impression.gender === 1
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-gray-200 text-black border-gray-300'
                }`}
              >
                Male
              </button>
              <button
                onClick={() => handleGenderChange(2)}
                className={`p-2 rounded border ${
                  impression.gender === 2
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-gray-200 text-black border-gray-300'
                }`}
              >
                Female
              </button>
            </div>
            {errors.gender && (
              <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
            )}
          </div>

          {/* Speaking Speed Selection */}
          <div className="mb-4">
            <label className="block font-medium mb-2">Speaking Speed</label>
            <div className="flex space-x-4">
              {['Fast', 'Normal', 'Slow'].map((speed, index) => (
                <button
                  key={index}
                  onClick={() => handleSpeedChange(index + 1)}
                  className={`p-2 rounded border ${
                    impression.speed === index + 1
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-gray-200 text-black border-gray-300'
                  }`}
                >
                  {speed}
                </button>
              ))}
            </div>
            {errors.speed && (
              <p className="text-red-500 text-sm mt-1">{errors.speed}</p>
            )}
          </div>

          {/* Attitude Selection */}
          <div className="mb-4">
            <label className="block font-medium mb-2">Attitude</label>
            <div className="flex flex-wrap gap-2">
              {attitudeOptions.map((attitude) => (
                <button
                  key={attitude.id}
                  onClick={() => handleToggleAttitude(attitude.id)}
                  className={`p-2 rounded border ${
                    impression.attitudes.includes(attitude.id)
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-gray-200 text-black border-gray-300'
                  }`}
                >
                  {attitude.value}
                </button>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="bg-green-500 text-white px-4 py-2 rounded mt-4 w-full"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
