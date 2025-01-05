'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase'; // 确保路径正确

export default function ExamInfo() {
  const router = useRouter();

  // State 管理
  const [selectedLocation, setSelectedLocation] = useState(null); // 改为 `null`
  const [locations, setLocations] = useState([]);
  const [date, setDate] = useState('');
  const [examResult, setExamResult] = useState('');
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const [error, setError] = useState({ location: '', date: '', examResult: '' });

  // 从 Supabase 获取 locations
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

  // 处理地点选择
  const handleLocationSelect = (locationId) => {
    setSelectedLocation(Number(locationId)); // 转换为数字
    setError((prev) => ({ ...prev, location: '' }));
    setShowLocationPicker(false);
  };

  // 处理考试结果选择
  const handleExamResult = (result) => {
    setExamResult(result);
    setError((prev) => ({ ...prev, examResult: '' }));
  };

  // 验证并跳转到下一步
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

    if (!examResult) {
      errors.examResult = 'Please select an exam result.';
      isValid = false;
    }

    setError(errors);

    if (isValid) {
      // 保存到 localStorage
      const formData = {
        selectedLocation,
        date,
        examResult,
      };

      localStorage.setItem('examInfo', JSON.stringify(formData));
      router.push('/new-post/MinimalMistakes');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Exam Info</h1>

      {/* 地点选择器 */}
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

      {/* 日期选择器 */}
      <div className="mb-4">
        <label className="block font-medium mb-2">Exam Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]} // 限制为今天或更早日期
          className={`w-full p-2 border rounded ${
            error.date ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {error.date && <p className="text-red-500 text-sm mt-1">{error.date}</p>}
      </div>

      {/* 考试结果选择器 */}
      <div className="mb-4">
        <label className="block font-medium mb-2">Exam Result</label>
        <div className="flex space-x-4">
          {['Pass', 'Fail'].map((result) => (
            <button
              key={result}
              onClick={() => handleExamResult(result)}
              className={`p-2 rounded border ${
                examResult === result
                  ? 'bg-green-500 text-white border-green-500'
                  : 'bg-gray-200 text-black border-gray-300'
              }`}
            >
              {result}
            </button>
          ))}
        </div>
        {error.examResult && <p className="text-red-500 text-sm mt-1">{error.examResult}</p>}
      </div>

      {/* 地点选择弹窗 */}
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

      {/* 下一步按钮 */}
      <button
        onClick={validateAndProceed}
        className="bg-green-500 text-white w-full p-2 rounded mt-4"
      >
        Next
      </button>
    </div>
  );
}
