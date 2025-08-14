import { useEffect, useRef, useState } from "react";
import Chart from "react-apexcharts";
import axiosInstance from "../../services/axios";
import { IoCartOutline } from "react-icons/io5";
import { IoIosTrendingUp } from "react-icons/io";
import { IoIosTrendingDown } from "react-icons/io";
import { IoTimeOutline } from "react-icons/io5";
import formatNepaliCurrency from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { formatDate, formatDateToLocal, formatUtcDate } from "../../utils/dateFormatter";
import DashboardEventList from "./DashboardEventList";
import { EventTimeStatus } from "../../constants/constants";

  const pageSize = 5; // top 5
const Dashboard = () => {
  const apiKey = import.meta.env["VITE_APP_BASE_URL"];
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [recentReview, setRecentReview] = useState([]);
  const [eventsData, setEventsData] = useState({
    accepted: [],
    pending: [],
    rejected: [],
    upcoming: [],
    ongoing: [],
    past: [],
  });
  const { setActivePage, loading, setLoading, setActiveSubMenu } = useAuth();
  setActivePage("dashboard"); setActiveSubMenu("");

  const [dailySalesChartConfig, setDailySalesChartConfig] = useState({
    series: [
      {
        name: "This Week",
        data: [],
      },
    ],
    options: {
      chart: {
        type: "line",
        height: 220,
        toolbar: { show: false },
      },
      stroke: {
        width: 2,
        curve: "smooth",
      },
      colors: ["#3b82f6", "#94a3b8", "#f4bb0fff"], // Blue and gray
      dataLabels: { enabled: false },
      xaxis: {
        categories: [],
        axisTicks: { show: false },
        axisBorder: { show: false },
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
      },
      grid: {
        show: true,
        borderColor: "#dddddd",
        strokeDashArray: 5,
      },
      tooltip: { theme: "dark" },
      legend: { show: true }, // Now that we have 2 series, legend might be helpful
    },
  });

  const [ticketTypesSalesChartConfig, setTicketTypesSalesChartConfig] = useState({
    series: [
      {
        name: "This Week",
        data: [],
      },
    ],
    options: {
      chart: {
        type: "line",
        height: 220,
        toolbar: { show: false },
      },
      stroke: {
        width: 2,
        curve: "smooth",
      },
      colors: ["#3b82f6", "#94a3b8", "#f4bb0fff"], // Blue and gray
      dataLabels: { enabled: false },
      xaxis: {
        categories: [],
        axisTicks: { show: false },
        axisBorder: { show: false },
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
      },
      grid: {
        show: true,
        borderColor: "#dddddd",
        strokeDashArray: 5,
      },
      tooltip: { theme: "dark" },
      legend: { show: true }, // Now that we have 2 series, legend might be helpful
    },
  });

  const [revenueByEventChartConfig, setRevenueByEventChartConfig] = useState({
    series: [],
    options: {
      chart: {
        type: "pie",
        height: 300,
        toolbar: { show: false },
      },
      colors: ["#3b82f6", "#f97316", "#10b981", "#ef4444", "#6366f1"],
      dataLabels: {
        enabled: true, // Show percentages/values inside pie
        formatter: (val) => `${val.toFixed(1)}%`,
      },
      legend: {
        position: "bottom",
      },
      tooltip: { theme: "dark" },
      labels: [], // Will be updated dynamically
    },
  });
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchDashboardData();
      await fetchEvents();
      setTimeout(() => {
        setLoading(false);
      }, 500);
    };
    fetchData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        `${apiKey}api/dashboard/OrganizerDashboardAnalytics`
      );
      // const response = await axiosInstance.get(`${apiKey}api/dashboard/dashboardCount`);
      if (response.status == 200) {
        const data = response.data.data;
        console.log('Dashboard API data:', data); // <-- Debug API response
        const topTicketTypes = data.topTicketTypes;
        const ticketTypes = topTicketTypes.map((entry) => entry.ticketType);
        const solds = topTicketTypes.map(
          (entry) => entry.sold
        );
        setTicketTypesSalesChartConfig((prevConfig) => ({
          ...prevConfig,
          series: [
            {
              name: "This Week",
              data: solds,
            },
          ],
          options: {
            ...prevConfig.options,
            xaxis: {
              ...prevConfig.options.xaxis,
              categories: ticketTypes, // Array of days
            },
          },
        }));

        const salesDaily = data.dailyTicketSales;
        const salesDays = salesDaily.map((entry) => entry.day);
        const dailySales = salesDaily.map(
          (entry) => entry.ticketsSold
        );

        setDailySalesChartConfig((prevConfig) => ({
          ...prevConfig,
          series: [
            {
              name: "This Week",
              data: dailySales,
            },
          ],
          options: {
            ...prevConfig.options,
            xaxis: {
              ...prevConfig.options.xaxis,
              categories: salesDays, // Array of days
            },
          },
        }));

        setRecentReview(data.recentReviews);
        // setTopEvents(Array.isArray(data.topSellingItems) ? data.topSellingItems : []);

        setDashboardSummary({
          ticketSalesRate: data.ticketSalesRate,
          scanRate: data.scanRate,
          totalRevenue: data.totalRevenue,
          totalTicketsSold: data.totalTicketsSold,
        });

        const topRevenueEvents = data.topRevenueEvents; // The backend data
        const eventNames = topRevenueEvents.map(
          (entry) => entry.eventName
        );
        const revenueCount = topRevenueEvents.map(
          (entry) => entry.revenue
        );

        setRevenueByEventChartConfig((prevConfig) => ({
          ...prevConfig,
          series: revenueCount,
          options: {
            ...prevConfig.options,
            labels: eventNames, // Labels for each slice
          },
        }));
      }
    } catch (error) {
      if (error.response) {
        var errorMessage = error.response.data.message;
        toast.error(errorMessage);
      } else if (error.message) {
        console.log("Error", error.message);
        toast.error("Error", error.message);
      } else {
        toast.error(error);
        console.log("Error", error);
      }
    }
  };


  const fetchEvents = async () => {
    try {
      // Create all promises
      const promises = [
        // Status based
        axiosInstance.get(`${apiKey}api/event?status=Accepted&pageNumber=1&pageSize=${pageSize}`),
        axiosInstance.get(`${apiKey}api/event?status=Pending&pageNumber=1&pageSize=${pageSize}`),
        axiosInstance.get(`${apiKey}api/event?status=Rejected&pageNumber=1&pageSize=${pageSize}`),

        // Time status based
        axiosInstance.get(`${apiKey}api/event?status=Accepted&eventTimeStatus=${EventTimeStatus.Upcoming}&pageNumber=1&pageSize=${pageSize}`),
        axiosInstance.get(`${apiKey}api/event?status=Accepted&eventTimeStatus=${EventTimeStatus.Ongoing}&pageNumber=1&pageSize=${pageSize}`),
        axiosInstance.get(`${apiKey}api/event?status=Accepted&eventTimeStatus=${EventTimeStatus.Past}&pageNumber=1&pageSize=${pageSize}`),
      ];

      // Wait for all promises
      const [
        acceptedRes,
        pendingRes,
        rejectedRes,
        upcomingRes,
        ongoingRes,
        pastRes,
      ] = await Promise.all(promises);

      setEventsData({
        accepted: acceptedRes.data.data.items,
        pending: pendingRes.data.data.items,
        rejected: rejectedRes.data.data.items,
        upcoming: upcomingRes.data.data.items,
        ongoing: ongoingRes.data.data.items,
        past: pastRes.data.data.items,
      });
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  return (
    <>
      {!loading && (
        <>
          <div className="text-gray-700 dark:!text-white">
            <div className="flex flex-wrap gap-4  items-center py-2">
              <div className="flex-grow text-center">
                <h2 className="text-sm dark:text-white">{formatDate(new Date())}</h2>
              </div>
            </div>
            <div className="flex gap-4 flex-col">
              <div className="bg-white dark:bg-black rounded-md grid grid-cols-4 gap-5">

                <div className="border border-gray-300 p-4 rounded-xl shadow cursor-pointer">
                  <div className="flex justify-between">
                  </div>
                  <h2 className="sm:text-sm text-xs my-2">
                    Total Revenue
                  </h2>
                  <h2 className="sm:text-2xl text-base font-bold">
                    {formatNepaliCurrency(dashboardSummary?.totalRevenue ?? 0)}
                  </h2>
                </div>

                <div className="border border-gray-300 p-4 rounded-xl shadow cursor-pointer" >
                  <div className="flex justify-between">
                  </div>
                  <h2 className="sm:text-sm text-xs my-2">
                    Total Tickets Sold
                  </h2>
                  <h2 className="sm:text-2xl text-base font-bold">
                    {dashboardSummary?.totalTicketsSold ?? 0}
                  </h2>
                </div>

                <div className="border border-gray-300 p-4 rounded-xl shadow cursor-pointer" >
                  <div className="flex justify-between">
                  </div>
                  <h2 className="sm:text-sm text-xs my-2">
                    Ticket Sales Rate
                  </h2>
                  <h2 className="sm:text-2xl text-base font-bold">
                    {dashboardSummary?.ticketSalesRate ?? 0} %
                  </h2>
                </div>

                <div className="border border-gray-300 p-4 rounded-xl shadow cursor-pointer" >
                  <div className="flex justify-between">
                  </div>
                  <h2 className="sm:text-sm text-xs my-2">
                    Ticket Scan Rate
                  </h2>
                  <h2 className="sm:text-2xl text-base font-bold">
                    {dashboardSummary?.scanRate ?? 0} %
                  </h2>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-gray-300 p-6 rounded-xl shadow dark:bg-black">
                  <h2 className="text-sm sm:text-lg dark:text-white font-semibold">
                    Ticket Types Sales Statistics
                  </h2>
                  <div className="!w-full">
                    <Chart {...ticketTypesSalesChartConfig} type="bar" />
                  </div>
                </div>
                <div className="border border-gray-300 p-6 rounded-xl shadow dark:bg-black">
                  <h2 className="text-sm sm:text-lg dark:text-white font-semibold">
                    Daily Ticket Sales Statistics
                  </h2>
                  <div className="!w-full ">
                    <Chart {...dailySalesChartConfig} />
                  </div>
                </div>
              </div>
              <div className="border border-gray-300 p-6 rounded-xl shadow dark:bg-black w-full">
                <h2 className="text-sm sm:text-lg dark:text-white font-semibold">
                  Top Revenues By Events
                </h2>
                <Chart
                  {...revenueByEventChartConfig}
                  type="pie"
                  height={400}
                />
              </div>

              {/* top events */}
              {/* <div
                ref={containerRef} // optional
                onClick={handleTopProductCardClick} // optional
                className="relative border border-gray-300 p-6 rounded-xl shadow dark:bg-black bg-white w-full cursor-pointer"
              >
                <div className="absolute inset-0 z-0 " />
                <div className="relative z-10">
                  <h2 className="font-bold">Top Events</h2>
                  <table className="w-full mt-2 overflow-auto">
                    <thead className="text-left">
                      <tr className="border-b border-gray-300">
                        <th className="text-xs sm:text-sm font-medium px-2 py-3">Event Name</th>
                        <th className="text-xs sm:text-sm font-medium px-2 py-3">Organizer</th>
                        <th className="text-xs sm:text-sm font-medium px-2 py-3">Tickets Sold</th>
                        <th className="text-xs sm:text-sm font-medium px-2 py-3">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topEvents?.map((element, index) => (
                        <tr key={index} className="border-b border-gray-300">
                          <td className="text-xs sm:text-sm px-2 py-3">{element.title}</td>
                          <td className="text-xs sm:text-sm px-2 py-3">{element.organizer}</td>
                          <td className="text-xs sm:text-sm px-2 py-3 justify-center">
                            <span>{element.ticketsSold}</span>
                          </td>
                          <td className="text-xs sm:text-sm px-2 py-3 flex gap-1 items-center">
                            <span>{formatNepaliCurrency(element.revenue)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div> */}
              {/*end of top events */}

              {/* upcoming events */}
              {/* <div
                className="relative border border-gray-300 p-6 rounded-xl shadow dark:bg-black bg-white w-full cursor-pointer"
              >
                <div className="absolute inset-0 z-0 " />
                <div className="relative z-10">
                  <h2 className="font-bold">Upcoming Events</h2>
                  <table className="w-full mt-2 overflow-auto">
                    <thead className="text-left">
                      <tr className="border-b border-gray-300">
                        <th className="text-xs sm:text-sm font-medium px-2 py-3">Event Name</th>
                        <th className="text-xs sm:text-sm font-medium px-2 py-3">Organizer</th>
                        <th className="text-xs sm:text-sm font-medium px-2 py-3">Capacity</th>
                        <th className="text-xs sm:text-sm font-medium px-2 py-3">Venue</th>
                        <th className="text-xs sm:text-sm font-medium px-2 py-3">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingEvents?.map((element, index) => (
                        <tr key={index} className="border-b border-gray-300">
                          <td className="text-xs sm:text-sm px-2 py-3">{element.title}</td>
                          <td className="text-xs sm:text-sm px-2 py-3">{element.user?.name ?? ""}</td>
                          <td className="text-xs sm:text-sm px-2 py-3">
                            {element.eventTicketType?.reduce((sum, ticket) => sum + (ticket.capacity || 0), 0) ?? 0}
                          </td>
                          <td className="text-xs sm:text-sm px-2 py-3">{element.venue}, {element.location}</td>
                          <td className="text-xs sm:text-sm px-2 py-3"> {element.startDate === element.endDate
                            ? formatDate(element.startDate)
                            : `${formatDate(element.startDate)} - ${formatDate(
                              element.endDate
                            )}`}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div> */}
              {/*end of upcoming events */}


              {/* recent signUps */}
              {/* <div
                className="relative border border-gray-300 p-6 rounded-xl shadow dark:bg-black bg-white w-full cursor-pointer"
              >
                <div className="absolute inset-0 z-0 " />
                <div className="relative z-10">
                  <h2 className="font-bold">Recent User SignUps</h2>
                  <table className="w-full mt-2 overflow-auto">
                    <thead className="text-left">
                      <tr className="border-b border-gray-300">
                        <th className="text-xs sm:text-sm font-medium px-2 py-3">Full Name</th>
                        <th className="text-xs sm:text-sm font-medium px-2 py-3">Phone</th>
                        <th className="text-xs sm:text-sm font-medium px-2 py-3">Email</th>
                        <th className="text-xs sm:text-sm font-medium px-2 py-3">Address</th>
                        <th className="text-xs sm:text-sm font-medium px-2 py-3">Gender</th>
                        <th className="text-xs sm:text-sm font-medium px-2 py-3">Created At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentSignUps?.map((element, index) => (
                        <tr key={index} className="border-b border-gray-300">
                          <td className="text-xs sm:text-sm px-2 py-3">{element.fullName}</td>
                          <td className="text-xs sm:text-sm px-2 py-3">{element.phoneNo}</td>
                          <td className="text-xs sm:text-sm px-2 py-3">{element.email}</td>
                          <td className="text-xs sm:text-sm px-2 py-3">{element.address}</td>
                          <td className="text-xs sm:text-sm px-2 py-3">{element.gender}</td>
                          <td className="text-xs sm:text-sm px-2 py-3">{formatUtcDate(element.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div> */}
              {/*end of recent signUps */}

              {/* recent signUps */}
              <div
                className="relative border border-gray-300 p-6 rounded-xl shadow dark:bg-black bg-white w-full cursor-pointer"
              >
                <div className="absolute inset-0 z-0 " />
                <div className="relative z-10">
                  <h2 className="font-bold">Recent User Feedbacks</h2>
                  <table className="w-full mt-2 overflow-auto">
                    <thead className="text-left">
                      <tr className="border-b border-gray-300">
                        <th className="text-xs sm:text-sm font-medium px-2 py-3">Image</th>
                        <th className="text-xs sm:text-sm font-medium px-2 py-3">Full Name</th>
                        <th className="text-xs sm:text-sm font-medium px-2 py-3">Event Name</th>
                        <th className="text-xs sm:text-sm font-medium px-2 py-3">Rating</th>
                        <th className="text-xs sm:text-sm font-medium px-2 py-3">Feedback</th>
                        <th className="text-xs sm:text-sm font-medium px-2 py-3">Created At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentReview?.map((element, index) => (
                        <tr key={index} className="border-b border-gray-300">
                          <td className="text-xs sm:text-sm px-2 py-3">
                            <img src={apiKey + element.profileImageUrl} className="w-10 h-10 object-cover object-center" alt="" />
                          </td>
                          <td className="text-xs sm:text-sm px-2 py-3">{element.fullName}</td>
                          <td className="text-xs sm:text-sm px-2 py-3">{element.eventName}</td>
                          <td className="text-xs sm:text-sm px-2 py-3">{element.rating}</td>
                          <td className="text-xs sm:text-sm px-2 py-3">{element.feedback}</td>
                          <td className="text-xs sm:text-sm px-2 py-3">{formatUtcDate(element.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/*end of recent signUps */}

              <DashboardEventList events={eventsData.ongoing} label="Active Events" />
              <DashboardEventList events={eventsData.upcoming} label="Upcoming Events" />
              <DashboardEventList events={eventsData.past} label="Past Events" />
              <DashboardEventList events={eventsData.pending} label="Pending Events" />
              <DashboardEventList events={eventsData.accepted} label="Accepted Events" />
              <DashboardEventList events={eventsData.rejected} label="Rejected Events" />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;