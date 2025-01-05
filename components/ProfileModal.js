import React, { useEffect, useState } from 'react';
import supabase from '@/lib/supabase';

const avatars = [
  '/images/avatars/bear_profile.png',
  '/images/avatars/cat_profile.png',
  '/images/avatars/deer_profile.png',
  '/images/avatars/dog_profile.png',
  '/images/avatars/wolf_profile.png',
];

export default function ProfileModal({ onClose }) {
  const [user, setUser] = useState(null); // 当前用户信息
  const [displayName, setDisplayName] = useState(''); // 显示的昵称
  const [editing, setEditing] = useState(false); // 编辑模式
  const [newUsername, setNewUsername] = useState(''); // 新用户名
  const [currentAvatar, setCurrentAvatar] = useState(null); // 当前头像
  const [avatarModalOpen, setAvatarModalOpen] = useState(false); // 头像弹窗状态

  // load user data
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user) {
        setUser(user);

        // load msgs from profile table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('display_name, avatar')
          .eq('id', user.id)
          .single();

        if (!profileError) {
          setDisplayName(profile.display_name || 'Anonymous');
          setCurrentAvatar(avatars[profile.avatar] || null);
        }
      }
    };

    fetchUser();
  }, []);

  // 保存新用户名
  const handleSaveUsername = async () => {
    if (!newUsername.trim()) {
      alert('Username can not be null！');
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: newUsername.trim() })
        .eq('id', user.id);

      if (error) throw error;

      setDisplayName(newUsername.trim());
      setEditing(false);
      alert('Username updated！');
    } catch (error) {
      console.error('Error updating username:', error.message);
      alert('Error occurred when updating username：' + error.message);
    }
  };

  // 选择头像
  const handleAvatarChange = async (avatarIndex) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar: avatarIndex })
        .eq('id', user.id);

      if (error) throw error;

      setCurrentAvatar(avatars[avatarIndex]);
      setAvatarModalOpen(false);
      alert('Avatar updated！');
    } catch (error) {
      console.error('Error updating avatar:', error.message);
      alert('Error occurred：' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-96 p-6 rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✕
        </button>
        {/* 更亮的标题 */}
        <h2 className="text-2xl font-extrabold text-center mb-4 text-black">Profile</h2>
  
        {/* 用户头像部分 */}
        <div className="flex flex-col items-center mb-6">
          {currentAvatar ? (
            <img
              src={currentAvatar}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover cursor-pointer"
              onClick={() => setAvatarModalOpen(true)}
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
              onClick={() => setAvatarModalOpen(true)}
            >
              <span className="text-white">No Avatar</span>
            </div>
          )}
        </div>
  
        {/* Display username */}
        <div className="flex flex-col items-center">
          {editing ? (
            <div className="flex flex-col items-center">
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="border rounded px-2 py-1 w-full text-black"
                placeholder="Enter new username"
              />
              <div className="mt-2 flex space-x-2">
                <button
                  onClick={handleSaveUsername}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancle
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              {/* 更亮的用户名 */}
              <p className="text-xl font-bold text-black">{displayName}</p>
              <button
                onClick={() => setEditing(true)}
                className="ml-2 text-blue-500 hover:text-blue-600"
              >
                Edit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
}
