import React from 'react';
import Navbar from './navbar/Navbar';
import Sidebar from './navbar/Sidebar';  // Updated import path
import { useAuth } from '../context/AuthContext';

function Layout({ children }) {
  const { isAuth } = useAuth();

  return (
    <div>
      <Navbar />
      {isAuth && <Sidebar />}
      <main className={`pt-16 ${isAuth ? 'ml-64' : ''}`}>
        {children}
      </main>
    </div>
  );
}

export default Layout;