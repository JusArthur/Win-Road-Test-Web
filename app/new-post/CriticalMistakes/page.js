'use client'; // Enable client-side rendering for this component

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import HeaderBar from '@/components/HeaderBar';

export default function CriticalMistakes() {
  const router = useRouter();

  // State for critical mistakes
  const [mistakes, setMistakes] = useState(['']);
  const inputRefs = useRef([]); // Store references to input fields

  // Add a new mistake
  const addNewMistake = () => {
    if (mistakes.length < 10) {
      const updatedMistakes = [...mistakes, ''];
      setMistakes(updatedMistakes);

      // Focus on the new input
      setTimeout(() => {
        inputRefs.current[updatedMistakes.length - 1]?.focus();
      }, 100);
    } else {
      alert('Limit Reached: You can only add up to 10 critical mistakes.');
    }
  };

  // Remove the last mistake
  const deleteLastMistake = () => {
    if (mistakes.length > 1) {
      setMistakes(mistakes.slice(0, -1));
    }
  };

  // Handle input changes
  const handleMistakeChange = (value, index) => {
    const updatedMistakes = [...mistakes];
    updatedMistakes[index] = value;
    setMistakes(updatedMistakes);
  };

  // Navigate to the next page
  const handleNext = () => {
    // Filter out empty mistakes
    const filteredMistakes = mistakes.filter((mistake) => mistake.trim() !== '');

    // Save to localStorage (or replace with global state if using Redux/Context)
    localStorage.setItem('criticalMistakes', JSON.stringify(filteredMistakes));

    // Navigate to the next step
    router.push('/new-post/ExaminerImpression');
  };

  return (
    <>
      <HeaderBar />
      <div className="p-6 flex justify-center">
        <div className="w-full max-w-screen-md">
          <h1 className="text-xl font-bold mb-4">Critical Mistakes</h1>

          {/* Render input fields dynamically */}
          {mistakes.map((mistake, index) => (
            <div key={index} className="mb-4 flex items-center">
              <span className="mr-2">{index + 1}.</span>
              <input
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                value={mistake}
                onChange={(e) => handleMistakeChange(e.target.value, index)}
                placeholder="Enter a critical mistake"
                className="flex-1 p-2 border rounded"
              />
            </div>
          ))}

          {/* Add a new mistake */}
          <button
            onClick={addNewMistake}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            + Add Another Mistake
          </button>

          {/* Remove the last mistake */}
          <button
            onClick={deleteLastMistake}
            className={`px-4 py-2 rounded ${
              mistakes.length === 1 ? 'bg-gray-300' : 'bg-red-500 text-white'
            }`}
            disabled={mistakes.length === 1}
          >
            - Delete Last Mistake
          </button>

          {/* Next button */}
          <button
            onClick={handleNext}
            className="bg-green-500 text-white px-4 py-2 rounded mt-4 block w-full"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
