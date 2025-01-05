'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';
import HeaderBar from '@/components/HeaderBar';

export default function ExamInfo() {
  const router = useRouter();

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const [date, setDate] = useState('');
  const [examResult, setExamResult] = useState(null);
  const [numAttempt, setNumAttempt] = useState(1); // Default to 1
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const [error, setError] = useState({
    location: '',
    date: '',
    examResult: '',
  });

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data, error } = await supabase
          .from('test_location')
          .select('location_id, location_name');
        if (error) throw error;

        setLocations(data || []);
      } catch (err) {
        console.error('Error fetching locations:', err.message);
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchLocations();
  }, []);

  const handleLocationSelect = (locationId) => {
    setSelectedLocation(Number(locationId));
    setError((prev) => ({ ...prev, location: '' }));
    setShowLocationPicker(false);
  };

  const handleExamResult = (resultId) => {
    setExamResult(resultId);
    setError((prev) => ({ ...prev, examResult: '' }));
  };

  const validateAndProceed = () => {
    let isValid = true;
    const errors = { location: '', date: '', examResult: '' };

    if (!selectedLocation) {
      errors.location = 'Please select a location.';
      isValid = false;
    }

    if (!date) {
      errors.date = 'Please select a valid exam date.';
      isValid = false;
    }

    if (examResult === null) {
      errors.examResult = 'Please select an exam result.';
      isValid = false;
    }

    setError(errors);

    if (isValid) {
      const parsedNumAttempt = Number(numAttempt); // Ensure it's a number

      localStorage.setItem('selectedLocation', selectedLocation);
      localStorage.setItem('date', date);
      localStorage.setItem('examResult', examResult);
      localStorage.setItem('numAttempt', parsedNumAttempt);

      router.push('/new-post/MinimalMistakes');
    }
  };

  return (
    <>
      <HeaderBar />
      <div className="p-6 flex justify-center">
        <div className="w-full max-w-screen-md">
          <h1 className="text-xl font-bold mb-4">Exam Info</h1>

          {/* Location Picker */}
          <div className="mb-4">
            <label className="block font-medium mb-2">Select Exam Location</label>
            <button
              className={`w-full p-2 border rounded ${
                error.location ? 'border-red-500' : 'border-gray-300'
              }`}
              onClick={() => setShowLocationPicker(true)}
            >
              {selectedLocation
                ? locations.find((loc) => loc.location_id === selectedLocation)?.location_name
                : 'Select Exam Location'}
            </button>
            {error.location && <p className="text-red-500 text-sm mt-1">{error.location}</p>}
          </div>

          {/* Date Picker */}
          <div className="mb-4">
            <label className="block font-medium mb-2">Exam Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full p-2 border rounded ${
                error.date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {error.date && <p className="text-red-500 text-sm mt-1">{error.date}</p>}
          </div>

          {/* Exam Result Picker */}
          <div className="mb-4">
            <label className="block font-medium mb-2">Exam Result</label>
            <div className="flex space-x-4">
              {[{ id: 1, name: 'Pass' }, { id: 2, name: 'Fail' }].map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleExamResult(result.id)}
                  className={`p-2 rounded border ${
                    examResult === result.id
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-gray-200 text-black border-gray-300'
                  }`}
                >
                  {result.name}
                </button>
              ))}
            </div>
            {error.examResult && <p className="text-red-500 text-sm mt-1">{error.examResult}</p>}
          </div>

          {/* Number of Attempts */}
          <div className="mb-4">
            <label className="block font-medium mb-2">Number of Attempts</label>
            <select
              value={numAttempt}
              onChange={(e) => setNumAttempt(e.target.value)}
              className={`w-full p-2 border rounded`}
            >
              {[...Array(10).keys()].map((i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Location Picker Modal */}
          {showLocationPicker && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end">
              <div className="bg-white w-full rounded-t-xl p-4">
                <h2 className="text-lg font-bold mb-4">Select Location</h2>
                {loadingLocations ? (
                  <p>Loading...</p>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {locations.map((location) => (
                      <li
                        key={location.location_id}
                        className="p-4 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleLocationSelect(location.location_id)}
                      >
                        {location.location_name}
                      </li>
                    ))}
                  </ul>
                )}
                <button
                  className="w-full bg-red-500 text-white p-2 mt-4 rounded"
                  onClick={() => setShowLocationPicker(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Next Button */}
          <button
            onClick={validateAndProceed}
            className="bg-green-500 text-white w-full p-2 rounded mt-4"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
