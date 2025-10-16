import React, { useEffect, useRef, useState } from "react";
import demoimg from "../images/dummy-image.jpg";
import { FaBars } from "react-icons/fa";
import { ToggleTheme } from "./ThemeToggle";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import ProgressBar from "../common/ProgressBar";
import { TfiAngleDoubleLeft } from "react-icons/tfi";
import { TfiAngleDoubleRight } from "react-icons/tfi";
const TopBar = ({ isSidebarOpenInLg, toggleSidebarInLg, toggleSidebar, title, loading = false }) => {
  const navigate = useNavigate();
  const { organizationName, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);
  const [justClosed, setJustClosed] = useState(false); // Track recent closure

  const toggleModal = () => {
    if (justClosed) return; // Prevent reopening immediately
    setIsOpen((prev) => !prev);
  };

  const handleLogout = () => {
    toast.success("Logged Out Successfully");
    logout()
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
        setJustClosed(true); // Set flag to prevent immediate reopening
        setTimeout(() => setJustClosed(false), 200); // Reset after 200ms
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`fixed top-0 left-0 right-0 transition-all duration-700 ease-in-out ${isSidebarOpenInLg && "lg:ml-[18rem]"}   z-[99] dark:bg-black bg-white `}>
      <div className="relative  font-medium px-5 py-3 flex justify-between items-center border-b-2 dark:border-white ">
        <div className="flex flex-wrap gap-5 items-center">
          <div onClick={toggleSidebar} className="lg:hidden block">
            <FaBars className='text-2xl cursor-pointer dark:text-white' />
          </div>
          <div onClick={toggleSidebarInLg} className="lg:block hidden ">
            {/* <HiBars3 className='text-2xl font-thin cursor-pointer dark:text-white' /> */}
            {isSidebarOpenInLg ? <>
              <TfiAngleDoubleLeft className='text-xl font-thin cursor-pointer dark:text-white' />
            </> : <>
              <TfiAngleDoubleRight className='text-xl font-thin cursor-pointer dark:text-white' />
            </>}
          </div>
          <h2 className="text-xl tracking-wider text-gray-600 dark:!text-white lg:block hidden">
            {organizationName ?? title}
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-5">
          <div>
            <ToggleTheme />
          </div>
          <div className="flex items-center gap-2 relative">
            <div className="mr-2">
              {/* <IoIosNotificationsOutline className="text-2xl cursor-pointer dark:text-white" /> */}
            </div>
            {/* <div className="w-[40px] h-[40px]">
              <img
                src={demoimg}
                className="w-full  rounded-full h-full overflow-hidden object-cover object-center cursor-pointer"
                alt=""
                onClick={toggleModal}
              />
            </div>
            <div
              ref={modalRef}
              className={`absolute  top-[110%] right-0 bg-white text-sm text-gray-700 w-48 py-2 z-50 border border-gray-300 rounded-md transition-all duration-300 dark:bg-black dark:text-white ${isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
                } `}
            >
              <h2 onClick={() => { navigate("/organization-profile") }} className="hover:bg-blue-100 hover:text-blue-600 px-3 py-1  cursor-pointer dark:hover:bg-blue-600 dark:hover:text-white">
                Organization Profile
              </h2>
              <h2 onClick={() => {navigate("/userProfile")}} className="px-3 py-1 hover:bg-blue-100 hover:text-blue-600 cursor-pointer dark:hover:bg-blue-600 dark:hover:text-white">
                User Profile
              </h2>
              <h2 onClick={handleLogout} className="px-3 py-1 hover:bg-blue-100 hover:text-blue-600 cursor-pointer dark:hover:bg-blue-600 dark:hover:text-white">
                Logout
              </h2>
            </div> */}
            {/*end of modal */}
          </div>
        </div>
        {loading && (
          <ProgressBar />
        )}
      </div>
    </div>
  );
};

export default TopBar;
