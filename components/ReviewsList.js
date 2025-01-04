'use client';

import { useState, useEffect } from 'react';
import ReviewItem from '@/components/ReviewItem'; // 确保路径正确
import supabase from '@/lib/supabase';

export default function ReviewsList({ items }) {
  const [isLoading, setIsLoading] = useState(false);
  const [reviews, setReviews] = useState(items || []);

  useEffect(() => {
    if (items && items.length > 0) {
      setReviews(items);
    }
  }, [items]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">加载中...</p>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-500">暂无评论</p>
        <p className="text-gray-400">成为第一个留下评论的人！</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {reviews.map((review) => (
        <ReviewItem key={review.id} {...review} />
      ))}
    </div>
  );
}
