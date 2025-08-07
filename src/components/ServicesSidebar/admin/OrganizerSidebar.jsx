import SidebarButton from "../../SidebarButton";
import { IoIosArrowDown } from "react-icons/io";
import { MdEditDocument } from "react-icons/md";
import { LuChartNoAxesCombined } from "react-icons/lu";

const OrganizerSidebar = ({ active, activeSubMenu, openMenu, toggleSubmenu }) => {

    return (
        <>
            <SidebarButton
                page="organizers"
                activePage={active}
                hasDropdown={true}
                onClick={() => toggleSubmenu("organizers")}
            >
                <div className="flex justify-between items-center w-full">
                    <div className="flex">
                        <LuChartNoAxesCombined className="text-xl" />
                        <span className="ms-3">Organizers</span>
                    </div>
                    <div>
                        <IoIosArrowDown
                            className={`text-xl -mt-1 ${openMenu === "organizers" ? "rotate-180" : ""
                                } transition-all duration-300 ease-linear`}
                        />
                    </div>
                </div>
            </SidebarButton>

            <ul
                className={`grid grid-rows-[0fr] pl-4 transition-all duration-300 ease-linear ${openMenu === "organizers" ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
            >
                <div className="overflow-hidden">
                    <div className="mt-2 space-y-1">
                        <li>
                            <SidebarButton
                                page=""
                                subMenu="pendingOrganizers"
                                activeSubMenu={activeSubMenu}
                                route="/admin/organizers/pending"
                            >
                                <MdEditDocument className="text-xl" />
                                <span className="ms-3">Pending</span>
                            </SidebarButton>
                        </li>
                        <li>
                            <SidebarButton
                                page=""
                                subMenu="approvedOrganizers"
                                activeSubMenu={activeSubMenu}
                                route="/admin/organizers/approved"
                            >
                                <MdEditDocument className="text-xl" />
                                <span className="ms-3">Approved</span>
                            </SidebarButton>
                        </li>
                        <li>
                            <SidebarButton
                                page=""
                                subMenu="rejectedOrganizers"
                                activeSubMenu={activeSubMenu}
                                route="/admin/organizers/rejected"
                            >
                                <MdEditDocument className="text-xl" />
                                <span className="ms-3">Rejected</span>
                            </SidebarButton>
                        </li>
                    </div>
                </div>
            </ul>
        </>
    );
};

export default OrganizerSidebar;