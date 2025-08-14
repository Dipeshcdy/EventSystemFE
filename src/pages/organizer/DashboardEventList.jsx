import { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";
import { useAuth } from "../../context/AuthContext";
import { Card, Typography } from "@material-tailwind/react";
import defaultImage from "../../images/default.webp";
import { EventTimeStatus } from "../../constants/constants";
import { formatDate, formatUtcDate } from "../../utils/dateFormatter";
const pageSize = 5;
const DashboardEventList = ({ events, label }) => {
    const apiKey = import.meta.env["VITE_APP_BASE_URL"];
    return (
        <>

            <div
                className="relative border border-gray-300 p-6 rounded-xl shadow dark:bg-black bg-white w-full cursor-pointer"
            >
                <div className="absolute inset-0 z-0 " />
                <div className="relative z-10">
                    <h2 className="font-bold">{label}</h2>
                    <table className="w-full mt-2 overflow-auto">
                        <thead className="text-left">
                            <tr className="border-b border-gray-300">
                                <th className="text-xs sm:text-sm font-medium px-2 py-3">Image</th>
                                <th className="text-xs sm:text-sm font-medium px-2 py-3">Title</th>
                                <th className="text-xs sm:text-sm font-medium px-2 py-3">Venue</th>
                                <th className="text-xs sm:text-sm font-medium px-2 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.length > 0 ? (<>
                                {events.map((element, index) => (
                                    <tr key={index} className="border-b border-gray-300">
                                        <td className="text-xs sm:text-sm px-2 py-3">
                                            <img src={apiKey + element.imageUrl} className="w-10 h-10 object-cover object-center" alt="" />
                                        </td>
                                        <td className="text-xs sm:text-sm px-2 py-3">{element.title}</td>
                                        <td className="text-xs sm:text-sm px-2 py-3">{element.venue}</td>
                                        <td className="text-xs sm:text-sm px-2 py-3"> {element.startDate === element.endDate
                                            ? formatDate(element.startDate)
                                            : `${formatDate(element.startDate)} - ${formatDate(
                                                element.endDate
                                            )}`}</td>
                                    </tr>
                                ))}
                            </>) : (<>

                                <tr>
                                    <td colSpan="4" className="text-center py-4">
                                        No data available
                                    </td>
                                </tr>
                            </>)}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default DashboardEventList;
