'use client';

import { useState, useEffect } from 'react';
import supabase from '../lib/supabase';
import CategoryGridTile from '../components/CategoryGridTile';
import HeaderBar from '@/components/HeaderBar';
import { useRouter } from 'next/navigation';
import FloatingActionButton from '@/components/FloatingActionButton';

const locationImages = {
  1: '/images/locations/st_mary.jpg',
  2: '/images/locations/main_st.jpg',
  3: '/images/locations/bison.jpg',
  4: '/images/locations/gateway.jpg',
  5: '/images/locations/king_edward.jpg',
};

export default function Home() {
  const [locations, setLocations] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchLocations = async () => {
      const { data, error } = await supabase.from('test_location').select();
      if (!error) setLocations(data);
    };
    fetchLocations();
  }, []);

  const handlePress = (id) => {
    router.push(`/posts?id=${id}`); // Pass the location id as parameter
  };

  return (
    <div>
      <HeaderBar />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 w-full max-w-screen-lg">
          {locations.map((location) => (
            <CategoryGridTile
              key={location.location_id}
              location={location.location_name}
              imgUrl={locationImages[location.location_id] || '/images/default.jpg'}
              onClick={() => handlePress(location.location_id)}
            />
          ))}
        </div>
      </div>
      <FloatingActionButton />
    </div>
  );
}
