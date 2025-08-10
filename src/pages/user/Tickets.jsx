import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";
import { useAuth } from "../../context/AuthContext";
const pageSize = 10;
const Tickets = () => {
  const apiKey = import.meta.env["VITE_APP_BASE_URL"];
  const [search, setSearch] = useState("");
  const { setLoading } = useAuth();
  const [pageLoading, setPageLoading] = useState(true);
  const [tickets, setTickets] = useState([]);

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
    } catch (error) {}
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
      }
    } catch (error) {}
  };

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
            <h1 className="md:text-3xl sm:text-2xl text-xl">My Tickets</h1>
          </div>
        </div>
      </div>
      {/* <section className="px-20 pt-20">
        <div className="grid grid-cols-3 gap-8">
          {events.map((element, index) => (
            <EventCard element={element} />
          ))}
        </div>
      </section> */}
    </>
  );
};

export default Tickets;
