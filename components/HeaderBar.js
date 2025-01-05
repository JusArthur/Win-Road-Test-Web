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
      }
    } catch (error) {
      alert("An unexpected error occurred: " + error.message);
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
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded-lg px-2 py-1 w-48 text-gray-800 placeholder-gray-500 text-lg"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded-lg px-2 py-1 w-48 text-gray-800 placeholder-gray-500 text-lg"
            />
            <button
              onClick={handleLogin}
              className={`px-4 py-2 rounded-lg text-white ${
                loading ? "bg-gray-700" : "bg-green-500 hover:bg-green-600"
              }`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
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
    </header>
  );
}
