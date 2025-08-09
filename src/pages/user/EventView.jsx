import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../services/axios";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import {
  IoCalendarOutline,
  IoCloseCircleOutline,
  IoLocationOutline,
  IoPeopleOutline,
  IoPricetagsOutline,
  IoTimeOutline,
} from "react-icons/io5";
import {
  formatDate,
  formatTime,
  formatTimeWithDateTime,
} from "../../utils/dateFormatter";
import PropTypes, { element } from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Masonry from "@mui/lab/Masonry";
import Fancybox from "../../components/User/FancyBox";
import formatNepaliCurrency from "../../utils/utils";
import TicketSelector from "../../components/User/Event/TicketSelector";
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const EventView = () => {
  const { id } = useParams();
  const { setLoading } = useAuth();
  const [pageLoading, setPageLoading] = useState(true);
  const apiKey = import.meta.env["VITE_APP_BASE_URL"];
  const [event, setEvent] = useState(null);
  const [tab, setTab] = useState(0);

  const [quantities, setQuantities] = useState(null);

  const updateQuantity = (index, newValue) => {
    if (newValue >= 0) {
      setQuantities((prev) =>
        prev.map((qty, i) => (i === index ? newValue : qty))
      );
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadData = async () => {
      try {
        setLoading(true);
        if (id) {
          await fetchData(id);
        }
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

  const fetchData = async (id) => {
    try {
      const response = await axiosInstance.get(`${apiKey}api/event/${id}`);
      if (response.status === 200) {
        const data = response.data.data;
        setEvent(data);
        setQuantities(data.eventTicketType?.map(() => 0) || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load event");
    }
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <>
      {!pageLoading && (
        <>
          <div
            style={{
              backgroundImage: `url('${apiKey + event.imageUrl}')`,
            }}
            className="bg-cover bg-center h-56 relative"
          >
            <div className="absolute inset-0 bg-black bg-opacity-70 text-white flex items-center sm:px-10 px-6">
              <div className="2xl:max-w-[1650px] xl:max-w-[1250px] w-full mx-auto">
                <h1 className="md:text-3xl sm:text-2xl text-xl">
                  {event.title}
                </h1>
              </div>
            </div>
          </div>
          <section className="px-20 pt-20 grid grid-cols-3 gap-8">
            <div className="col-span-2 space-y-4">
              <div>
                <img src={`${apiKey + event.imageUrl}`} alt="" />
              </div>
              <div>
                <h1 className="md:text-3xl sm:text-2xl text-xl">
                  {event.title}
                </h1>
              </div>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <IoLocationOutline className="text-lg" />
                  <h2 className="text-sm">
                    {event.venue}, {event.location}
                  </h2>
                </div>
                <div className="flex gap-2">
                  <IoCalendarOutline />
                  <h2 className="text-sm">
                    {event.startDate === event.endDate
                      ? formatDate(event.startDate)
                      : `${formatDate(event.startDate)} - ${formatDate(
                          event.endDate
                        )}`}
                  </h2>
                </div>

                <div className="flex gap-2">
                  <IoTimeOutline />
                  <h2 className="text-sm">
                    {event.startTime === event.endTime
                      ? formatTime(event.startTime)
                      : `${formatTime(event.startTime)} - ${formatTime(
                          event.endTime
                        )}`}
                  </h2>
                </div>

                {/* Booking Start/End */}
                <div className="flex gap-2">
                  <IoCalendarOutline />
                  <h2 className="text-sm">
                    Booking:{" "}
                    {`${formatDate(
                      event.bookingStart
                    )} ${formatTimeWithDateTime(event.bookingStart)}`}{" "}
                    -{" "}
                    {`${formatDate(event.bookingEnd)} ${formatTimeWithDateTime(
                      event.bookingEnd
                    )}`}
                  </h2>
                </div>

                {/* Entry Close Time */}
                <div className="flex gap-2">
                  <IoCloseCircleOutline />
                  <h2 className="text-sm">
                    Entry Closes at: {formatTime(event.entryCloseTime)}
                  </h2>
                </div>

                {/* Category */}
                <div className="flex gap-2">
                  <IoPricetagsOutline />
                  <h2 className="text-sm">
                    Category: {event.eventCategory?.name}
                  </h2>
                </div>

                {/* Capacity */}
                <div className="flex gap-2">
                  <IoPeopleOutline />
                  <h2 className="text-sm">Capacity: {event.capacity}</h2>
                </div>

                <div>
                  <Box sx={{ width: "100%" }}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <Tabs
                        value={tab}
                        onChange={handleTabChange}
                        aria-label="basic tabs example"
                      >
                        <Tab
                          className="!normal-case"
                          label="Event Images"
                          {...a11yProps(0)}
                        />
                        <Tab
                          className="!normal-case"
                          label="Terms and Conditions"
                          {...a11yProps(1)}
                        />
                        <Tab
                          className="!normal-case"
                          label="Description"
                          {...a11yProps(1)}
                        />
                      </Tabs>
                    </Box>
                    <CustomTabPanel value={tab} index={0}>
                      <div className="py-5">
                        <Box>
                          <Masonry
                            columns={{ xs: 1, sm: 2, lg: 3, xl: 3 }}
                            spacing={2}
                          >
                            {event.eventImages.length > 0 &&
                              event.eventImages.map((image, index) => (
                                <div key={index} className="relative">
                                  <Fancybox
                                    options={{
                                      Carousel: {
                                        infinite: false,
                                      },
                                    }}
                                  >
                                    <a
                                      href={apiKey + image.imageUrl}
                                      key={index}
                                      data-fancybox={`gallery-${index}`}
                                      className="gallery-item relative"
                                    >
                                      <img
                                        src={apiKey + image.imageUrl}
                                        alt={event.title}
                                      />
                                    </a>
                                  </Fancybox>
                                </div>
                              ))}
                          </Masonry>
                        </Box>
                      </div>
                    </CustomTabPanel>
                    <CustomTabPanel value={tab} index={1}>
                      <div className="py-5">
                        <p className="text-base text-justify">
                          {event.description}
                        </p>
                      </div>
                    </CustomTabPanel>
                    <CustomTabPanel value={tab} index={2}>
                      <div className="py-5">
                        <p className="text-base text-justify">
                          {event.termsAndConditions}
                        </p>
                      </div>
                    </CustomTabPanel>
                  </Box>
                </div>
              </div>
            </div>

            <div>
              <TicketSelector event={event} />
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default EventView;
