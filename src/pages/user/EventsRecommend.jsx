import React, { useEffect, useRef, useState } from "react";
import EventCard from "../../components/Event/EventCard";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../services/axios";
import Pagination from "../../components/Pagination";
const pageSize = 10;
const EventsRecommend = () => {
    const { setLoading } = useAuth();
    const [pageLoading, setPageLoading] = useState(true);
    const apiKey = import.meta.env["VITE_APP_BASE_URL"];
    const [search, setSearch] = useState("");
    const [userLocation, setUserLocation] = useState({ lat: null, lng: null });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 5,
        totalPages: null,
        totalRecords: null,
    });
    const isFirstRender = useRef(true);

    useEffect(() => {
        window.scrollTo(0, 0);

        const loadData = async () => {
            try {
                setLoading(true);
                const location = await fetchLocation();
                await fetchData(1, location);
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                    setPageLoading(false);
                }, 500);
            }
        };
        loadData();
    }, []);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
        } else {
            const delayDebounceFn = setTimeout(() => {
                fetchData();
            }, 1000);
            return () => clearTimeout(delayDebounceFn);
        }
    }, [search]);
    //products
    const [events, setEvents] = useState([]);


    const fetchLocation = () => {
        return new Promise((resolve) => {
            const storedLocation = localStorage.getItem("userLocation");
            if (storedLocation) {
                resolve(JSON.parse(storedLocation));
            } else if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const location = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        };
                        localStorage.setItem("userLocation", JSON.stringify(location));
                        resolve(location);
                    },
                    (error) => {
                        console.error("Error getting location:", error);
                        const fallback = { lat: 27.7172, lng: 85.3240 };
                        localStorage.setItem("userLocation", JSON.stringify(fallback));
                        resolve(fallback);
                    }
                );
            } else {
                const fallback = { lat: 27.7172, lng: 85.3240 };
                localStorage.setItem("userLocation", JSON.stringify(fallback));
                resolve(fallback);
            }
        });
    };

    const constructUrl = (currentPage, location) => {
        let url = `${apiKey}api/event/events/recommendations`;
        const params = new URLSearchParams();
        params.append("lat", location.lat);
        params.append("lng", location.lng);
        params.append("pageNumber", currentPage);
        params.append("pageSize", pageSize);

        return `${url}?${params.toString()}`;
    };
    const fetchData = async (currentPage = 1, location = null) => {
        const userLocation = location || JSON.parse(localStorage.getItem("userLocation"));
        const url = constructUrl(currentPage, userLocation);
        try {
            const response = await axiosInstance.get(url);
            if (response.status == 200) {
                const data = response.data.data;
                setEvents(data.items);
                setPagination({
                    currentPage: data.pageNumber,
                    pageSize: data.pageSize,
                    totalPages: data.totalPages,
                    totalRecords: data.totalRecords,
                });
            }
        } catch (error) { }
    };
    //fetch category

    const onPaginationChange = async (paginationData) => {
        setPagination(paginationData);
        fetchData(paginationData.currentPage, pageSize);
    };
    return (
        <>
            <div
                style={{
                    backgroundImage:
                        "url('https://eurostarconsultancy.com/images/bridge.png')",
                }}
                className="bg-cover bg-center h-56 relative"
            >
                <div className="absolute inset-0 bg-black bg-opacity-70 text-white flex items-center sm:px-10 px-6">
                    <div className="2xl:max-w-[1650px] xl:max-w-[1250px] w-full mx-auto">
                        <h1 className="md:text-3xl sm:text-2xl text-xl">Events You May Like</h1>
                    </div>
                </div>
            </div>
            <section className="px-20 pt-20">
                <div className="grid grid-cols-3 gap-8">
                    {events.map((element, index) => (
                        <EventCard key={index} element={element} />
                    ))}
                </div>
            </section>

            <div className="mt-4 px-20">
                {events.length > 0 && (
                    <Pagination
                        totalRecords={pagination.totalRecords}
                        currentPage={pagination.currentPage}
                        pageSize={pagination.pageSize}
                        totalPages={pagination.totalPages}
                        onPaginationChange={onPaginationChange}
                    />
                )}
            </div>
        </>
    );
};

export default EventsRecommend;
