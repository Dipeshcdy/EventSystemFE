import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";
import { useAuth } from "../../context/AuthContext";
import TicketCard from "../../components/Event/TicketCard";
const pageSize = 10;
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
                <div className="mb-4 flex justify-end">
                    <button
                        onClick={printSelectedTickets}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Print Selected Tickets
                    </button>
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
            </section>
        </>
    );
};

export default Tickets;
