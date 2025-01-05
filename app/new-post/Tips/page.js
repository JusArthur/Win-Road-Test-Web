'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';
import HeaderBar from '@/components/HeaderBar';

export default function Tips() {
  const router = useRouter();

  const [tips, setTips] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [selectedLocation, setSelectedLocation] = useState('');
  const [date, setDate] = useState('');
  const [numAttempt, setNumAttempt] = useState('');
  const [examResult, setExamResult] = useState('');
  const [minimalMistakes, setMinimalMistakes] = useState([]);
  const [criticalMistakes, setCriticalMistakes] = useState([]);
  const [examinerReview, setExaminerReview] = useState({});

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user);
      } else {
        setUser(null);
        setErrorMessage('You need to log in to submit tips.');
      }
    };

    const loadLocalStorageData = () => {
      setSelectedLocation(localStorage.getItem('selectedLocation') || '');
      setDate(localStorage.getItem('date') || '');
      setNumAttempt(localStorage.getItem('numAttempt') || '');
      setExamResult(localStorage.getItem('examResult') || '');
      setMinimalMistakes(
        JSON.parse(localStorage.getItem('minimalMistakes') || '[]')
      );
      setCriticalMistakes(
        JSON.parse(localStorage.getItem('criticalMistakes') || '[]')
      );
      setExaminerReview(
        JSON.parse(localStorage.getItem('examinerImpression') || '{}')
      );
    };

    checkUser();
    loadLocalStorageData();
  }, []);

  const submitHandler = async () => {
    try {
      setLoading(true);

      if (!user) {
        throw new Error('User not logged in');
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        throw new Error('Profile not found');
      }

      const postData = {
        user_id: user.id,
        username: profile.display_name,
        location_id: Number(selectedLocation),
        exam_date: date,
        num_attempt: Number(numAttempt),
        exam_result_id: Number(examResult),
        minimal_mistakes: minimalMistakes,
        critical_mistakes: criticalMistakes,
        examiner_ethnicity_id: examinerReview.ethnicity,
        examiner_gender_id: examinerReview.gender,
        examiner_speed_id: examinerReview.speed,
        examiner_attitude_ids: examinerReview.attitudes,
        tips,
      };

      const { error } = await supabase.from('post').insert([postData]);

      if (error) {
        throw new Error('Error inserting data');
      }

      localStorage.clear();
      router.push('/');
    } catch (error) {
      console.error('Error:', error.message);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-6 flex justify-center">
        <div className="w-full max-w-screen-md bg-white rounded shadow">
          <h1 className="text-xl font-bold mb-4">Tips</h1>
          <p className="text-red-500">{errorMessage}</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            Log in
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-t-blue-500 rounded-full" />
        <p className="mt-4">Submitting...</p>
      </div>
    );
  }

  return (
    <>
      <HeaderBar />
      <div className="p-6 flex justify-center">
        <div className="w-full max-w-screen-md bg-white rounded shadow">
          <h1 className="text-xl font-bold mb-4">Tips</h1>
          <textarea
            value={tips}
            onChange={(e) => setTips(e.target.value)}
            placeholder="Enter your tips here"
            className="w-full p-2 border rounded h-32"
          />
          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
          <button
            onClick={submitHandler}
            disabled={loading || !tips.trim()}
            className={`bg-green-500 text-white px-4 py-2 rounded mt-4 ${
              !tips.trim() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
}
