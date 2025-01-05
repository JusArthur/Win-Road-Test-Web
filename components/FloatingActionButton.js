'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase'; // 确保路径正确

const FloatingActionButton = () => {
  const [user, setUser] = useState(null); // 检测用户状态
  const router = useRouter();

  useEffect(() => {
    // 获取当前用户
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    checkUser();

    // 监听登录状态变化
    const { subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user); // 更新用户状态
      } else {
        setUser(null); // 如果登出，清除用户状态
      }
    });

    // 清理订阅（根据 Supabase 文档最新方式）
    return () => {
      if (typeof subscription === 'function') {
        subscription(); // 如果是函数，直接调用清理订阅
      }
    };
  }, []);

  const handleButtonClick = () => {
    if (user) {
      router.push('/new-post/ExamInfo');
    } else {
      if (window.confirm('You need to log in to submit reviews. Do you want to log in?')) {
        router.push('/login');
      }
    }
  };

  return (
    <div
      onClick={handleButtonClick}
      className={`fixed bottom-6 right-6 w-14 h-14 ${
        user ? 'bg-green-500' : 'bg-gray-500 cursor-not-allowed'
      } rounded-full flex items-center justify-center shadow-lg`}
    >
      <span className="text-white text-2xl">+</span>
    </div>
  );
};

export default FloatingActionButton;
