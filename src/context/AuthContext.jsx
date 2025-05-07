// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    // initialize from localStorage once
    const token = localStorage.getItem('token');
    if (!token) return null;
    return {
      id: localStorage.getItem('userId'),
      username: localStorage.getItem('username'),
      email: localStorage.getItem('email'),
      roles: JSON.parse(localStorage.getItem('roles') || '[]'),
      profilePicUrl: localStorage.getItem('profilePicUrl') || '',
      token,
    };
  });

  const login = (data) => {
    // data = { token,id,username,email,roles,profilePicUrl }
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.id);
    localStorage.setItem('username', data.username);
    localStorage.setItem('email', data.email);
    localStorage.setItem('roles', JSON.stringify(data.roles));
    localStorage.setItem('profilePicUrl', data.profilePicUrl);
    setUser(data);
    // redirect
    if (data.roles.includes('ROLE_ADMIN')) navigate('/admin/profile');
    else navigate('/profile');
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/signin');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
