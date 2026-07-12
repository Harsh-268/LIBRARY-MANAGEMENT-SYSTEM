import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    // min-h-screen ensures the container is always at least the height of the browser window
    // flex and flex-col allow us to push the footer to the bottom
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      {/* 1. The Header stays at the top */}
      <Header />

      
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* 3. The Footer stays at the bottom */}
      <Footer />
      
    </div>
  );
};

export default Layout;