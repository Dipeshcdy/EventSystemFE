import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../../services/axios";
import { useAuth } from "../../../context/AuthContext";
import ImageUploadInput from "../../../components/ImageUploadInput";
import TextBox from "../../../components/TextBox";
import PlacesAutocomplete from "../../../components/LoactionPicker/PlacesAutoComplete";
import ConfirmModal from "../../../components/modal/ConfirmModal";
import RejectEventFormModal from "../../../components/modal/Event/RejectEventFormModal";
const initialEventState = {
    termsAndConditions: "",
    title: "",
    description: "",
    venue: "",
    location: "",
    startTime: "",
    endTime: "",
    startDate: "",
    endDate: "",
    bookingStart: "",
    bookingEnd: "",
    entryCloseTime: "",
    image: null,
    eventImages: [],
    latitude: "",
    longitude: "",
    eventCategories: null,
    eventTicketType: [{ name: "", price: "" }],
    removeImageIds: [],
};
const EventView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { loading, setLoading } = useAuth();
    const [pageLoading, setPageLoading] = useState(true); // 🔹 Local loading
    const apiKey = import.meta.env["VITE_APP_BASE_URL"];
    const [formData, setFormData] = useState(initialEventState);
    const [modalOpen, setModalOpen] = useState(false);
    const [approveModalOpen, setAcceptModalOpen] = useState(false);
    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            setLoading(true);
            if (id) {
                await fetchEventById(id);
            }
            setTimeout(() => {
                setLoading(false);
                setPageLoading(false);
            }, 500);
        };
        fetchData();
    }, []);

    const fetchEventById = async (id) => {
        try {
            const response = await axiosInstance.get(`${apiKey}api/event/${id}`);
            if (response.status === 200) {
                const data = response.data.data;

                setFormData({
                    id: data.id,
                    termsAndConditions: data.termsAndConditions || "",
                    title: data.title || "",
                    description: data.description || "",
                    venue: data.venue || "",
                    location: data.location || "",
                    startTime: data.startTime || "",
                    endTime: data.endTime || "",
                    startDate: data.startDate || "",
                    endDate: data.endDate || "",
                    bookingStart: data.bookingStart || "",
                    bookingEnd: data.bookingEnd || "",
                    entryCloseTime: data.entryCloseTime || "",
                    imageUrl: data.imageUrl || "", // for now, leave it null (you can show preview)
                    eventImages: data.eventImages || [], // you can show preview images
                    latitude: data.latitude?.toString() || "",
                    longitude: data.longitude?.toString() || "",
                    status: data.status || "",
                    remarks: data.remarks || "",
                    eventCategories: data.eventCategory
                        ? { value: data.eventCategory.id, label: data.eventCategory.name }
                        : null,
                    eventTicketType: data.eventTicketType.map((t) => ({
                        id: t.id,
                        name: t.name,
                        capacity: t.capacity,
                        price: t.price.toString(),
                        eventId: t.eventId.toString(),
                    })),
                });
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to load event");
        }
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleAcceptModalClose = () => {
        setAcceptModalOpen(false);
    };

    const handleAccept = async () => {
        if (!id) {
            toast.error("Something went wrong. Client ID is missing.");
            return;
        }

        setLoading(true);
        const url = `${apiKey}api/event/status`;

        const payload = {
            eventId: id, // assuming `id` is your event ID
            status: "Accepted", // or "Approved", depending on context
            remarks: "Approved by admin", // or any custom remarks
        };

        try {
            const response = await axiosInstance.put(url, payload);
            if (response.status === 200) {
                toast.success(response.data.message);
                navigate(-1);
                handleAcceptModalClose();
            }
        } catch (error) {
            console.error("Approval failed:", error);
            toast.error("Approval failed. Please try again.");
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 500);
        }
    };

    return (
        <>
            {!loading && !pageLoading && (
                <>
                    <div className="">
                        <div>
                            <h2 className="text-sm inline-block border-b-2 border-gray-400">
                                View Event
                            </h2>
                        </div>
                    </div>
                    <div className="mt-5">
                        <form action="">
                            <div className="mt-5">
                                <ImageUploadInput
                                    customKey="image"
                                    existingImageUrl={
                                        formData.imageUrl ? apiKey + formData.imageUrl : ""
                                    }
                                    isEditable={false}
                                />
                            </div>
                            <div className="grid md:grid-cols-2 gap-5 mt-5">
                                <TextBox value={formData.title} label="Title" readOnly={true} />
                                <TextBox value={formData.venue} label="Venue" readOnly={true} />
                                <TextBox
                                    value={formData.location}
                                    label="Location"
                                    readOnly={true}
                                />
                                <TextBox
                                    value={formData.startTime}
                                    label="Start Time"
                                    type="time"
                                    readOnly={true}
                                />
                                <TextBox
                                    value={formData.endTime}
                                    label="End Time"
                                    type="time"
                                    readOnly={true}
                                />
                                <TextBox
                                    value={formData.startDate}
                                    label="Start Date"
                                    type="date"
                                    readOnly={true}
                                />
                                <TextBox
                                    value={formData.endDate}
                                    label="End Date"
                                    type="date"
                                    readOnly={true}
                                />
                                <TextBox
                                    value={formData.bookingStart}
                                    label="Booking Start"
                                    type="datetime-local"
                                    readOnly={true}
                                />
                                <TextBox
                                    value={formData.bookingEnd}
                                    label="Booking End"
                                    type="datetime-local"
                                    readOnly={true}
                                />
                                <TextBox
                                    value={formData.entryCloseTime}
                                    label="Entry Close Time"
                                    type="time"
                                    readOnly={true}
                                />
                            </div>
                            <div className="mt-5 grid  gap-5">
                                <div>
                                    <div className="relative">
                                        <textarea
                                            type="text"
                                            id="website_url"
                                            className="block px-2.5 h-16 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                                            placeholder=" "
                                            value={formData.description}
                                            readOnly={true}
                                        ></textarea>
                                        <label
                                            htmlFor="website_url"
                                            className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-[1] origin-[0] bg-white dark:bg-black dark:text-white dark:peer-focus:text-blue-100 dark:peer-focus:outline-blue-200  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                        >
                                            Description
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <div className="relative">
                                        <textarea
                                            type="text"
                                            id="termsAndConditions"
                                            className="block px-2.5 h-16 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                                            placeholder=" "
                                            value={formData.termsAndConditions}
                                            readOnly={true}
                                        ></textarea>
                                        <label
                                            htmlFor="termsAndConditions"
                                            className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-[1] origin-[0] bg-white dark:bg-black dark:text-white dark:peer-focus:text-blue-100 dark:peer-focus:outline-blue-200  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                        >
                                            Terms and Conditions
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Event Categories */}

                            <div className="my-8 ">
                                <div className="flex justify-between items-center my-5">
                                    <div>
                                        <h2 className="text-sm inline-block border-b-2 border-gray-400">
                                            Location
                                        </h2>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="col-span-2">
                                        <PlacesAutocomplete
                                            formData={formData}
                                            setFormData={setFormData}
                                            isEditable={false}
                                        />
                                    </div>
                                    <TextBox
                                        value={formData.latitude}
                                        label="Latitude"
                                        readOnly={true}
                                    />
                                    <TextBox
                                        value={formData.longitude}
                                        label="Longitude"
                                        readOnly={true}
                                    />
                                </div>
                            </div>
                            {/*End of Event Categories */}
                            {/* Event Categories */}

                            <div className="my-8">
                                <div className="flex justify-between items-center my-5">
                                    <div>
                                        <h2 className="text-sm inline-block border-b-2 border-gray-400">
                                            Event Categories
                                        </h2>
                                    </div>
                                    {/* 
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCustomCategoryModalOpen(true);
                                        }}
                                        className="bg-blue-600 text-sm text-white py-1.5 px-4 rounded-xl border border-blue-600 hover:bg-blue-700 duration-500 transition-all "
                                    >
                                        Add Custom Categories
                                    </button>
                                     */}
                                </div>
                                <TextBox
                                    value={formData.eventCategories.label}
                                    label="Categories"
                                    readOnly={true}
                                />
                            </div>
                            {/*End of Event Categories */}

                            {/* Event Ticket Types */}
                            <div>
                                <div className="flex justify-between items-center my-5">
                                    <div>
                                        <h2 className="text-sm inline-block border-b-2 border-gray-400">
                                            Event Tickets
                                        </h2>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    {formData.eventTicketType &&
                                        formData.eventTicketType.map((option, index) => (
                                            <div
                                                key={index}
                                                className="border border-gray-300 rounded-lg p-5 pt-3"
                                            >
                                                <div className="grid grid-cols-2 gap-5 mt-2">
                                                    <TextBox
                                                        id={`tickettype_name_${index}`}
                                                        value={option.name}
                                                        label="Name"
                                                        readonly={true}
                                                    />

                                                    <TextBox
                                                        id={`tickettype_price_${index}`}
                                                        value={option.price}
                                                        label="Price"
                                                        readonly={true}
                                                    />
                                                    <TextBox
                                                        id={`tickettype_capacity_${index}`}
                                                        value={option.capacity}
                                                        label="Capacity"
                                                        readonly={true}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                            {/*End of Event Ticket Types */}

                            {/* Event Images */}
                            {formData.eventImages.length > 0 && (
                                <div>
                                    <div className="flex justify-between items-center my-5">
                                        <h2 className="text-sm inline-block border-b-2 border-gray-400">
                                            Event Images
                                        </h2>
                                    </div>

                                    {/* Preview Section */}
                                    <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                                        {formData.eventImages.map((img, idx) => {
                                            const imageSrc =
                                                img.preview || `${apiKey}${img.imageUrl}`;
                                            return (
                                                <div key={idx} className="relative group">
                                                    <img
                                                        src={imageSrc}
                                                        alt={`Event Image ${idx}`}
                                                        className="rounded-lg w-full h-36 object-cover border"
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Event Remarks*/}
                            {formData.remarks && (
                                <div>
                                    <div className="flex justify-between items-center my-5">
                                        <div>
                                            <h2 className="text-sm inline-block border-b-2 border-gray-400">
                                                Remarks
                                            </h2>
                                        </div>
                                    </div>
                                    <div >
                                        <p>
                                            {formData.remarks}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {/*End of Event Remarks*/}
                        </form>
                    </div>
                    <div className="flex justify-between mt-5">
                        <div>
                            <button
                                onClick={() => {
                                    navigate(-1);
                                }}
                                className="py-1.5 px-9 border border-blue-600 rounded-xl text-gray-900 hover:bg-blue-50 transition-all duration-500"
                            >
                                Back To List
                            </button>
                        </div>
                        {(formData.status === "Pending" ||
                            formData.status === "Rejected") && (
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setModalOpen(true)}
                                        className="bg-red-600 text-white py-1.5 px-9 rounded-xl border border-red-600 hover:bg-red-700 duration-500 transition-all"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => setAcceptModalOpen(true)}
                                        className="bg-blue-600 text-white py-1.5 px-9 rounded-xl border border-green-600 hover:bg-green-700 duration-500 transition-all"
                                    >
                                        Accept
                                    </button>
                                </div>
                            )}
                    </div>
                </>
            )}

            <RejectEventFormModal
                open={modalOpen}
                onClose={handleModalClose}
                loading={loading}
                setLoading={setLoading}
                selectedDataForEdit={formData}
                fetchData={() => navigate(-1)}
            />

            <ConfirmModal
                open={approveModalOpen}
                onClose={handleAcceptModalClose}
                submit={handleAccept}
                isDanger={false}
            />
        </>
    );
};

export default EventView;
