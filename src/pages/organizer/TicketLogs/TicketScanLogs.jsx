// src/pages/admin/TicketLogs/TicketScanLogs.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import axiosInstance from "../../../services/axios";
import { useAuth } from "../../../context/AuthContext";
import { CiSearch } from "react-icons/ci";
import { Card, Typography } from "@material-tailwind/react";
import Pagination from "../../../components/Pagination";
import toast from "react-hot-toast";

const TABLE_HEAD = [
    { head: "SN" },
    { head: "Ticket No" },
    { head: "Purchaser" },
    { head: "Ticket Type" },
    { head: "Event" },
    { head: "Organizer" },
    { head: "Category" },
    { head: "Scanned By" },
    { head: "Scanned At" },
];

const pageSize = 10;

const TicketScanLogs = () => {
    const { setLoading, setActivePage } = useAuth();
    setActivePage("ticket-logs");

    const [pageLoading, setPageLoading] = useState(true);
    const apiKey = import.meta.env["VITE_APP_BASE_URL"];

    // Filters
    const [search, setSearch] = useState("");
    const [eventCategoryId, setEventCategoryId] = useState("");
    const [eventId, setEventId] = useState("");
    const [ticketTypeId, setTicketTypeId] = useState("");
    const [startDate, setStartDate] = useState(""); // yyyy-mm-dd
    const [endDate, setEndDate] = useState("");     // yyyy-mm-dd

    // Data + pagination
    const [rows, setRows] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize,
        totalPages: null,
        totalRecords: null,
    });

    // Dropdown data
    const [eventCategories, setEventCategories] = useState([]);
    const [events, setEvents] = useState([]);
    const [ticketTypes, setTicketTypes] = useState([]);

    const isFirstRender = useRef(true);

    // NOTE: Adjust base path if your controller uses a different route.
    // Controller shows: [HttpGet("logs/admin")] in (likely) TicketLogController -> /api/ticket/logs/admin
    const BASE_PATH = `${apiKey}api/ticketLog/logs/organizer`;

    // Build URL with filters + pagination
    const constructUrl = (currentPage, size) => {
        const params = new URLSearchParams();

        if (search) params.append("search", search);
        if (eventCategoryId) params.append("eventCategoryId", eventCategoryId);
        if (eventId) params.append("eventId", eventId);
        if (ticketTypeId) params.append("ticketTypeId", ticketTypeId);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        params.append("pageNumber", currentPage);
        params.append("pageSize", size);
        params.append("isAscending", "false");

        return `${BASE_PATH}?${params.toString()}`;
    };

    const fetchRows = async (currentPage = 1) => {
        try {
            const url = constructUrl(currentPage, pageSize);
            const res = await axiosInstance.get(url);
            if (res.status === 200) {
                // Expect ApiResponse<PagedResponseDto<GetTicketScanLogDto>>
                const envelope = res.data?.data ?? res.data;
                console.log(envelope?.items);
                setRows(envelope?.items || []);
                setPagination({
                    currentPage: envelope?.pageNumber ?? currentPage,
                    pageSize: envelope?.pageSize ?? pageSize,
                    totalPages: envelope?.totalPages ?? 1,
                    totalRecords: envelope?.totalRecords ?? (envelope?.items?.length ?? 0),
                });
            }
        } catch (e) {
            console.error(e);
            toast.error("Failed to load ticket scan logs");
        }
    };

    // --- Dropdown data fetchers (adjust endpoints to your API) ---
    const fetchEventCategories = async () => {
        try {
            // Example endpoints:
            // GET api/event-categories?isActive=true&pageSize=1000
            const url = `${apiKey}api/eventCategory?pageNumber=1&pageSize=1000&isActive=true`;
            const res = await axiosInstance.get(url);
            if (res.status === 200) {
                setEventCategories(res.data?.data?.items || res.data?.data || res.data || []);
            }
        } catch (e) {
            console.error(e);
        }
    };

    // fetchEvents keeps the same but no ticket type fetch is needed after this
    const fetchEvents = async (categoryId) => {
        try {
            // Use your actual endpoint; sample below returns items that include eventTicketType[]
            const url = `${apiKey}api/event?status=Accepted${categoryId ? `&eventCategoryId=${categoryId}` : ""}&pageNumber=1&pageSize=1000`;
            const res = await axiosInstance.get(url);
            if (res.status === 200) {
                // payload like in your sample: { data: { items: [ { ..., eventTicketType: [...] }, ... ] } }
                const list = res.data?.data?.items || res.data?.data || res.data || [];
                setEvents(list);

                // If current selected event no longer exists under this category, reset both
                const stillExists = list.some(e => e.id === eventId);
                if (!stillExists) {
                    setEventId("");
                    setTicketTypes([]); // clear ticket types when event reset
                } else {
                    // if it exists, refresh ticket types from that event
                    const selected = list.find(e => e.id === eventId);
                    setTicketTypes(selected?.eventTicketType || []);
                }
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
                await Promise.all([fetchEventCategories(), fetchEvents(""), fetchRows(1)]);
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
    }, [eventCategoryId, eventId, ticketTypeId, startDate, endDate]);

    // dependent dropdowns
    useEffect(() => {
        // When category changes -> refresh events and reset downstream if needed
        setEventId("");
        setTicketTypes([]);
        fetchEvents(eventCategoryId || "");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventCategoryId]);

    useEffect(() => {
        // When event changes -> ticket types come from the selected event object
        setTicketTypeId("");
        if (!eventId) {
            setTicketTypes([]);
        } else {
            const selected = events.find(e => e.id === eventId);
            setTicketTypes(selected?.eventTicketType || []);
        }
        // fetch rows already runs in the other effect that watches eventId
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventId, events]);


    const onPaginationChange = (p) => {
        setPagination(p);
        fetchRows(p.currentPage);
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

    const buildUrlForCSVExport = () => {
        // If you expose an export endpoint:
        // [HttpGet("logs/admin/export/csv")]
        const base = `${apiKey}api/ticketlog/log/export/csv`;
        const params = new URLSearchParams();

        if (search) params.append("search", search);
        if (eventCategoryId) params.append("eventCategoryId", eventCategoryId);
        if (eventId) params.append("eventId", eventId);
        if (ticketTypeId) params.append("ticketTypeId", ticketTypeId);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        params.append("isAscending", "false");
        return `${base}?${params.toString()}`;
    };

    const exportCsvServer = async () => {
        try {
            setLoading(true);
            const url = buildUrlForCSVExport();
            const res = await axiosInstance.get(url, { responseType: "blob" });
            downloadBlob(res.data, `ticket_scan_logs_${Date.now()}.csv`);
            toast.success("CSV exported");
        } catch (e) {
            console.error(e);
            toast.error("CSV export failed");
        } finally {
            setLoading(false);
        }
    };

    const HeaderAndFilters = useMemo(() => (
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
                            placeholder="Search by ticket no, purchaser, event..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Event Category */}
                    <select
                        className="bg-white border border-gray-300 text-xs text-gray-900 rounded-3xl px-3 py-2 outline-none dark:bg-black dark:text-white"
                        value={eventCategoryId}
                        onChange={(e) => setEventCategoryId(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {eventCategories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name || c.title}
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

                    {/* Ticket Type */}
                    <select
                        className="bg-white border border-gray-300 text-xs text-gray-900 rounded-3xl px-3 py-2 outline-none dark:bg-black dark:text-white"
                        value={ticketTypeId}
                        onChange={(e) => setTicketTypeId(e.target.value)}
                        disabled={!eventId}  // optional: disable until an event is chosen
                    >
                        <option value="">All Ticket Types</option>
                        {ticketTypes.map((tt) => (
                            <option key={tt.id} value={tt.id}>
                                {/* show price if helpful */}
                                {tt.name}{typeof tt.price !== "undefined" ? ` — ${tt.price}` : ""}
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

                {/* Actions */}
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
        </div>
    ), [search, eventCategoryId, eventId, ticketTypeId, startDate, endDate, eventCategories, events, ticketTypes]);

    return (
        <>
            {!pageLoading && (
                <>
                    <div>
                        <h2 className="text-sm inline-block border-b-2 border-gray-400">
                            Ticket Scan Logs
                        </h2>
                    </div>

                    {/* Filters */}
                    {HeaderAndFilters}

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
                                                <tr key={index}>
                                                    <td className={classes}>
                                                        <Typography variant="small" className="font-bold">
                                                            {(pagination.currentPage - 1) * pagination.pageSize + index + 1}
                                                        </Typography>
                                                    </td>

                                                    <td className={classes}>
                                                        <Typography variant="small" className="font-normal">
                                                            {row.ticketNo}
                                                        </Typography>
                                                    </td>

                                                    <td className={classes}>
                                                        <Typography variant="small" className="font-normal">
                                                            {row.ticketPurchaser}
                                                        </Typography>
                                                    </td>

                                                    <td className={classes}>
                                                        <Typography variant="small" className="font-normal">
                                                            {row.ticketType}
                                                        </Typography>
                                                    </td>

                                                    <td className={classes}>
                                                        <Typography variant="small" className="font-normal">
                                                            {row.event}
                                                        </Typography>
                                                    </td>

                                                    <td className={classes}>
                                                        <Typography variant="small" className="font-normal">
                                                            {row.eventOrganizer}
                                                        </Typography>
                                                    </td>

                                                    <td className={classes}>
                                                        <Typography variant="small" className="font-normal">
                                                            {row.eventCategory}
                                                        </Typography>
                                                    </td>

                                                    <td className={classes}>
                                                        <Typography variant="small" className="font-normal">
                                                            {row.scanningUser}
                                                        </Typography>
                                                    </td>

                                                    <td className={classes}>
                                                        <Typography variant="small" className="font-normal">
                                                            {/* CreatedAt is DateTime from API; add Z to ensure UTC parsing if needed */}
                                                            {row.createdAt ? new Date(row.createdAt + "Z").toLocaleString() : ""}
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

export default TicketScanLogs;
