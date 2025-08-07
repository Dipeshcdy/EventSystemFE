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
const TABLE_HEAD = [
    { head: "SN" },
    { head: "Organization Name" },
    { head: "Organization Address" },
    { head: "User Name" },
    { head: "Email" },
    { head: "Phone No" },
    { head: "Actions" },
];
const pageSize = 5;
const PendingOrganizer = () => {
    const { setActivePage, setActiveSubMenu, loading, setLoading } = useAuth();
    const [pageLoading, setPageLoading] = useState(true);
    setActivePage("organizers");
    setActiveSubMenu("pendingOrganizers");
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
    const [organizers, setOganizers] = useState([]);
    const constructUrl = (currentPage, pageSize) => {
        let url = `${apiKey}api/organizer`;
        const params = new URLSearchParams();       

        if (search) {
            params.append("search", search);
        }

        params.append("status", "Pending"); // <== Add this line
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
                setOganizers(data.items);
                setPagination({
                    currentPage: data.pageNumber,
                    pageSize: data.pageSize,
                    totalPages: data.totalPages,
                    totalRecords: data.totalRecords,
                });
            }
        } catch (error) {

        }
    };
    //fetch category

    const onPaginationChange = async (paginationData) => {
        setPagination(paginationData);
        fetchData(paginationData.currentPage, pageSize);
    };


    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedEventCategory, setSelectedEventCategory] = useState(null);


    //handle Edit
    const handleEdit = (eventCategoryId) => {
        const dataToEdit = organizers.find((c) => c.id === eventCategoryId);
        if (dataToEdit) {
            setSelectedEventCategory(productToEdit) // pre-fill modal form
            setModalOpen(true);
        }
    };

    //handle Delete

    const handleDelete = async (eventCategoryId) => {
        const productToDelete = organizers.find((p) => p.id === eventCategoryId);

        if (productToDelete) {
            try {
                const response = await axiosInstance.delete(
                    `${apiKey}api/eventcategory/${eventCategoryId}`
                );

                if (response.status === 200 || response.status === 204) {
                    toast.success("Product deleted successfully!");
                    // Optionally refresh the list
                    fetchData();
                } else {
                    toast.error("Failed to delete product.");
                }
            } catch (error) {
            }
        }
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setTimeout(() => {
            setSelectedEventCategory(null);
        }, 500);
    }

    const handleDeleteModalClose = () => {
        setDeleteModalOpen(false);
        setSelectedEventCategory(null);
    }



    const handleCustomerDelete = async () => {
        const categoryId = selectedEventCategory?.id;

        if (!categoryId) {
            toast.error("Something went wrong. Client ID is missing.");
            return;
        }
        setLoading(true);
        const url = `${apiKey}api/eventcategory/${categoryId}`;
        try {
            const response = await axiosInstance.delete(url);
            if (response.status === 200) {
                toast.success(response.data.message);
                handleDeleteModalClose();
                setOganizers(prev => prev.filter(cat => cat.id !== categoryId));
            }
        } catch (error) {
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 500);
        }
    }



    return (
        <>
            {!pageLoading && (
                <>
                    <div className="">
                        <div>
                            <h2 className="text-sm inline-block border-b-2 border-gray-400">
                                Pending Organizers
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
                                        setSelectedEventCategory(null);
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
                                    {organizers.length > 0 ? (
                                        organizers.map((element, index) => {
                                            const isLast = index === organizers.length - 1;
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
                                                                {(pagination.currentPage - 1) * pagination.pageSize + index + 1}
                                                            </Typography>
                                                        </div>
                                                    </td>
                                                    <td className={classes}>
                                                        <Typography
                                                            variant="small"
                                                            className="font-normal text-gray-600 dark:text-white"
                                                        >
                                                            {element.organizationName}
                                                        </Typography>
                                                    </td>
                                                    <td className={classes}>
                                                        <Typography
                                                            variant="small"
                                                            className="font-normal text-gray-600 dark:text-white"
                                                        >
                                                            {element.organizationAddress}
                                                        </Typography>
                                                    </td>
                                                    <td className={classes}>
                                                        <Typography
                                                            variant="small"
                                                            className="font-normal text-gray-600 dark:text-white"
                                                        >
                                                            {element.fullName}
                                                        </Typography>
                                                    </td>
                                                    <td className={classes}>
                                                        <Typography
                                                            variant="small"
                                                            className="font-normal text-gray-600 dark:text-white"
                                                        >
                                                            {element.email}
                                                        </Typography>
                                                    </td>
                                                    <td className={classes}>
                                                        <Typography
                                                            variant="small"
                                                            className="font-normal text-gray-600 dark:text-white"
                                                        >
                                                            {element.phoneNo}
                                                        </Typography>
                                                    </td>
                                                    <td className={classes}>
                                                        <div className="flex items-center gap-2">

                                                            <Link
                                                                to={`/admin/organizers/${element.id}`}
                                                                className="text-2xl cursor-pointer text-blue-600 hover:text-blue-800 dark:text-blue-200 dark:hover:text-blue-400"
                                                            >
                                                                <FaRegEye  />
                                                            </Link>

                                                            {/* <button
                                                                onClick={() => {
                                                                    setDeleteModalOpen(true);
                                                                    setSelectedEventCategory(element);
                                                                }}
                                                                className="text-2xl cursor-pointer text-red-600 hover:text-red-800 ml-2"
                                                            >
                                                                <MdDeleteOutline />
                                                            </button> */}
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
                        {organizers.length > 0 && (
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
                selectedDataForEdit={selectedEventCategory}
                fetchData={fetchData} /> */}

            <ConfirmModal
                open={deleteModalOpen}
                onClose={handleDeleteModalClose}
                submit={handleCustomerDelete} />
        </>
    );
};

export default PendingOrganizer;