'use client';

import { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';
import ReviewsList from '@/components/ReviewsList';
import { useSearchParams } from 'next/navigation'; 
import HeaderBar from '@/components/HeaderBar';

export default function PostsScreen() {
  const searchParams = useSearchParams();
  const locationId = searchParams.get('id'); 
  const [posts, setPosts] = useState([]);
  const [locationName, setLocationName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!locationId) return;

    const fetchData = async () => {
      setLoading(true);

      // Fetch location name
      const { data: locationData, error: locationError } = await supabase
        .from('test_location')
        .select('location_name')
        .eq('location_id', locationId)
        .single();

      if (!locationError) setLocationName(locationData?.location_name || 'Unknown Location');

      // Fetch location
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
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <>
    <HeaderBar />
    <div className="max-w-4xl mx-auto mt-6 p-4">
      <h1 className="text-2xl font-bold mb-4">{locationName}</h1>
      {posts.length > 0 ? (
        <ReviewsList items={posts} />
      ) : (
        <p className="text-gray-500">Here's no any posts yet. Be the first one!</p>
      )}
    </div>
    </>
  );
}
