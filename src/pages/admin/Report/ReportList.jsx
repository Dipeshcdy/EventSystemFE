// src/pages/admin/Reports/ReportList.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import axiosInstance from "../../../services/axios";
import { useAuth } from "../../../context/AuthContext";
import { CiSearch } from "react-icons/ci";
import { Card, Typography, Chip } from "@material-tailwind/react";
import Pagination from "../../../components/Pagination";
import { Link } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";
import toast from "react-hot-toast";
import formatNepaliCurrency from "../../../utils/utils";
const TABLE_HEAD = [
  { head: "SN" },
  { head: "Event" },
  { head: "Organizer" },
  { head: "Ticket Types" },
  { head: "Amount" },
  { head: "Purchased Date" },
];

const pageSize = 10;

const statusColor = (status) => {
  switch ((status || "").toLowerCase()) {
    case "success":
      return "green";
    case "pending":
      return "amber";
    case "failed":
    case "cancelled":
      return "red";
    default:
      return "blue-gray";
  }
};

const formatTicketTypes = (tickets = []) =>
  tickets.map(t => `${t.ticketTypeName} × ${t.quantity}`).join(", ");


const ReportList = () => {
  const { setLoading, setActivePage } = useAuth();
  const [pageLoading, setPageLoading] = useState(true);
  setActivePage("report");
  const apiKey = import.meta.env["VITE_APP_BASE_URL"];

  // Filters
  const [search, setSearch] = useState("");
  const [organizerId, setOrganizerId] = useState("");
  const [eventId, setEventId] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState(""); // yyyy-mm-dd
  const [endDate, setEndDate] = useState("");     // yyyy-mm-dd

  // Data + pagination
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize,
    totalPages: null,
    totalRecords: null,
  });

  // Dropdown data
  const [organizers, setOrganizers] = useState([]);
  const [events, setEvents] = useState([]);

  const isFirstRender = useRef(true);

  // Build URL with filters + pagination
  const constructUrl = (currentPage, pageSizeParam) => {
    const base = `${apiKey}api/report/transactions`;
    const params = new URLSearchParams();

    if (search) params.append("search", search);
    if (organizerId) params.append("organizerId", organizerId);
    if (eventId) params.append("eventId", eventId);
    if (status) params.append("status", status);

    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    params.append("pageNumber", currentPage);
    params.append("pageSize", pageSizeParam);
    params.append("isAscending", "false");

    return `${base}?${params.toString()}`;
  };

  const fetchRows = async (currentPage = 1) => {
    const url = constructUrl(currentPage, pageSize);
    try {
      const res = await axiosInstance.get(url);
      if (res.status === 200) {
        // Expect response like: { data: { items, pageNumber, pageSize, totalPages, totalRecords, summary? } }
        const data = res.data.data ?? res.data; // supports either style
        setRows(data.items || []);
        setPagination({
          currentPage: data.pageNumber,
          pageSize: data.pageSize,
          totalPages: data.totalPages,
          totalRecords: data.totalRecords,
        });

        // Optional: API may return aggregate summary; fallback to compute
        if (data.extra) {
          setSummary({
            totalTransactions: data.totalRecords,
            totalRevenue: data.extra.totalRevenue,
            totalTicketsSold: data.extra.totalTicketsSold,
          })
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to load report");
    }
  };

  const fetchOrganizers = async () => {
    try {
      // Adjust endpoint to what you have (examples):
      // GET api/organizers/dropdown  OR  GET api/organizer?isDropdown=true
      const url = `${apiKey}api/organizer?status=Approved`;
      const res = await axiosInstance.get(url);
      if (res.status === 200) {
        // Expect: [{ id, name }]
        setOrganizers(res.data.data.items || res.data || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchEvents = async (orgId) => {
    try {
      // Adjust endpoint to your setup (examples):
      // GET api/event/dropdown?organizerId={orgId}
      // Fallback: GET api/event?organizerId={orgId}&pageSize=1000
      const url = `${apiKey}api/event?status=Accepted${orgId ? `&&organizerId=${orgId}` : ""
        }`;
      const res = await axiosInstance.get(url);
      if (res.status === 200) {
        // Expect: [{ id, title }]
        setEvents(res.data.data.items || res.data || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Initial load
  useEffect(() => {
    window.scrollTo(0, 0);
    const load = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchOrganizers(), fetchEvents(""), fetchRows(1)]);
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => {
          setLoading(false);
          setPageLoading(false);
        }, 400);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce: search
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const t = setTimeout(() => {
      fetchRows(1);
    }, 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // React to filter changes (instant fetch)
  useEffect(() => {
    fetchRows(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizerId, eventId, status, startDate, endDate]);

  const onPaginationChange = (p) => {
    setPagination(p);
    fetchRows(p.currentPage);
  };

  const onOrganizerChange = async (val) => {
    setOrganizerId(val);
    setEventId("");
    await fetchEvents(val || "");
  };

  const formattedDate = (iso) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      return d.toLocaleString();
    } catch {
      return iso;
    }
  };

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };


  const builUrlForCSVExport = () => {
    const base = `${apiKey}api/report/transactions/export/csv`;
    const params = new URLSearchParams();

    if (search) params.append("search", search);
    if (organizerId) params.append("organizerId", organizerId);
    if (eventId) params.append("eventId", eventId);
    if (status) params.append("status", status);

    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    params.append("isAscending", "false");
    return `${base}?${params.toString()}`;
  };


  const exportCsvServer = async () => {
    try {
      setLoading(true);
      const url = builUrlForCSVExport();
      const res = await axiosInstance.get(url, { responseType: "blob" });
      downloadBlob(res.data, `transactions_${Date.now()}.csv`);
      toast.success("CSV exported");
    } catch (e) {
      console.error(e);
      toast.error("CSV export failed");
    } finally {
      setLoading(false);
    }
  };


  const SummaryCards = useMemo(() => {
    if (!summary) return null;
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        <div className="p-4 border rounded-lg dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Revenue</p>
          <p className="text-lg font-semibold">
            {formatNepaliCurrency(summary.totalRevenue ?? 0)}
          </p>
        </div>
        <div className="p-4 border rounded-lg dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">Transactions</p>
          <p className="text-lg font-semibold">{summary.totalTransactions}</p>
        </div>
        <div className="p-4 border rounded-lg dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">Tickets Sold</p>
          <p className="text-lg font-semibold">{summary.totalTicketsSold}</p>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            onClick={exportCsvServer}
            className="bg-gray-800 text-white text-xs py-2 px-4 rounded-3xl hover:bg-gray-900 transition-all dark:bg-white dark:text-black dark:hover:bg-gray-200"
            title="Download CSV"
          >
            Export CSV
          </button>
        </div>
      </div>
    );
  }, [summary]);

  return (
    <>
      {!pageLoading && (
        <>
          <div>
            <h2 className="text-sm inline-block border-b-2 border-gray-400">
              Payments & Transactions
            </h2>
          </div>

          {/* Filters */}
          <div className="mt-5 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-4 justify-between">
              <div className="flex flex-wrap gap-3 items-center">
                {/* Search */}
                <div className="relative w-56">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <CiSearch className="text-gray-800 dark:text-white" />
                  </div>
                  <input
                    type="text"
                    className="bg-white border border-gray-300 placeholder:text-xs text-xs text-gray-900 rounded-3xl block w-full ps-10 px-2.5 py-2 outline-none dark:bg-black dark:text-white"
                    placeholder="Search by txn id, event, etc."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                {/* Organizer */}
                <select
                  className="bg-white border border-gray-300 text-xs text-gray-900 rounded-3xl px-3 py-2 outline-none dark:bg-black dark:text-white"
                  value={organizerId}
                  onChange={(e) => onOrganizerChange(e.target.value)}
                >
                  <option value="">All Organizers</option>
                  {organizers.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name || o.fullName || o.title}
                    </option>
                  ))}
                </select>

                {/* Event */}
                <select
                  className="bg-white border border-gray-300 text-xs text-gray-900 rounded-3xl px-3 py-2 outline-none dark:bg-black dark:text-white"
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value)}
                >
                  <option value="">All Events</option>
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title || ev.name}
                    </option>
                  ))}
                </select>

                {/* Date Range */}
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    className="bg-white border border-gray-300 text-xs text-gray-900 rounded-3xl px-3 py-2 outline-none dark:bg-black dark:text-white"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <span className="text-xs text-gray-500">to</span>
                  <input
                    type="date"
                    className="bg-white border border-gray-300 text-xs text-gray-900 rounded-3xl px-3 py-2 outline-none dark:bg-black dark:text-white"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

            </div>

            {/* Summary */}
            {SummaryCards}
          </div>



          {/* Table */}
          <div className="mt-3">
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
                  {rows.length > 0 ? (
                    rows.map((row, index) => {
                      const isLast = index === rows.length - 1;
                      const classes = isLast ? "p-3" : "p-3 border-b border-gray-300";
                      return (
                        <tr key={row.transactionId || row.id || index}>
                          <td className={classes}>
                            <Typography variant="small" className="font-bold">
                              {(pagination.currentPage - 1) * pagination.pageSize +
                                index +
                                1}
                            </Typography>
                          </td>

                          <td className={classes}>
                            <Typography variant="small" className="font-normal">
                              {row.eventTitle}
                            </Typography>
                          </td>

                          <td className={classes}>
                            <Typography variant="small" className="font-normal">
                              {row.organizerName || row.organizer?.name || "N/A"}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" className="font-normal" title={formatTicketTypes(row.tickets)}>
                              {formatTicketTypes(row.tickets) || "—"}
                            </Typography>
                          </td>

                          <td className={classes}>
                            <Typography variant="small" className="font-normal">
                              {formatNepaliCurrency(row.amount)}
                            </Typography>
                          </td>

                          <td className={classes}>
                            <Typography variant="small" className="font-normal">
                              {formattedDate(row.createdAt + "Z")}
                            </Typography>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={TABLE_HEAD.length} className="text-center py-6">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Card>
          </div>

          {/* Pagination */}
          <div className="mt-4">
            {rows.length > 0 && (
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
    </>
  );
};

export default ReportList;
