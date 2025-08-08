import React from "react";
import { useAuth } from "../../context/AuthContext";

const EventView = () => {
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
    } catch (error) {}
  };
  return (
    <>
    {!pageLoading && (
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
                    <h1 className="md:text-3xl sm:text-2xl text-xl">Events</h1>
                </div>
                </div>
            </div>
            <section className="px-20 pt-20">
                <div className="grid grid-cols-3 gap-8">
                {events.map((element, index) => (
                    <EventCard element={element} />
                ))}
                </div>
            </section>
        </>
    )}
    </>
  );
};

export default EventView;
