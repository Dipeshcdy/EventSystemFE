import React, { useEffect, useRef, useState } from "react";
import EventCard from "../../components/Event/EventCard";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../services/axios";
const pageSize = 10;
const Events = () => {
  const { setLoading } = useAuth();
  const [pageLoading, setPageLoading] = useState(true);

  const apiKey = import.meta.env["VITE_APP_BASE_URL"];
  const [search, setSearch] = useState("");
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
        await fetchData();
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
  const constructUrl = (currentPage, pageSize) => {
    let url = `${apiKey}api/event`;
    const params = new URLSearchParams();

    if (search) {
      params.append("search", search);
    }

    params.append("status", "Accepted"); // <== Add this line
    params.append("pageNumber", currentPage);
    params.append("pageSize", pageSize);

    return `${url}?${params.toString()}`;
  };
  const fetchData = async (currentPage = 1) => {
    const url = constructUrl(currentPage, pageSize);
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
    } catch (error) {}
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
            <h1 className="md:text-3xl sm:text-2xl text-xl">Events</h1>
          </div>
        </div>
      </div>
      <section className="px-20 pt-20">
        <div className="grid grid-cols-3 gap-8">
          {events.map((element, index) => (
            <EventCard element={element} />
          ))}
        </div>
      </section>
    </>
  );
};

export default Events;
