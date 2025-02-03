import React, { useState, useEffect } from "react";
import Link from "next/link";
import supabase from "../lib/supabase";
import ProfileModal from "./ProfileModal";

export default function HeaderBar() {
  const [user, setUser] = useState(null); // 保存当前用户信息
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false); // 控制登录弹窗的显示
  const [isRegisterMode, setIsRegisterMode] = useState(false); // 是否为注册模式

  // 登录功能
  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert("Login failed: " + error.message);
      } else {
        setUser(user); // 设置当前用户信息
        setIsLoginOpen(false); // 关闭登录弹窗
      }
    } catch (error) {
      alert("An unexpected error occurred: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 注册功能
  const handleRegister = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert("Registration failed: " + error.message);
      } else {
        alert("Registration successful! Please log in.");
        setIsRegisterMode(false); // 切换回登录模式
      }
    } catch (error) {
      console.error("Unexpected error during registration:", error);
    } finally {
      setLoading(false);
    }
  };

  // 退出登录功能
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      alert("You have been logged out.");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // 页面加载时检查当前用户状态
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
    };

    fetchUser();
  }, []);

  return (
    <header className="w-full bg-white shadow-md px-4 py-3 flex justify-between items-center">
      {/* Logo 和标题部分 */}
      <Link href="/" className="flex items-center ml-10 cursor-pointer">
        <img
          src="/images/icon.png"
          alt="Win Road Test Logo"
          className="h-10 w-auto"
        />
        <h1 className="text-xl font-bold ml-2 text-gray-800 hover:text-blue-500 hidden md:block">
          Win Road Test!
        </h1>
      </Link>

      {/* Navigation Links */}
      <div className="flex-1 flex justify-center space-x-6">
        <Link 
          href="/about" 
          className="flex items-center px-4 py-2 text-gray-800 hover:text-blue-500 
                     transition-colors duration-200 rounded-lg hover:bg-blue-50
                     font-medium"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
            />
          </svg>
          About Us
        </Link>
      </div>

      {/* 登录或 Profile 和退出按钮 */}
      <div className="flex items-center space-x-2">
        {user ? (
          <>
            <button
              onClick={() => setIsProfileOpen(true)} // 打开弹窗
              className="px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsLoginOpen(true)} // 打开登录弹窗
              className="px-4 py-2 rounded-lg text-white bg-green-500 hover:bg-green-600"
            >
              Login
            </button>
          </>
        )}
      </div>

      {/* Profile 弹窗 */}
      {isProfileOpen && (
        <ProfileModal
          onClose={() => setIsProfileOpen(false)} // 关闭弹窗
        />
      )}

      {/* 登录/注册弹窗 */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-80 relative">
            <button
              onClick={() => setIsLoginOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">
              {isRegisterMode ? "Register" : "Login"}
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
                loading ? "bg-gray-700" : "bg-green-500 hover:bg-green-600"
              }`}
              disabled={loading}
            >
              {loading ? "Processing..." : isRegisterMode ? "Register" : "Login"}
            </button>
            <p className="text-center text-sm mt-4">
              {isRegisterMode ? (
                <>
                  Already have an account?{" "}
                  <span
                    onClick={() => setIsRegisterMode(false)}
                    className="text-blue-500 cursor-pointer hover:underline"
                  >
                    Login
                  </span>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{" "}
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
    </header>
  );
}
