'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase'; // 确保路径正确

const FloatingActionButton = () => {
  const [user, setUser] = useState(null); // 检测用户状态
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // 控制登录弹窗
  const [email, setEmail] = useState(''); // 用户输入的邮箱
  const [password, setPassword] = useState(''); // 用户输入的密码
  const [loading, setLoading] = useState(false); // 登录按钮加载状态
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

    // 清理订阅
    return () => {
      if (typeof subscription === 'function') {
        subscription(); // 如果是函数，直接调用清理订阅
      }
    };
  }, []);

  const handleButtonClick = () => {
    if (user) {
      router.push('/new-post/ExamInfo'); // 已登录，跳转到新帖页面
    } else {
      setIsLoginModalOpen(true); // 未登录，打开登录弹窗
    }
  };

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert('Login failed: ' + error.message);
      } else {
        setIsLoginModalOpen(false); // 关闭登录弹窗
        window.location.reload(); // 刷新页面以更新用户状态
      }
    } catch (error) {
      console.error('Unexpected error during login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 悬浮按钮 */}
      <div
        onClick={handleButtonClick} // 始终允许点击，未登录时打开登录弹窗
        className={`fixed bottom-6 right-6 w-14 h-14 ${
          user ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400'
        } rounded-full flex items-center justify-center shadow-lg cursor-pointer`}
      >
        <span className="text-white text-2xl">+</span>
      </div>

      {/* 登录弹窗 */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-80 p-6 rounded-lg shadow-md relative">
            <button
              onClick={() => setIsLoginModalOpen(false)} // 关闭弹窗
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Login</h2>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-gray-800 placeholder-gray-500"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-gray-800 placeholder-gray-500"
              />
            </div>
            <button
              onClick={handleLogin}
              className={`w-full py-2 rounded-lg text-white ${
                loading ? 'bg-gray-700' : 'bg-green-500 hover:bg-green-600'
              }`}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingActionButton;
