import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../../services/axios";
import { useAuth } from "../../../context/AuthContext";
import { CiSearch, CiEdit } from "react-icons/ci";
import { Card, Typography } from "@material-tailwind/react";
import { MdDeleteOutline } from "react-icons/md";
import toast from "react-hot-toast";
import Pagination from "../../../components/Pagination";
import { FaSquarePlus } from "react-icons/fa6";
import EventCategoryFormModal from "../../../components/modal/EventCategory/EventCategoryFormModal";
import ConfirmModal from "../../../components/modal/ConfirmModal";
import { FaRegEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import defaultImage from "../../../images/default.webp";
import { TbUserScan } from "react-icons/tb";
const TABLE_HEAD = [
  { head: "SN" },
  { head: "Image" },
  { head: "Title" },
  { head: "Venue" },
  { head: "Start Date" },
  { head: "End Date" },
  { head: "Actions" },
];
const pageSize = 5;
const EventList = ({ status }) => {
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

    params.append("status", status); // <== Add this line
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
    } catch (error) { }
  };
  //fetch category

  const onPaginationChange = async (paginationData) => {
    setPagination(paginationData);
    fetchData(paginationData.currentPage, pageSize);
  };

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setSelectedEvent(null);
  };

  const handleDelete = async () => {
    const eventId = selectedEvent?.id;

    if (!eventId) {
      toast.error("Something went wrong. Client ID is missing.");
      return;
    }
    setLoading(true);
    const url = `${apiKey}api/event/${eventId}`;
    try {
      const response = await axiosInstance.delete(url);
      if (response.status === 200) {
        toast.success(response.data.message);
        handleDeleteModalClose();
        setEvents((prev) => prev.filter((e) => e.id !== eventId));
      }
    } catch (error) {
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  return (
    <>
      {!pageLoading && (
        <>
          <div className="">
            <div>
              <h2 className="text-sm inline-block border-b-2 border-gray-400">
                {status} Events
              </h2>
            </div>
            <div className="mt-5 flex flex-wrap gap-5 justify-between items-center ">
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative w-56">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <CiSearch className="text-gray-800 dark:text-white" />
                  </div>
                  <input
                    type="text"
                    id="simple-search"
                    className="bg-white border border-gray-300 placeholder:text-xs text-xs text-gray-900 rounded-3xl  block w-full ps-10 px-2.5 py-2 outline-none dark:bg-black dark:text-white"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                  />
                </div>
              </div>

              {/* <div>
                                <button
                                    onClick={() => {
                                        setSelectedEvent(null);
                                        setModalOpen(true);
                                    }}
                                    className="bg-blue-600 text-sm text-white py-1.5 px-9 rounded-xl border border-blue-600 hover:bg-blue-700 duration-500 transition-all flex items-center gap-2"
                                >
                                    Add new Item <FaSquarePlus className="text-xl" />
                                </button>
                            </div> */}
            </div>
          </div>
          <div className="mt-2">
            <Card className="h-full w-full border rounded-none dark:bg-black dark:text-white overflow-x-auto">
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    {TABLE_HEAD.map(({ head }) => (
                      <th key={head} className="border-b border-gray-300 p-4">
                        <div className="flex items-center gap-1">
                          <Typography
                            color="blue-gray"
                            variant="small"
                            className="!font-bold"
                          >
                            {head}
                          </Typography>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {events.length > 0 ? (
                    events.map((element, index) => {
                      const isLast = index === events.length - 1;
                      const classes = isLast
                        ? "p-3"
                        : "p-3 border-b border-gray-300";
                      return (
                        <tr key={index}>
                          <td className={classes}>
                            <div className="flex items-center ml-2 gap-1">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-bold"
                              >
                                {(pagination.currentPage - 1) *
                                  pagination.pageSize +
                                  index +
                                  1}
                              </Typography>
                            </div>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              className="font-normal text-gray-600 dark:text-white"
                            >
                              <div className="w-10 h-10">
                                <img
                                  src={
                                    element.imageUrl
                                      ? apiKey + element.imageUrl
                                      : defaultImage
                                  }
                                  className="w-full h-full object-contain rounded-lg"
                                  alt=""
                                />
                              </div>
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              className="font-normal text-gray-600 dark:text-white"
                            >
                              {element.title}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              className="font-normal text-gray-600 dark:text-white"
                            >
                              {element.venue}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              className="font-normal text-gray-600 dark:text-white"
                            >
                              {element.startDate}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              className="font-normal text-gray-600 dark:text-white"
                            >
                              {element.endDate}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <div className="flex items-center gap-2">
                              {status == "Accepted" && (
                                <Link
                                  to={`/organizer/event/${element.id}/scanning-users`}
                                  className="text-2xl cursor-pointer text-blue-600 hover:text-blue-800 dark:text-blue-200 dark:hover:text-blue-400"
                                >
                                  <TbUserScan />
                                </Link>
                              )}
                              {status !== "Accepted" && (
                                <Link
                                  to={`/organizer/event/${element.id}`}
                                  className="text-2xl cursor-pointer text-blue-600 hover:text-blue-800 dark:text-blue-200 dark:hover:text-blue-400"
                                >
                                  <CiEdit />
                                </Link>
                              )}
                              <Link
                                to={`/organizer/event/${element.id}/view`}
                                className="text-2xl cursor-pointer text-blue-600 hover:text-blue-800 dark:text-blue-200 dark:hover:text-blue-400"
                              >
                                <FaRegEye />
                              </Link>
                              {status != "Accepted" && (
                                <button
                                  onClick={() => {
                                    setDeleteModalOpen(true);
                                    setSelectedEvent(element);
                                  }}
                                  className="text-2xl cursor-pointer text-red-600 hover:text-red-800 ml-2"
                                >
                                  <MdDeleteOutline />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-4">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Card>
          </div>
          <div className="mt-4">
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
      )}

      {/* <EventCategoryFormModal
                open={modalOpen}
                onClose={handleModalClose}
                loading={loading}
                setLoading={setLoading}
                selectedDataForEdit={selectedEvent}
                fetchData={fetchData} /> */}

      <ConfirmModal
        open={deleteModalOpen}
        onClose={handleDeleteModalClose}
        submit={handleDelete}
      />
    </>
  );
};

export default EventList;
