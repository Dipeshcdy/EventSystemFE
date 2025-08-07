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

const Dashboard = () => {
  const apiKey = import.meta.env["VITE_APP_BASE_URL"];
  const navigate = useNavigate();
  // const [loading, setLoading] = useState(true);
  // const { loading, setLoading } = useAuth();
  const [salesByPaymentMethods, setSalesByPaymentMethods] = useState([]);
  const [topSellingMenuItems, setTopSellingMenuItems] = useState([]);
  const [orderSummary, setOrderSummary] = useState(null);
  const [abcAnalysis, setAbcAnalysis] = useState([]);
  const [billStartDate, setBillStartDate] = useState();
  const [billEndDate, setBillEndDate] = useState();
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 7 }, (_, i) => currentYear - i);
  const { setActivePage, loading, setLoading, setActiveSubMenu } = useAuth();
  setActivePage("dashboard"); setActiveSubMenu("");
  const [year, setYear] = useState(new Date().getFullYear());

  const formatDate = () => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date().toLocaleDateString("en-US", options).replace(",", ",");
  };
  const [monthlyRevenueChartConfig, setMonthlyRevenueChartConfig] = useState({
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
      {
        name: "Last Week",
        data: [],
      },
      {
        name: "Next Week",
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

  const [categoryPerformanceChartConfig, setCategoryPerformanceChartConfig] =
    useState({
      series: [
        {
          name: "Sales",
          data: [],
        },
      ],
      options: {
        chart: {
          type: "bar",
          height: 50, // Matches daily chart height
          toolbar: { show: false },
        },
        colors: ["#3b82f6"],
        dataLabels: { enabled: false }, // No numbers inside bars
        plotOptions: {
          bar: {
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
        `${apiKey}api/dashboard/posDashboardAnalytics`
      );
      // const response = await axiosInstance.get(`${apiKey}api/dashboard/dashboardCount`);
      if (response.status == 200) {
        const data = response.data.data;
        console.log('Dashboard API data:', data); // <-- Debug API response
        const revenueDaily = data.revenueDaily;
        const days = revenueDaily.map((entry) => entry.day);
        const dailyThisWeekRevenues = revenueDaily.map(
          (entry) => entry.totalRevenue
        );
        const dailyLastWeekRevenues = revenueDaily.map(
          (entry) => entry.lastWeekRevenue
        );
        const dailyNextWeekRevenues = revenueDaily.map(
          (entry) => entry.nextWeekRevenue
        );
        setDailyRevenueChartConfig((prevConfig) => ({
          ...prevConfig,
          series: [
            {
              name: "This Week",
              data: dailyThisWeekRevenues,
            },
            {
              name: "Last Week",
              data: dailyLastWeekRevenues,
            },
            {
              name: "Next Week",
              data: dailyNextWeekRevenues,
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

        const revenueMonthly = data.revenueMonthly;
        const months = revenueMonthly.map((entry) => entry.month);
        const monthlyRevenues = revenueMonthly.map(
          (entry) => entry.totalRevenue
        );

        setMonthlyRevenueChartConfig((prevConfig) => ({
          ...prevConfig,
          series: [
            {
              ...prevConfig.series[0],
              data: monthlyRevenues, // Array of numbers
            },
          ],
          options: {
            ...prevConfig.options,
            xaxis: {
              ...prevConfig.options.xaxis,
              categories: months, // Array of months
            },
          },
        }));
        setSalesByPaymentMethods(data.salesByPaymentMethods);
        // setSalesByPaymentMethods(Array.isArray(data.salesByPaymentMethods) ? data.salesByPaymentMethods : []);

        setTopSellingMenuItems(data.topSellingItems);
        // setTopSellingMenuItems(Array.isArray(data.topSellingItems) ? data.topSellingItems : []);

        setOrderSummary({
          todayTotalSales: data.todayTotalSales,
          todayTotalDiscounts: data.todayTotalDiscounts,
          todaySalesTrendPercentage: data.todaySalesTrendPercentage,
          todayTotalOrders: data.todayTotalOrders,
          todayOrdersTrendPercentage: data.todayOrdersTrendPercentage,
          activeOrders: data.activeOrders,
        });

        const categoryPerformance = data.categoryPerformance; // The backend data
        const categories = categoryPerformance.map(
          (entry) => entry.categoryName
        );
        const totalCateogrySales = categoryPerformance.map(
          (entry) => entry.totalSales
        );

        setCategoryPerformanceChartConfig((prevConfig) => ({
          ...prevConfig,
          series: [
            {
              ...prevConfig.series[0],
              data: totalCateogrySales, // Array of sales values
            },
          ],
          options: {
            ...prevConfig.options,
            xaxis: {
              ...prevConfig.options.xaxis,
              categories: categories, // Array of category names
            },
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
  const containerRef = useRef(null);

  const handleCardClick = (e) => {
    navigate("/sales-details");
  }

  const handleTopProductCardClick = (e) => {
    navigate("/food-details");
  }
  const handleOpenOrdersCardClick = (e) => {
    navigate("/sales")
  }

  const handleTotalOrdersCardClick = (e) => {
    const today = new Date().toISOString().split("T")[0];

    navigate("/sales", {
      state: {
        selectedStatus: null,
        dateRange: "custom",
        startDate: today,
        endDate: today,
      },
    });
  };
  console.log(salesByPaymentMethods, orderSummary?.todayTotalSales);
  const CLICKME_SVG = `${import.meta.env.BASE_URL}clickme.svg`;

  const fetchAbcAnalysis = async () => {
    try {
      const response = await axiosInstance.get(
        `${apiKey}api/Dashboard/AbcAnalysis`,
        { params: { year } }
      );
      let data = response.data;
      if (data && Array.isArray(data.data)) {
        setAbcAnalysis(data.data);
      } else if (Array.isArray(data)) {
        setAbcAnalysis(data);
      } else {
        setAbcAnalysis([]);
      }
    } catch (error) {
      setAbcAnalysis([]);
      console.error("Failed to fetch ABC Analysis data:", error);
    }
  };

  useEffect(() => {
    fetchAbcAnalysis();
  }, [year]);

  return (
    <>
      {!loading && (
        <>
          <div className="text-gray-700 dark:!text-white">
            <div className="flex flex-wrap gap-4  items-center py-2">
              <div className="flex-grow text-center">
                <h2 className="text-sm dark:text-white">{formatDate()}</h2>
              </div>
            </div>
            <div className="flex gap-4 flex-col">
              <div className="bg-white dark:bg-black rounded-md">
                {/* <h2 className="text-sm sm:text-lg ">Overview</h2> */}
                <div className="grid lg:grid-cols-3 gap-4  ">
                  <div
                    onClick={handleCardClick}
                    className="relative lg:col-span-2 border border-gray-300 p-6 rounded-xl shadow h-full cursor-pointer"
                  >
                    <div className="absolute inset-0 z-0 " />
                    <div className="relative z-10 flex justify-between">
                      <div>
                        <div className="flex items-center gap-x-2">
                          <h2 className="text-sm sm:font-medium">
                            Today's Sales
                          </h2>
                          <h6 className="text-sm sm:font-small text-center ml-6">
                            <img
                              src={CLICKME_SVG}
                              alt="Click Me"
                              className="inline w-10 h-10 align-middle"
                            />
                          </h6>
                        </div>
                        <div className="text-base sm:text-2xl sm:flex items-center gap-2 font-bold mt-1">
                          <span>
                            {formatNepaliCurrency(
                              orderSummary?.todayTotalSales
                            )}
                          </span>
                          <span
                            className={`text-xs sm:text-sm font-normal flex gap-2 ${orderSummary?.todaySalesTrendPercentage > 0
                              ? "text-green-500"
                              : "text-red-500"
                              }`}
                          >
                            {orderSummary?.todaySalesTrendPercentage > 0 ? (
                              <IoIosTrendingUp />
                            ) : (
                              <IoIosTrendingDown />
                            )}
                            {orderSummary?.todaySalesTrendPercentage?.toFixed(
                              2
                            )}
                            % vs yesterday
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center">
                        <h2 className="text-xs sm:text-sm text-end">
                          Total Discounts
                        </h2>
                        <div className="text-red-500 justify-end">
                          <span>
                            {formatNepaliCurrency(
                              orderSummary?.todayTotalDiscounts
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="relative z-10 mt-2 flex flex-col gap-2 overflow-auto max-h-36 custom-scroll">
                      {salesByPaymentMethods.length === 0 ? (
                        <div className="text-xs text-gray-400 text-center py-2">
                          No sales by payment method data available.
                        </div>
                      ) : (
                        salesByPaymentMethods.map((element, index) => {
                          const percentage = (
                            (element.totalSales /
                              orderSummary?.todayTotalSales) *
                            100
                          ).toFixed(2);
                          return (
                            <div key={index}>
                              <div className="flex items-center justify-between">
                                <h2 className="text-xs mt-0.5">
                                  {element.name}
                                </h2>
                                <div className="text-xs sm:text-base">
                                  <span>
                                    {formatNepaliCurrency(element.totalSales)}
                                  </span>
                                </div>
                              </div>
                              <div className="bg-gray-200 h-1.5 rounded-xl mt-0.5 relative overflow-hidden">
                                <div
                                  className="bg-primary h-full rounded-xl"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <div className=" grid sm:grid-cols-2 lg:grid-cols-1 gap-4">

                    {/* active orders */}
                    <div className="border border-gray-300 p-4 rounded-xl shadow cursor-pointer" onClick={handleTotalOrdersCardClick}>
                      <div className="flex justify-between">
                        <IoCartOutline className="text-2xl text-primary " />
                        <span
                          className={`flex sm:text-base text-xs items-center gap-2 ${(orderSummary?.todayOrdersTrendPercentage ?? 0) >
                            0
                            ? "text-green-500"
                            : "text-red-500"
                            }`}
                        >
                          {(orderSummary?.todayOrdersTrendPercentage ?? 0) >
                            0 ? (
                            <IoIosTrendingUp />
                          ) : (
                            <IoIosTrendingDown />
                          )}
                          <span>
                            {(
                              orderSummary?.todayOrdersTrendPercentage ?? 0
                            ).toFixed(2)}
                            %
                          </span>
                        </span>
                      </div>
                      <h2 className="sm:text-sm text-xs my-2">
                        Total Orders Today
                      </h2>
                      <h2 className="sm:text-2xl text-base font-bold">
                        {orderSummary?.todayTotalOrders?.toFixed(2)}
                      </h2>
                    </div>
                    {/* active orders */}
                    <div className="border border-gray-300 p-4 rounded-xl shadow cursor-pointer" onClick={handleOpenOrdersCardClick}>
                      <div className="flex justify-between">
                        <IoTimeOutline className="text-2xl text-primary " />
                        {/* <span className="flex items-center gap-2 text-green-500">
                            <IoIosTrendingUp />
                            <span>+12%</span>
                          </span> */}
                      </div>
                      <h2 className="sm:text-sm text-xs my-2">
                        Total Active Orders
                      </h2>
                      <h2 className="sm:text-2xl text-base font-bold">
                        {orderSummary?.activeOrders?.toFixed(2)}
                      </h2>
                      <p className="text-xs text-gray-600">Pending</p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                ref={containerRef} // optional
                onClick={handleTopProductCardClick} // optional
                className="relative border border-gray-300 p-6 rounded-xl shadow dark:bg-black bg-white w-full cursor-pointer"
              >
                <div className="absolute inset-0 z-0 " />
                <div className="relative z-10">
                  <h2 className="font-bold">Top Products</h2>
                  <table className="w-full mt-2 overflow-auto">
                    <thead className="text-left">
                      <tr className="border-b border-gray-300">
                        <th className="text-xs sm:text-sm font-medium px-2 py-3">Product</th>
                        <th className="text-xs sm:text-sm font-medium px-2 py-3">Quantity</th>
                        <th className="text-xs sm:text-sm font-medium px-2 py-3">Sales</th>
                        <th className="text-xs sm:text-sm font-medium px-2 py-3">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topSellingMenuItems?.map((element, index) => (
                        <tr key={index} className="border-b border-gray-300">
                          <td className="text-xs sm:text-sm px-2 py-3">{element.itemName}</td>
                          <td className="text-xs sm:text-sm px-2 py-3">{element.quantity}</td>
                          <td className="text-xs sm:text-sm px-2 py-3 flex gap-1 items-center">
                            <span>{formatNepaliCurrency(element.totalSales)}</span>
                          </td>
                          <td className="px-2 py-3 text-xs sm:text-sm">
                            <span
                              className={`flex items-center gap-2 ${element.trendPercentage > 0
                                ? "text-green-600"
                                : "text-red-600"
                                }`}
                            >
                              {element.trendPercentage > 0 ? (
                                <IoIosTrendingUp />
                              ) : (
                                <IoIosTrendingDown />
                              )}
                              <span>{element.trendPercentage.toFixed(2)}%</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                    Monthly Revenue Statistics
                  </h2>
                  <div className="!w-full ">
                    <Chart {...monthlyRevenueChartConfig} type="bar" />
                  </div>
                </div>
              </div>
              <div className="border border-gray-300 p-6 rounded-xl shadow dark:bg-black w-full">
                <h2 className="text-sm sm:text-lg dark:text-white font-semibold">
                  Category Performance
                </h2>
                <Chart
                  {...categoryPerformanceChartConfig}
                  type="bar"
                  height={400}
                />
              </div>
            </div>
            <div
              ref={containerRef}
              // onClick={handleTopProductCardClick}
              className="relative border border-gray-300 p-6 rounded-xl shadow dark:bg-black bg-white w-full cursor-pointer mt-4"
            >
              <div className="absolute inset-0 z-0 " />
              <div className="relative z-10">
                <h2 className="font-bold">ABC Analysis</h2>
                <div className="flex items-center gap-2">
                  <label htmlFor="year" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Year:
                  </label>
                  <select
                    id="year"
                    name="year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-32 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  >
                    {years.map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>
                <table className="w-full mt-2 overflow-auto">
                  <thead className="text-left">
                    <tr className="border-b border-gray-300">
                      <th className="text-xs sm:text-sm font-medium px-2 py-3">Item Name</th>
                      <th className="text-xs sm:text-sm font-medium px-2 py-3">Annual Usage</th>
                      <th className="text-xs sm:text-sm font-medium px-2 py-3">Credit Per Unit</th>
                      <th className="text-xs sm:text-sm font-medium px-2 py-3">Consumption Value</th>
                      <th className="text-xs sm:text-sm font-medium px-2 py-3">Class</th>
                    </tr>
                  </thead>
                  <tbody>
                    {abcAnalysis && abcAnalysis.length > 0 ? (
                      abcAnalysis.map((element, index) => (
                        <tr key={index} className="border-b border-gray-300">
                          <td className="text-xs sm:text-sm px-2 py-3">{element.itemName}</td>
                          <td className="text-xs sm:text-sm px-2 py-3">{element.annualUsage}</td>
                          <td className="text-xs sm:text-sm px-2 py-3">{element.costPerUnit}</td>
                          <td className="text-xs sm:text-sm px-2 py-3">{element.consumptionValue}</td>
                          <td className="text-xs sm:text-sm px-2 py-3">{element.abcClass}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center text-gray-400 py-4">No ABC Analysis data available.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;