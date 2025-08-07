import { RxDashboard } from "react-icons/rx";
import { CiLogout } from "react-icons/ci";
import toast from "react-hot-toast";
import SidebarButton from "./SidebarButton";
import logo from "../images/logo3.jpeg";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import React from "react";
import axiosInstance from "../services/axios";
import {
  getOrganizationId,
  getRole,
  getOrganizationType,
} from "../utils/jwtUtils";

import { Roles } from "../constants/constants";
import EventSidebar from "./ServicesSidebar/admin/EventSidebar";
import OrganizerSidebar from "./ServicesSidebar/admin/OrganizerSidebar";
import OrganizerEventSidebar from "./ServicesSidebar/organizer/OrganizerEventSidebar";

function Sidebar({
  active,
  isSidebarOpenInLg,
  isSidebarOpen,
  activeSubMenu = null,
}) {
  const auth = useAuth();
  const accessToken = auth.accessToken;
  const role = getRole(accessToken);
  const orgType = getOrganizationType(accessToken);
  const apiKey = import.meta.env["VITE_IDENTITY_BASE_URL"];
  const { logout, orgLogo, setAccessToken, setLoading } = useAuth();
  const [openMenu, setOpenMenu] = useState(null);
  const handleLogout = () => {
    toast.success("Logged Out Successfully");
    logout();
  };
  const toggleSubmenu = (index) => {
    setOpenMenu(openMenu === index ? null : index);
  };
  return (
    <>
      <aside
        id="default-sidebar"
        className={`fixed  top-0 lg:left-0  ${
          isSidebarOpen ? "left-0" : "-left-full"
        } ${
          isSidebarOpenInLg
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0"
        } lg:w-[18rem]  w-[70%] h-screen bg-white dark:bg-black transition-all lg:duration-700 lg:ease-in-out duration-500  ease-linear z-[999] `}
        aria-label="Sidebar"
      >
        <div className=" flex flex-col h-full px-3 py-4 pt-1">
          <div className="p-2 flex items-center lg:justify-center gap-2 text-blue-600 dark:text-white my-4">
            {/* <IoLogoBuffer className="text-5xl" /> */}
            <div className="w-20 h-20">
              <img
                src={orgLogo || logo}
                className="w-full h-full object-cover object-center rounded-full"
                alt="Organization Logo"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = logo;
                }}
              />
            </div>
          </div>
          <div className="flex-1 overflow-auto no-scrollbar">
            <ul className="space-y-2 font-medium mt-5">
              {role == Roles.Admin && (
                <>
                  <li>
                    <SidebarButton
                      page="dashboard"
                      activePage={active}
                      route="/admin/dashboard"
                    >
                      <RxDashboard className="text-lg" />
                      <span className="ms-3">Dashboard</span>
                    </SidebarButton>
                  </li>
                  <li>
                    <EventSidebar
                      active={active}
                      activeSubMenu={activeSubMenu}
                      openMenu={openMenu}
                      toggleSubmenu={toggleSubmenu}
                    />
                  </li>
                  <li>
                    <OrganizerSidebar
                      active={active}
                      activeSubMenu={activeSubMenu}
                      openMenu={openMenu}
                      toggleSubmenu={toggleSubmenu}
                    />
                  </li>
                </>
              )}

              {role == Roles.Organizer && (
                <>
                  <li>
                    <SidebarButton
                      page="dashboard"
                      activePage={active}
                      route="/organizer/dashboard"
                    >
                      <RxDashboard className="text-lg" />
                      <span className="ms-3">Dashboard</span>
                    </SidebarButton>
                  </li>
                  <li>
                    <OrganizerEventSidebar
                      active={active}
                      activeSubMenu={activeSubMenu}
                      openMenu={openMenu}
                      toggleSubmenu={toggleSubmenu}
                    />
                  </li>
                </>
              )}

              <li>
                <a
                  onClick={handleLogout}
                  className="flex items-center p-2 rounded-lg  hover:bg-blue-100 group hover:text-blue-600 text-gray-500 cursor-pointer text-sm dark:text-gray-100 dark:hover:bg-blue-700 "
                >
                  <CiLogout className="text-xl" />
                  <span className="ms-3">Log out</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
}

export default React.memo(Sidebar);
