'use client';

import { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';

export default function LikeButton({ initialLikes = 0, user, postId }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);

  // 检查用户是否已点赞
  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!user) return;

      const { data: post, error } = await supabase
        .from('post')
        .select('liked_by_users')
        .eq('id', postId)
        .single();

      if (error) {
        console.error('Error fetching like status:', error);
        return;
      }

      const likedByUsers = post?.liked_by_users || [];
      setIsLiked(likedByUsers.includes(user.id));
    };

    fetchLikeStatus();
  }, [user, postId]);

  // 点赞/取消点赞逻辑
  const handleLike = async () => {
    if (!user) {
      alert('请先登录才能点赞！');
      return;
    }

    try {
      const { data: post, error: fetchError } = await supabase
        .from('post')
        .select('liked_by_users, likes')
        .eq('id', postId)
        .single();

      if (fetchError) {
        console.error('Error fetching post data:', fetchError);
        return;
      }

      const likedByUsers = post?.liked_by_users || [];
      let updatedLikes = likes;

      if (isLiked) {
        // 取消点赞
        const updatedLikedByUsers = likedByUsers.filter((id) => id !== user.id);

        const { error: unlikeError } = await supabase
          .from('post')
          .update({
            liked_by_users: updatedLikedByUsers,
            likes: post.likes - 1,
          })
          .eq('id', postId);

        if (unlikeError) {
          console.error('Error unliking post:', unlikeError);
          return;
        }

        updatedLikes -= 1;
        setIsLiked(false);
      } else {
        // 点赞
        const updatedLikedByUsers = [...likedByUsers, user.id];

        const { error: likeError } = await supabase
          .from('post')
          .update({
            liked_by_users: updatedLikedByUsers,
            likes: post.likes + 1,
          })
          .eq('id', postId);

        if (likeError) {
          console.error('Error liking post:', likeError);
          return;
        }

        updatedLikes += 1;
        setIsLiked(true);
      }

      setLikes(updatedLikes);
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`flex items-center space-x-2 px-4 py-2 rounded ${
        isLiked ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
      }`}
    >
      <span className={`text-sm font-semibold ${isLiked ? 'text-white' : 'text-gray-600'}`}>
        {isLiked ? '已点赞' : '点赞'}
      </span>
      <span className="text-sm">{likes}</span>
    </button>
  );
}
