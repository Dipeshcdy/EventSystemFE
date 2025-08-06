import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import ChatbotWidget from './ChatBotWidget';
import TopBar from './TopBar';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const Layout = () => {
  const { activePage, activeSubMenu, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarOpenInLg, setIsSidebarOpenInLg] = useState(true);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }
   const toggleSidebarInLg = () => {
    setIsSidebarOpenInLg(!isSidebarOpenInLg);
  }
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden"; // Disable background scrolling
    } else {
      document.body.style.overflow = ""; // Re-enable background scrolling
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);
  return (
    <>
      <Sidebar active={activePage} isSidebarOpenInLg={isSidebarOpenInLg} isSidebarOpen={isSidebarOpen} activeSubMenu={activeSubMenu} />
      <div className=''>
        <div onClick={toggleSidebar} className={`fixed left-0 top-0 w-full h-full z-[998] bg-gray-600 bg-opacity-50 transition-all duration-300 ease-linear  ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0  pointer-events-none"} `}>
        </div>
        <TopBar isSidebarOpenInLg={isSidebarOpenInLg} toggleSidebarInLg={toggleSidebarInLg} toggleSidebar={toggleSidebar} title="Welcome to Restaurant POS System" loading={loading} />
        <div className={`transition-all duration-700 ease-in-out ${isSidebarOpenInLg && "lg:ml-[18rem]"}`}>
          <div className={`py-5 px-5 pt-20 relative min-h-screen dark:bg-black dark:!text-white `}>
            <Outlet />
          </div>
        </div>
      </div>
      <ChatbotWidget />
    </>
  );
};

export default Layout;
