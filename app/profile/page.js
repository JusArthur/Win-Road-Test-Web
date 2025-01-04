'use client';

import React, { useEffect, useState } from 'react';
import supabase from '../../lib/supabase'; 

// 头像资源，可以改成你项目中的路径
const avatars = [
  '/images/avatars/bear_profile.png',
  '/images/avatars/cat_profile.png',
  '/images/avatars/deer_profile.png',
  '/images/avatars/dog_profile.png',
  '/images/avatars/wolf_profile.png',
];

export default function ProfilePage() {
  const [user, setUser] = useState(null);               // 当前登录用户信息
  const [displayName, setDisplayName] = useState('');   // 显示的昵称
  const [email, setEmail] = useState('');               // 邮箱
  const [editing, setEditing] = useState(false);        // 是否处于编辑模式
  const [newUsername, setNewUsername] = useState('');   // 编辑输入的新昵称
  const [currentAvatar, setCurrentAvatar] = useState(null); // 当前头像
  const [avatarModalOpen, setAvatarModalOpen] = useState(false); // 是否打开头像选择弹窗

  // 1. 页面加载时，获取当前登录用户，并从 profiles 表获取用户信息
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error('Error getting user:', error.message);
        return;
      }

      if (user) {
        // 设置本地状态
        setUser(user);
        setEmail(user.email);

        // 从 profiles 表获取 display_name、avatar 等
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('display_name, avatar')
          .eq('id', user.id)  // 确认跟你数据库字段一致
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError.message);
          setDisplayName('Anonymous');
        } else {
          setDisplayName(profile.display_name || 'Anonymous');
          // 如果 avatar 不为空，则从 avatars[] 中取对应索引
          if (profile.avatar !== null && avatars[profile.avatar]) {
            setCurrentAvatar(avatars[profile.avatar]);
          }
        }
      }
    };

    fetchUser();
  }, []);

  // 2. 点击“编辑”按钮 -> 进入编辑模式
  const handleEdit = () => {
    setNewUsername(displayName === 'Anonymous' ? '' : displayName);
    setEditing(true);
  };

  // 3. 保存新用户名，同时更新 Supabase Auth、profiles 表、以及 post 表中 username
  const handleSave = async () => {
    if (!newUsername.trim()) {
      alert('用户名不能为空！');
      return;
    }
    try {
      // 3.1 更新 Auth 用户元数据（可选，看你是否要在 user_metadata 里存储）
      const { error: updateUserError } = await supabase.auth.updateUser({
        data: { displayName: newUsername.trim() },
      });
      if (updateUserError) throw updateUserError;

      // 3.2 更新 profiles 表
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ display_name: newUsername.trim() })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // 3.3 同步更新 post 表里的 username 字段
      // 如果你 post 表里字段不是 username，而是别的名称，可以改一下
      const { data, error: postError } = await supabase
        .from('post')
        .update({ username: newUsername.trim() })
        .eq('user_id', user.id);

      if (postError) throw postError;

      console.log('Updated post records:', data);

      // 本地更新
      setDisplayName(newUsername.trim());
      setEditing(false);
      alert('用户名已更新，并与帖子同步！');
    } catch (error) {
      console.error('Error updating username:', error.message);
      alert('更新失败：' + error.message);
    }
  };

  // 4. 取消编辑
  const handleCancel = () => {
    setEditing(false);
    setNewUsername('');
  };

  // 5. 打开/关闭头像选择弹窗
  const toggleAvatarModal = () => {
    setAvatarModalOpen(!avatarModalOpen);
  };

  // 6. 选择并更新头像
  const handleAvatarChange = async (avatarIndex) => {
    if (!user) return;
    try {
      // 更新数据库里的 avatar 字段
      const { error } = await supabase
        .from('profiles')
        .update({ avatar: avatarIndex })
        .eq('id', user.id);

      if (error) throw error;

      // 更新本地状态
      setCurrentAvatar(avatars[avatarIndex]);
      setAvatarModalOpen(false);
      alert('头像已更新！');
    } catch (error) {
      console.error('Error updating avatar:', error.message);
      alert('更新头像失败：' + error.message);
    }
  };

  // 如果用户尚未登录
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg mb-4">请先登录或注册来查看个人资料。</p>
        {/* 这里可以放你的登录/注册按钮或链接 */}
      </div>
    );
  }

  // 如果用户已登录，渲染资料页面
  return (
    <div className="max-w-xl mx-auto mt-6 px-4">
      <h1 className="text-2xl font-bold mb-4 text-center">个人资料</h1>
      {/* 头像部分 */}
      <div className="flex flex-col items-center mb-6">
        {currentAvatar ? (
          <img
            src={currentAvatar}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover cursor-pointer"
            onClick={toggleAvatarModal}
          />
        ) : (
          <div
            className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
            onClick={toggleAvatarModal}
          >
            <span className="text-white">No Avatar</span>
          </div>
        )}

        {/* 头像选择弹窗 */}
        {avatarModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded shadow-md w-80">
              <h2 className="text-lg font-bold mb-2 text-center">选择头像</h2>
              <div className="grid grid-cols-3 gap-2 place-items-center">
                {avatars.map((avatar, index) => (
                  <img
                    key={index}
                    src={avatar}
                    alt="Avatar Option"
                    className={`w-16 h-16 rounded-full object-cover cursor-pointer 
                      ${currentAvatar === avatar ? 'ring-2 ring-blue-500' : ''}
                    `}
                    onClick={() => handleAvatarChange(index)}
                  />
                ))}
              </div>
              <button
                className="w-full mt-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                onClick={toggleAvatarModal}
              >
                取消
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 用户名编辑区域 */}
      <div className="flex flex-col items-center">
        {editing ? (
          <div className="flex flex-col items-center">
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="border rounded px-2 py-1"
              placeholder="输入新用户名"
            />
            <div className="mt-2 flex space-x-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                保存
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                取消
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center">
            <p className="text-xl font-semibold">{displayName}</p>
            <button
              onClick={handleEdit}
              className="ml-2 text-blue-500 hover:text-blue-600"
            >
              编辑
            </button>
          </div>
        )}
      </div>

      {/* 邮箱展示 */}
      <p className="text-center text-gray-600 mt-2">{email}</p>

      {/* 这里可以放更多的个人资料信息，比如介绍、账户信息等 */}
      <div className="mt-8 flex flex-col space-y-2 items-center">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => alert('这里可以跳转到我的帖子页面')}
        >
          我的帖子
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => alert('这里可以跳转到关于页面')}
        >
          关于
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => alert('这里可以跳转到更多信息页面')}
        >
          更多信息
        </button>
      </div>
    </div>
  );
}
