import SidebarButton from "../../SidebarButton";
import { IoIosArrowDown } from "react-icons/io";
import { MdEditDocument } from "react-icons/md";
import { LuChartNoAxesCombined } from "react-icons/lu";

const EventSidebar = ({ active, activeSubMenu, openMenu, toggleSubmenu }) => {

    return (
        <>
            <SidebarButton
                page="events"
                activePage={active}
                route="/admin/events"
                hasDropdown={true}
                onClick={() => toggleSubmenu("events")}
            >
                <div className="flex justify-between items-center w-full">
                    <div className="flex">
                        <LuChartNoAxesCombined className="text-xl" />
                        <span className="ms-3">Events</span>
                    </div>
                    <div>
                        <IoIosArrowDown
                            className={`text-xl -mt-1 ${openMenu === "events" ? "rotate-180" : ""
                                } transition-all duration-300 ease-linear`}
                        />
                    </div>
                </div>
            </SidebarButton>

            <ul
                className={`grid grid-rows-[0fr] pl-4 transition-all duration-300 ease-linear ${openMenu === "events" ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
            >
                <div className="overflow-hidden">
                    <div className="mt-2 space-y-1">
                        <li>
                            <SidebarButton
                                page=""
                                subMenu="eventcategory"
                                activeSubMenu={activeSubMenu}
                                route="/admin/eventcategory"
                            >
                                <MdEditDocument className="text-xl" />
                                <span className="ms-3">Category</span>
                            </SidebarButton>
                        </li>
                        <li>
                            <SidebarButton
                                page=""
                                subMenu="pendingEvents"
                                activeSubMenu={activeSubMenu}
                                route="/admin/event/pending"
                            >
                                <MdEditDocument className="text-xl" />
                                <span className="ms-3">Pending Events</span>
                            </SidebarButton>
                        </li>
                        <li>
                            <SidebarButton
                                page=""
                                subMenu="acceptedEvents"
                                activeSubMenu={activeSubMenu}
                                route="/admin/event/accepted"
                            >
                                <MdEditDocument className="text-xl" />
                                <span className="ms-3">Accepted Events</span>
                            </SidebarButton>
                        </li>
                        <li>
                            <SidebarButton
                                page=""
                                subMenu="rejectedEvents"
                                activeSubMenu={activeSubMenu}
                                route="/admin/event/rejected"
                            >
                                <MdEditDocument className="text-xl" />
                                <span className="ms-3">Rejected Events</span>
                            </SidebarButton>
                        </li>
                    </div>
                </div>
            </ul>
        </>
    );
};

export default EventSidebar;