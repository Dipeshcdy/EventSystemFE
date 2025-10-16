import { useEffect, useRef, useState } from "react";
import Chart from "react-apexcharts";
import axiosInstance from "../../services/axios";
import formatNepaliCurrency from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { formatDate, formatUtcDate } from "../../utils/dateFormatter";

const Dashboard = () => {
  const apiKey = import.meta.env["VITE_APP_BASE_URL"];
  const navigate = useNavigate();
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [topEvents, setTopEvents] = useState([]);
  const [recentSignUps, setRecentSignUps] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentReview, setRecentReview] = useState([]);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 7 }, (_, i) => currentYear - i);
  const { setActivePage, loading, setLoading, setActiveSubMenu } = useAuth();
  setActivePage("dashboard"); setActiveSubMenu("");

  const [dailySalesChartConfig, setDailySalesChartConfig] = useState({
    series: [
      {
        name: "Sales",
        data: [],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 220, // Matches daily chart height
        toolbar: { show: false },
      },
      colors: ["#3b82f6"],
      dataLabels: { enabled: false }, // No numbers inside bars
      plotOptions: {
        bar: {
          // columnWidth: "45%", // consistent width
          borderRadius: 4,
        },
      },
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
    },
  });

  const [dailyRevenueChartConfig, setDailyRevenueChartConfig] = useState({
    series: [
      {
        name: "This Week",
        data: [],
      },
      // {
      //   name: "Last Week",
      //   data: [],
      // },
      // {
      //   name: "Next Week",
      //   data: [],
      // },
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

  const [eventByCategoryChartConfig, setEventByCategoryChartConfig] = useState({
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
      setTimeout(() => {
        setLoading(false);
      }, 500);
    };
    fetchData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        `${apiKey}api/dashboard/AdminDashboardAnalytics`
      );
      // const response = await axiosInstance.get(`${apiKey}api/dashboard/dashboardCount`);
      if (response.status == 200) {
        const data = response.data.data;
        console.log('Dashboard API data:', data); // <-- Debug API response
        const revenueDaily = data.dailyRevenues;
        const days = revenueDaily.map((entry) => entry.day);
        const dailyRevenues = revenueDaily.map(
          (entry) => entry.revenue
        );
        setDailyRevenueChartConfig((prevConfig) => ({
          ...prevConfig,
          series: [
            {
              name: "This Week",
              data: dailyRevenues,
            },
          ],
          options: {
            ...prevConfig.options,
            xaxis: {
              ...prevConfig.options.xaxis,
              categories: days, // Array of days
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
              ...prevConfig.series[0],
              data: dailySales, // Array of numbers
            },
          ],
          options: {
            ...prevConfig.options,
            xaxis: {
              ...prevConfig.options.xaxis,
              categories: salesDays, // Array of months
            },
          },
        }));

        setTopEvents(data.topEvents);
        setUpcomingEvents(data.upcomingAcceptedEvents);
        setRecentSignUps(data.recentUserSignups);
        setRecentReview(data.recentEventFeedbacks);

        setDashboardSummary({
          totalPendingEvents: data.totalPendingEvents,
          totalRejectedEvents: data.totalRejectedEvents,
          totalAcceptedEvents: data.totalAcceptedEvents,
          totalRevenue: data.totalRevenue,
          totalTicketsSold: data.totalTicketsSold,
          totalOrganizers: data.totalOrganizers,
          totalUsers: data.totalUsers
        });

        const eventsPerCategory = data.eventsPerCategory; // The backend data
        const categories = eventsPerCategory.map(
          (entry) => entry.categoryName
        );
        const totalEventCount = eventsPerCategory.map(
          (entry) => entry.eventCount
        );

        setEventByCategoryChartConfig((prevConfig) => ({
          ...prevConfig,
          series: totalEventCount,
          options: {
            ...prevConfig.options,
            labels: categories, // Labels for each slice
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
                    {formatNepaliCurrency(dashboardSummary?.totalRevenue ?? "")}
                  </h2>
                </div>

                <div className="border border-gray-300 p-4 rounded-xl shadow cursor-pointer" >
                  <div className="flex justify-between">
                  </div>
                  <h2 className="sm:text-sm text-xs my-2">
                    Total Tickets Sold
                  </h2>
                  <h2 className="sm:text-2xl text-base font-bold">
                    {dashboardSummary?.totalTicketsSold}
                  </h2>
                </div>

                <div className="border border-gray-300 p-4 rounded-xl shadow cursor-pointer" >
                  <div className="flex justify-between">
                  </div>
                  <h2 className="sm:text-sm text-xs my-2">
                    Total Organizers
                  </h2>
                  <h2 className="sm:text-2xl text-base font-bold">
                    {dashboardSummary?.totalOrganizers}
                  </h2>
                </div>

                <div className="border border-gray-300 p-4 rounded-xl shadow cursor-pointer" >
                  <div className="flex justify-between">
                  </div>
                  <h2 className="sm:text-sm text-xs my-2">
                    Total Users
                  </h2>
                  <h2 className="sm:text-2xl text-base font-bold">
                    {dashboardSummary?.totalUsers}
                  </h2>
                </div>

                <div className="border border-gray-300 p-4 rounded-xl shadow cursor-pointer" >
                  <div className="flex justify-between">
                  </div>
                  <h2 className="sm:text-sm text-xs my-2">
                    Total Pending Events
                  </h2>
                  <h2 className="sm:text-2xl text-base font-bold">
                    {dashboardSummary?.totalPendingEvents}
                  </h2>
                </div>

                <div className="border border-gray-300 p-4 rounded-xl shadow cursor-pointer" >
                  <div className="flex justify-between">
                  </div>
                  <h2 className="sm:text-sm text-xs my-2">
                    Total Accepted Events
                  </h2>
                  <h2 className="sm:text-2xl text-base font-bold">
                    {dashboardSummary?.totalAcceptedEvents}
                  </h2>
                </div>

                <div className="border border-gray-300 p-4 rounded-xl shadow cursor-pointer" >
                  <div className="flex justify-between">
                  </div>
                  <h2 className="sm:text-sm text-xs my-2">
                    Total Rejected Events
                  </h2>
                  <h2 className="sm:text-2xl text-base font-bold">
                    {dashboardSummary?.totalRejectedEvents}
                  </h2>
                </div>

              </div>



              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-gray-300 p-6 rounded-xl shadow dark:bg-black">
                  <h2 className="text-sm sm:text-lg dark:text-white font-semibold">
                    Daily Revenue Statistics
                  </h2>
                  <div className="!w-full">
                    <Chart {...dailyRevenueChartConfig} />
                  </div>
                </div>
                <div className="border border-gray-300 p-6 rounded-xl shadow dark:bg-black">
                  <h2 className="text-sm sm:text-lg dark:text-white font-semibold">
                    Daily Ticket Sales Statistics
                  </h2>
                  <div className="!w-full ">
                    <Chart {...dailySalesChartConfig} type="bar" />
                  </div>
                </div>
              </div>
              <div className="border border-gray-300 p-6 rounded-xl shadow dark:bg-black w-full">
                <h2 className="text-sm sm:text-lg dark:text-white font-semibold">
                  Events Per Category
                </h2>
                <Chart
                  {...eventByCategoryChartConfig}
                  type="pie"
                  height={400}
                />
              </div>

              {/* top events */}
              <div
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
              </div>
              {/*end of top events */}

              {/* upcoming events */}
              <div
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
              </div>
              {/*end of upcoming events */}


              {/* recent signUps */}
              <div
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
              </div>
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
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;