'use client';

import { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';
import ReviewsList from '@/components/ReviewsList';
import { useSearchParams } from 'next/navigation'; // 获取查询参数
import HeaderBar from '@/components/HeaderBar';

export default function PostsScreen() {
  const searchParams = useSearchParams();
  const locationId = searchParams.get('id'); // 获取地点 ID
  const [posts, setPosts] = useState([]);
  const [locationName, setLocationName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!locationId) return;

    const fetchData = async () => {
      setLoading(true);

      // 获取地点名称
      const { data: locationData, error: locationError } = await supabase
        .from('test_location')
        .select('location_name')
        .eq('location_id', locationId)
        .single();

      if (!locationError) setLocationName(locationData?.location_name || 'Unknown Location');

      // 获取地点相关的帖子
      const { data: postData, error: postError } = await supabase
        .from('post')
        .select('*, profiles (avatar)')
        .eq('location_id', locationId);

      if (!postError) setPosts(postData);

      setLoading(false);
    };

    fetchData();
  }, [locationId]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">加载中...</div>;
  }

  return (
    <>
    <HeaderBar />
    <div className="max-w-4xl mx-auto mt-6 p-4">
      <h1 className="text-2xl font-bold mb-4">{locationName}</h1>
      {posts.length > 0 ? (
        <ReviewsList items={posts} />
      ) : (
        <p className="text-gray-500">暂无帖子</p>
      )}
    </div>
    </>
  );
}
