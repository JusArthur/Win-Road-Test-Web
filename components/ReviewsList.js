'use client';

import { useState, useEffect } from 'react';
import ReviewItem from '@/components/ReviewItem';
import { fetchPostData } from '@/lib/fetchPostData';

export default function ReviewsList({ items, isDeletable, onDelete, user }) {
  const [locations, setLocations] = useState({});
  const [ethnicities, setEthnicities] = useState({});
  const [genders, setGenders] = useState({});
  const [speeds, setSpeeds] = useState({});
  const [attitudes, setAttitudes] = useState({});
  const [examResults, setExamResults] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // 头像数组
  const avatars = [
    '/images/avatars/bear_profile.png',
    '/images/avatars/cat_profile.png',
    '/images/avatars/deer_profile.png',
    '/images/avatars/dog_profile.png',
    '/images/avatars/wolf_profile.png',
  ];

  // 加载映射数据
  useEffect(() => {
    const loadData = async () => {
      try {
        const {
          ethnicitiesMap,
          locationsMap,
          gendersMap,
          speedsMap,
          attitudesMap,
          resultsMap,
        } = await fetchPostData();

        setLocations(locationsMap);
        setEthnicities(ethnicitiesMap);
        setGenders(gendersMap);
        setSpeeds(speedsMap);
        setAttitudes(attitudesMap);
        setExamResults(resultsMap);
      } catch (error) {
        console.error('Error loading post data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // 渲染单条 ReviewItem
  const renderReview = (item) => {
    const locationName = locations[item.location_id] || 'Unknown Location';
    const examinerEthnicity = ethnicities[item.examiner_ethnicity_id] || 'Unknown Ethnicity';
    const examinerGender = genders[item.examiner_gender_id] || 'Unknown Gender';
    const examinerSpeed = speeds[item.examiner_speed_id] || 'Unknown Speed';
    const examResult = examResults[item.exam_result_id] || 'No Result';

    // 映射考官态度
    const examinerAttitudes = (item.examiner_attitude_ids || []).map(
      (id) => attitudes[id] || 'Unknown Attitude'
    );

    // 拼接考官详细信息
    const examinerDetails = [
      examinerEthnicity,
      examinerGender,
      `Speaking ${examinerSpeed}`,
      ...examinerAttitudes,
    ].join(', ');

    // 分配头像
    const avatarIndex =
      typeof item.profiles?.avatar === 'number' &&
      item.profiles?.avatar >= 0 &&
      item.profiles?.avatar < avatars.length
        ? item.profiles?.avatar
        : Math.floor(Math.random() * avatars.length);

    return (
      <ReviewItem
        key={item.id}
        id={item.id}
        username={item.username}
        locationName={locationName}
        date={item.exam_date}
        numAttempt={item.num_attempt}
        examResult={examResult}
        minimalMistake={item.minimal_mistakes}
        criticalMistake={item.critical_mistakes}
        examiner={examinerDetails}
        tips={item.tips}
        isDeletable={isDeletable}
        onDelete={onDelete}
        avatar={avatarIndex}
        initialLikes={item.likes}
        user={user}
      />
    );
  };

  // 加载中状态
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="loader mb-4" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // 当没有评论时的显示
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">No Posts right now</p>
        <p className="text-gray-400 text-sm">Be the first one to post！</p>
      </div>
    );
  }

  // 显示评论列表
  return (
    <div className="grid grid-cols-1 gap-4 whitespace-pre-line">
      {items.map((item) => renderReview(item))}
    </div>
  );
}
