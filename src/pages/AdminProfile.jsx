// src/pages/AdminProfile.jsx
import React, { useEffect, useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import Sidebar from '../components/Sidebar';

export default function AdminProfile() {
  const [adminData, setAdminData] = useState({
    id: '',
    username: '',
    email: '',
    bio: '',
    profilePicUrl: '',
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [previewPic, setPreviewPic] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState('');

  // Load current admin on mount
  useEffect(() => {
    async function loadMe() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8081/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const me = await res.json();
        if (res.ok) {
          setAdminData({
            id: me.id,
            username: me.username,
            email: me.email,
            bio: me.bio || '',
            profilePicUrl: me.profilePicUrl || '',
          });
        } else {
          setServerMessage(me);
        }
      } catch {
        setServerMessage('Failed to load profile.');
      }
    }
    loadMe();
  }, []);

  const validate = (field, val) => {
    if (field === 'username' && !val) return 'Username is required';
    if (field === 'email') {
      if (!val) return 'Email is required';
      if (!/\S+@\S+\.\S+/.test(val)) return 'Invalid email';
    }
    return '';
  };

  const handleBlur = e => {
    const err = validate(e.target.name, e.target.value);
    setErrors(prev => ({ ...prev, [e.target.name]: err }));
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setAdminData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setServerMessage('');
  };

  const handleFile = e => {
    const file = e.target.files[0];
    setProfilePicFile(file);
    if (file) setPreviewPic(URL.createObjectURL(file));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const newErr = {};
    ['username', 'email'].forEach(f => {
      const err = validate(f, adminData[f]);
      if (err) newErr[f] = err;
    });
    if (Object.keys(newErr).length) return setErrors(newErr);

    try {
      let picUrl = adminData.profilePicUrl;
      if (profilePicFile) {
        const storage = getStorage(app);
        const storageRef = ref(storage, `profiles/${adminData.id}-${Date.now()}`);
        await uploadBytes(storageRef, profilePicFile);
        picUrl = await getDownloadURL(storageRef);
      }

      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8081/api/users/${adminData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: adminData.username,
          email: adminData.email,
          bio: adminData.bio,
          profilePicUrl: picUrl,
          ...(password ? { password } : {}),
        }),
      });
      const result = await res.text();
      setServerMessage(result || 'Profile updated');
    } catch {
      setServerMessage('Server error, try again');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isAdmin={true} />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-semibold mb-6">Admin Profile</h1>
        {serverMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
            {serverMessage}
          </div>
        )}
        <div className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto space-y-6">
          {/* Avatar */}
          <div className="flex justify-center">
            <label className="relative cursor-pointer">
              <img
                src={
                  previewPic ||
                  adminData.profilePicUrl ||
                  'https://static.vecteezy.com/system/resources/previews/013/215/160/non_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-vector.jpg'
                }
                alt="avatar"
                className="w-28 h-28 rounded-full border-4 border-blue-600 object-cover shadow"
              />
              <input
                type="file"
                className="absolute inset-0 opacity-0"
                onChange={handleFile}
              />
            </label>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Username */}
              <div>
                <label className="block font-medium text-gray-700">Username</label>
                <input
                  name="username"
                  value={adminData.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mt-1 w-full p-2 border rounded ${
                    errors.username ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                )}
              </div>
              {/* Email */}
              <div>
                <label className="block font-medium text-gray-700">Email</label>
                <input
                  name="email"
                  type="email"
                  value={adminData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mt-1 w-full p-2 border rounded ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block font-medium text-gray-700">Bio</label>
              <textarea
                name="bio"
                value={adminData.bio}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-300 rounded h-24"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block font-medium text-gray-700">New Password</label>
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded"
                placeholder="Leave blank to keep current"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-10 text-gray-500"
              >
                {showPassword ? <HiEyeOff /> : <HiEye />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
            >
              Save Changes
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
