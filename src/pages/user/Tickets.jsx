import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../../services/axios";
import { useAuth } from "../../context/AuthContext";
import TicketCard from "../../components/Event/TicketCard";
import Pagination from "../../components/Pagination";
import { CiSearch, CiEdit } from "react-icons/ci";
const pageSize = 5;
const Tickets = () => {
    const apiKey = import.meta.env["VITE_APP_BASE_URL"];
    const [search, setSearch] = useState("");
    const { setLoading } = useAuth();
    const [pageLoading, setPageLoading] = useState(true);
    const [tickets, setTickets] = useState([]);
    const [selectedTickets, setSelectedTickets] = useState(new Set());
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
                await handlePaymentCallBack();
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

    const handlePaymentCallBack = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const pidx = urlParams.get("pidx");
        console.log(pidx);
        if (pidx) {
            const status = urlParams.get("status");
            const transactionId = urlParams.get("purchase_order_id");
            const jsonData = { pidx, transactionId };
            if (status == "Completed") {
                return handlePurchaseTicket(jsonData);
            }
        }
    };

    const handlePurchaseTicket = async (PaymentData) => {
        try {
            const response = await axiosInstance.post(
                `${apiKey}api/ticket/purchaseTicket`,
                PaymentData
            );
            if (response.status == 200) {
                toast.success(response.data.message);
            }
        } catch (error) { }
    };

    const constructUrl = (currentPage, pageSize) => {
        let url = `${apiKey}api/ticket/myTickets`;
        const params = new URLSearchParams();

        if (search) {
            params.append("search", search);
        }
        // params.append("status", "Accepted"); // <== Add this line
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
                setTickets(data.items);
                setPagination({
                    currentPage: data.pageNumber,
                    pageSize: data.pageSize,
                    totalPages: data.totalPages,
                    totalRecords: data.totalRecords,
                });
                console.log(data);
            }
        } catch (error) { }
    };

    const onPaginationChange = async (paginationData) => {
        setPagination(paginationData);
        fetchData(paginationData.currentPage, pageSize);
    };

    const toggleSelectTicket = (ticketId) => {
        setSelectedTickets((prevSelected) => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(ticketId)) {
                newSelected.delete(ticketId);
            } else {
                newSelected.add(ticketId);
            }
            return newSelected;
        });
    };

    const printSelectedTickets = () => {
        if (selectedTickets.size === 0) {
            alert("Please select at least one ticket to print.");
            return;
        }

        // Show print container
        const printArea = document.getElementById("print-area");
        printArea.style.display = "block";

        // Trigger print
        window.print();

        // Hide print container after print dialog (delay to ensure print dialog opened)
        setTimeout(() => {
            printArea.style.display = "none";
        }, 1000);
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
                        <h1 className="md:text-3xl sm:text-2xl text-xl">My Tickets</h1>
                    </div>
                </div>
            </div>
            <section className="px-20 pt-20">
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

                    <div>
                        <button
                            onClick={printSelectedTickets}
                            className="bg-blue-600 text-sm text-white py-1.5 px-9 rounded-xl border border-blue-600 hover:bg-blue-700 duration-500 transition-all flex items-center gap-2"
                        >
                            Print Selected Tickets
                        </button>
                    </div>
                </div>
                <div className="grid  gap-10">
                    {tickets.map((element, index) => (
                        <TicketCard
                            ticket={element}
                            checked={selectedTickets.has(element.id)}
                            onCheck={toggleSelectTicket}
                        />
                    ))}
                </div>

                <div id="print-area" style={{ display: "none" }}>
                    {tickets
                        .filter((t) => selectedTickets.has(t.id))
                        .map((ticket) => (
                            <>
                                <div className="my-4 print-ticket" key={ticket.id}>

                                    <TicketCard key={ticket.id} ticket={ticket} isForPrint={true} />
                                </div>
                            </>
                        ))}
                </div>

                <div className="mt-4">
                    {tickets.length > 0 && (
                        <Pagination
                            totalRecords={pagination.totalRecords}
                            currentPage={pagination.currentPage}
                            pageSize={pagination.pageSize}
                            totalPages={pagination.totalPages}
                            onPaginationChange={onPaginationChange}
                        />
                    )}
                </div>
            </section>
        </>
    );
};

export default Tickets;
