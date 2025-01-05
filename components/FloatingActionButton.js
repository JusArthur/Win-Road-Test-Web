'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase'; // 确保路径正确

const FloatingActionButton = () => {
  const [user, setUser] = useState(null); // 检测用户状态
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // 控制登录弹窗
  const [isRegisterMode, setIsRegisterMode] = useState(false); // 控制是否为注册模式
  const [email, setEmail] = useState(''); // 用户输入的邮箱
  const [password, setPassword] = useState(''); // 用户输入的密码
  const [loading, setLoading] = useState(false); // 按钮加载状态
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    checkUser();

    const { subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => {
      if (typeof subscription === 'function') {
        subscription();
      }
    };
  }, []);

  const handleButtonClick = () => {
    if (user) {
      router.push('/new-post/ExamInfo');
    } else {
      setIsLoginModalOpen(true);
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
        setIsLoginModalOpen(false);
        window.location.reload();
      }
    } catch (error) {
      console.error('Unexpected error during login:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert('Registration failed: ' + error.message);
      } else {
        alert('Registration successful! Please check your email to authorize you.');
        setIsRegisterMode(false); // 切换回登录模式
      }
    } catch (error) {
      console.error('Unexpected error during registration:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 悬浮按钮 */}
      <div
        onClick={handleButtonClick}
        className={`fixed bottom-6 right-6 w-14 h-14 ${
          user ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400'
        } rounded-full flex items-center justify-center shadow-lg cursor-pointer`}
      >
        <span className="text-white text-2xl">+</span>
      </div>

      {/* 登录/注册弹窗 */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-80 p-6 rounded-lg shadow-md relative">
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">
              {isRegisterMode ? 'Register' : 'Login'}
            </h2>
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
              onClick={isRegisterMode ? handleRegister : handleLogin}
              className={`w-full py-2 rounded-lg text-white ${
                loading ? 'bg-gray-700' : 'bg-green-500 hover:bg-green-600'
              }`}
              disabled={loading}
            >
              {loading ? 'Processing...' : isRegisterMode ? 'Register' : 'Login'}
            </button>
            <p className="text-center text-sm mt-4">
              {isRegisterMode ? (
                <>
                  Already have an account?{' '}
                  <span
                    onClick={() => setIsRegisterMode(false)}
                    className="text-blue-500 cursor-pointer hover:underline"
                  >
                    Login
                  </span>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{' '}
                  <span
                    onClick={() => setIsRegisterMode(true)}
                    className="text-blue-500 cursor-pointer hover:underline"
                  >
                    Register
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingActionButton;
