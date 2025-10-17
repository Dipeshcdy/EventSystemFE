import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import logo from "../../../images/logo3.jpeg";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";
import ProgressBar from "../../../common/ProgressBar";
import { MdArrowDropDown } from "react-icons/md";
const Nav = () => {
  const { accessToken, handleRedirect, logout, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [userLocation, setUserLocation] = useState({
    lat: null,
    lng: null,
  });

  useEffect(() => {
    const storedLocation = localStorage.getItem("userLocation");
    if (storedLocation) {
      setUserLocation(JSON.parse(storedLocation));
    } else {
      requestLocation();
    }
  }, []);

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          localStorage.setItem("userLocation", JSON.stringify(location));
        },
        (error) => {
          console.error("Error getting location:", error);
          // fallback coordinates
          setUserLocation(fallback);
          localStorage.setItem("userLocation", JSON.stringify(fallback));
        }
      );
    } else {
      // fallback if geolocation not supported
      const fallback = { lat: 27.7172, lng: 85.3240 };
      setUserLocation(fallback);
      localStorage.setItem("userLocation", JSON.stringify(fallback));
    }
  };

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

  const handleLogout = () => {
    toast.success("Logged Out Successfully");
    logout();
  };
  return (
    <>
      {/* overlay */}
      <div
        onClick={toggleSidebar}
        className={`fixed left-0 top-0 w-full h-full z-[998] bg-gray-600 bg-opacity-50 transition-all duration-300 ease-linear  ${isSidebarOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0  pointer-events-none"
          } `}
      ></div>
      {/*end of overlay */}

      {/* navbar */}
      <div
        className={`flex justify-between items-center sticky top-0 z-50 left-0 right-0 md:px-20 px-10 py-4 bg-[#227ec0] `}
      >
        <div className="w-10 h-10">
          <img
            src={logo}
            className="w-full h-full object-center object-cover"
            alt=""
          />
        </div>

        <div className="md:block hidden">
          <ul className="flex items-center gap-10 text-white text-lg font-semibold font-sans">
            <li><Link to="/">Home</Link></li>
            {/* Events Dropdown */}
            <li className="group 2xl:text-lg p-2 rounded relative list-none">
              <p className="flex items-center text-white cursor-pointer">
                <span>Events</span>
                <MdArrowDropDown className="text-2xl" />
              </p>

              <ul className="absolute top-10 text-black cursor-pointer border bg-white w-56 pb-2 z-[999] hidden group-hover:block">
                <li className="pl-4 hover:bg-gray-100 hover:text-primary py-2 mt-2">
                  <Link to="/upcoming-events">Upcoming Events</Link>
                </li>
                <li className="pl-4 hover:bg-gray-100 hover:text-primary py-2 mt-2">
                  <Link to="/ongoing-events">Ongoing Events</Link>
                </li>
                <li className="pl-4 hover:bg-gray-100 hover:text-primary py-2 mt-2">
                  <Link to="/past-events">Past Events</Link>
                </li>
                <li className="pl-4 hover:bg-gray-100 hover:text-primary py-2 mt-2">
                  <Link to="/events-near-you">Events Near You</Link>
                </li>
                <li className="pl-4 hover:bg-gray-100 hover:text-primary py-2 mt-2">
                  <Link to="/recommended-events">Events You May Like</Link>
                </li>
              </ul>

              <div className="absolute h-[3px] w-[0%] group-hover:w-[100%] bg-primary duration-500"></div>
            </li>
            <li>
              <Link to="/mytickets">Tickets</Link>
            </li>
          </ul>
        </div>
        <div className="hidden gap-5 md:flex">
          {accessToken ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 duration-300 transition-all ease-linear"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 bg-white text-black rounded-xl hover:bg-gray-200 duration-300 transition-all ease-linear"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-[#28a5ff] text-white rounded-xl hover:bg-[#3fa5ed] duration-300 transition-all ease-linear"
              >
                Register
              </Link>
            </>
          )}
        </div>
        <div onClick={toggleSidebar} className="lg:hidden block ">
          <FaBars className="text-2xl cursor-pointer text-white" />
        </div>

        {loading && (
          <ProgressBar />
        )}
      </div>

      {/* mobile nav */}
      <div
        className={`fixed  top-0  w-[70%] h-screen z-[999] bg-[#227ec0] px-10 py-4 pt-32 transition-all duration-500 ease-linear ${isSidebarOpen ? "left-0" : "-left-full"
          }`}
      >
        <div className="block">
          <ul className="flex flex-col  gap-2 text-white text-lg font-semibold font-sans">
            <li><Link to="/">Home</Link></li>
            {/* Events Dropdown */}
            <li className="group 2xl:text-lg p-2 rounded relative list-none">
              <p className="flex items-center text-white cursor-pointer">
                <span>Events</span>
                <MdArrowDropDown className="text-2xl" />
              </p>

              <ul className="absolute top-10 text-black cursor-pointer border bg-white w-56 pb-2 z-[999] hidden group-hover:block">
                <li className="pl-4 hover:bg-gray-100 hover:text-primary py-2 mt-2">
                  <Link to="/upcoming-events">Upcoming Events</Link>
                </li>
                <li className="pl-4 hover:bg-gray-100 hover:text-primary py-2 mt-2">
                  <Link to="/ongoing-events">Ongoing Events</Link>
                </li>
                <li className="pl-4 hover:bg-gray-100 hover:text-primary py-2 mt-2">
                  <Link to="/past-events">Past Events</Link>
                </li>
                <li className="pl-4 hover:bg-gray-100 hover:text-primary py-2 mt-2">
                  <Link to="/events-near-you">Events Near You</Link>
                </li>
                <li className="pl-4 hover:bg-gray-100 hover:text-primary py-2 mt-2">
                  <Link to="/recommended-events">Events You May Like</Link>
                </li>
              </ul>

              <div className="absolute h-[3px] w-[0%] group-hover:w-[100%] bg-primary duration-500"></div>
            </li>
            <li>
              <Link to="/mytickets">Tickets</Link>
            </li>
          </ul>
        </div>
        <div className="flex gap-5 mt-5">
          <Link
            to="/login"
            className="px-4 py-2 bg-white text-black rounded-xl hover:bg-gray-200 duration-300 transition-all ease-linear"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-[#28a5ff] text-white rounded-xl hover:bg-[#3fa5ed] duration-300 transition-all ease-linear"
          >
            Register
          </Link>
        </div>
      </div>
      {/*end of mobile nav */}
      {/*end of navbar */}
    </>
  );
};

export default Nav;
