import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaXmark } from "react-icons/fa6";
import Select from "react-tailwindcss-select";
import { CiTrash } from "react-icons/ci";
import { getToken, logout } from "../../../utils/jwtUtils";
import toast from "react-hot-toast";
import axiosInstance from "../../../services/axios";
import { useAuth } from "../../../context/AuthContext";
import ImageUploadInput from "../../../components/ImageUploadInput";
import TextBox from "../../../components/TextBox";
import ModalLayout from "../../../components/modal/ModalLayout";
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
    images: [],
    latitude: "",
    longitude: "",
    capacity: "",
    eventCategories: null,
    eventTicketType: [{ name: "", price: "" }],
};
const EventForm = () => {
    const { id } = useParams();
    const { setActivePage, setActiveSubMenu, loading, setLoading } = useAuth();
    const [pageLoading, setPageLoading] = useState(true); // 🔹 Local loading
    setActivePage("menu");
    setActiveSubMenu("");
    const apiKey = import.meta.env["VITE_APP_BASE_URL"];
    const [formData, setFormData] = useState(initialEventState);
    const [formErrors, setFormErrors] = useState({
        eventTicketType: initialEventState.eventTicketType.map(() => ({})),
    });
    const [categories, setCategories] = useState([]);
    const [customCategoryModalOpen, setCustomCategoryModalOpen] = useState(false);
    const [customCategoryName, setCustomCategoryName] = useState("");
    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            setLoading(true);
            await fetchCategories();
            //   if (id) {
            //     await fetchEvent();
            //   }
            setTimeout(() => {
                setLoading(false);
                setPageLoading(false);
            }, 500);
        };
        fetchData();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get(`${apiKey}api/eventcategory`);
            if (response.status == 200) {
                console.log(response);
                var filteredCategories = response.data.data.items.map((item) => ({
                    value: item.id,
                    label: item.name,
                }));
                setCategories(filteredCategories);
            }
        } catch (error) { }
    };

    const validateInputField = (fieldName, value) => {
        let message = "";
        const trimmed = value?.toString().trim();

        switch (fieldName) {
            case "termsAndConditions":
            case "title":
            case "image":
            case "description":
            case "venue":
            case "location":
                if (!trimmed)
                    message = `${fieldName.replace(/([A-Z])/g, " $1")} is required`;
                break;

            case "startDate":
            case "endDate":
                if (!trimmed)
                    message = `${fieldName.replace(/([A-Z])/g, " $1")} is required`;
                else if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed))
                    message = "Invalid date format (expected yyyy-MM-dd)";
                break;

            case "startTime":
            case "endTime":
            case "entryCloseTime":
                if (trimmed && !/^\d{2}:\d{2}$/.test(trimmed))
                    message = "Invalid time format (expected HH:mm)";
                break;

            case "bookingStart":
            case "bookingEnd":
                if (!trimmed)
                    message = `${fieldName.replace(/([A-Z])/g, " $1")} is required`;
                else if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(trimmed))
                    message = "Invalid datetime format (expected yyyy-MM-ddTHH:mm)";
                break;

            case "latitude":
            case "longitude":
                if (!trimmed)
                    message = `${fieldName.replace(/([A-Z])/g, " $1")} is required`;
                else if (isNaN(Number(trimmed)))
                    message = `${fieldName.replace(/([A-Z])/g, " $1")} must be a number`;
                break;

            case "capacity":
                if (!trimmed) message = "Capacity is required";
                else if (!/^\d+$/.test(trimmed))
                    message = "Capacity must be a positive integer";
                break;

            case "eventCategoryId":
                if (!trimmed) message = "Event Category is required";
                break;

            default:
                // Optional generic required check
                if (!trimmed)
                    message = `${fieldName.replace(/([A-Z])/g, " $1")} is required`;
                break;
        }

        setFormErrors((prev) => ({ ...prev, [fieldName]: message }));
    };

    const handleInputChange = (field) => (valueOrEvent) => {
        let value = valueOrEvent;
        console.log(value);

        // Handle file inputs (single or multiple)
        if (valueOrEvent?.target) {
            const target = valueOrEvent.target;

            if (field === "image" && target.files?.[0]) {
                value = target.files[0];
            } else if (field === "images" && target.files?.length > 0) {
                value = Array.from(target.files); // multiple files as array
            } else {
                value = target.value;
            }
        }

        setFormData((prev) => ({ ...prev, [field]: value }));

        // Validate on change only fields relevant to event form
        if (
            [
                "image",
                "termsAndConditions",
                "title",
                "description",
                "venue",
                "location",
                "startTime",
                "endTime",
                "startDate",
                "endDate",
                "bookingStart",
                "bookingEnd",
                "entryCloseTime",
                "latitude",
                "longitude",
                "capacity",
                "eventCategoryId",
                "eventTicketType",
            ].includes(field)
        ) {
            validateInputField(field, value);
        }
    };
    const handleInputBlur = (field) => (e) => {
        const value = e.target ? e.target.value : e;
        validateInputField(field, value);
    };
    const addTicket = () => {
        setFormData((prev) => ({
            ...prev,
            eventTicketType: [...prev.eventTicketType, { name: "", price: "" }],
        }));
    };

    const removeTicket = (index) => {
        const updatedTickets = [...formData.eventTicketType];
        updatedTickets.splice(index, 1);
        setFormData((prev) => ({
            ...prev,
            eventTicketType: updatedTickets.length
                ? updatedTickets
                : [{ name: "", price: "" }],
        }));
        setFormErrors((prev) => ({
            ...prev,
            eventTicketType: updatedTickets.length
                ? updatedTickets.map(() => ({}))
                : [{}],
        }));
    };

    const handleCategoryChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            eventCategories: value,
        }));
    };

    const handleTicketInputChange = (index, field) => (e) => {
        const value = e.target.value;
        const updatedTickets = [...formData.eventTicketType];
        updatedTickets[index][field] = value;

        setFormData((prev) => ({
            ...prev,
            eventTicketType: updatedTickets,
        }));

        // Safely clear error
        const updatedErrors = [...(formErrors.eventTicketType || [])];
        if (!updatedErrors[index]) updatedErrors[index] = {};
        updatedErrors[index][field] = "";

        setFormErrors((prev) => ({
            ...prev,
            eventTicketType: updatedErrors,
        }));
    };

    const handleTicketInputBlur = (index, field) => (e) => {
        const value = e.target.value.trim();
        const updatedErrors = [...(formErrors.eventTicketType || [])];
        if (!updatedErrors[index]) updatedErrors[index] = {};

        // Validate "name"
        if (field === "name") {
            if (value === "") {
                updatedErrors[index][field] = "Name is required.";
            } else {
                const duplicate = formData.eventTicketType.some(
                    (ticket, i) =>
                        i !== index && ticket.name?.toLowerCase() === value.toLowerCase()
                );
                if (duplicate) {
                    updatedErrors[index][field] = "Ticket type already exists.";
                } else {
                    updatedErrors[index][field] = "";
                }
            }
        }

        // Validate "price" using regex
        else if (field === "price") {
            const priceRegex = /^\d+(\.\d{1,2})?$/;
            if (!priceRegex.test(value)) {
                updatedErrors[index][field] =
                    "Enter a valid price (e.g., 100 or 99.99)";
            } else {
                updatedErrors[index][field] = "";
            }
        }

        setFormErrors((prev) => ({
            ...prev,
            eventTicketType: updatedErrors,
        }));
    };

    const validateForm = () => {
        const errors = {};
        let isValid = true;

        const requiredFields = [
            "termsAndConditions",
            "title",
            "description",
            "venue",
            "location",
            "startTime",
            "endTime",
            "entryCloseTime",
            "startDate",
            "endDate",
            "bookingStart",
            "bookingEnd",
            "latitude",
            "longitude",
            "capacity",
            "image",
            "eventCategories",
        ];

        for (const field of requiredFields) {
            const value = formData[field];
            if (!value || (typeof value === "string" && !value.trim())) {
                // Converts camelCase to readable field names (e.g., "startDate" => "start Date")
                const readableField = field.replace(/([A-Z])/g, " $1");
                errors[field] = `${readableField.charAt(0).toUpperCase() + readableField.slice(1)} is required`;
                isValid = false;
            }
        }

        // Latitude & Longitude validation
        if (formData.latitude && isNaN(formData.latitude)) {
            errors.latitude = "Latitude must be a valid number";
            isValid = false;
        }
        if (formData.longitude && isNaN(formData.longitude)) {
            errors.longitude = "Longitude must be a valid number";
            isValid = false;
        }

        // Capacity validation (must be numeric and non-negative)
        if (formData.capacity && (!/^\d+$/.test(formData.capacity) || Number(formData.capacity) <= 0)) {
            errors.capacity = "Capacity must be a positive number";
            isValid = false;
        }

        // Time validation: endTime must be after startTime
        if (formData.startTime && formData.endTime) {
            const start = new Date(`1970-01-01T${formData.startTime}`);
            const end = new Date(`1970-01-01T${formData.endTime}`);
            if (start >= end) {
                errors.endTime = "End Time must be after Start Time";
                isValid = false;
            }
        }

        // Date validation: endDate must be after startDate
        if (formData.startDate && formData.endDate) {
            const startDate = new Date(formData.startDate);
            const endDate = new Date(formData.endDate);
            if (startDate > endDate) {
                errors.endDate = "End Date must be after Start Date";
                isValid = false;
            }
        }

        // Ticket validation
        if (
            !formData.eventTicketType ||
            formData.eventTicketType.length === 0
        ) {
            errors.eventTicketType = "At least one ticket type is required";
            isValid = false;
        } else {
            const ticketErrors = [];

            const ticketNames = new Set();
            formData.eventTicketType.forEach((ticket, i) => {
                const tErrors = {};

                if (!ticket.name || !ticket.name.trim()) {
                    tErrors.name = "Ticket name is required";
                    isValid = false;
                } else if (ticketNames.has(ticket.name.trim().toLowerCase())) {
                    tErrors.name = "Duplicate ticket name";
                    isValid = false;
                } else {
                    ticketNames.add(ticket.name.trim().toLowerCase());
                }

                if (
                    ticket.price === undefined ||
                    ticket.price === null ||
                    ticket.price === "" ||
                    isNaN(ticket.price) ||
                    Number(ticket.price) < 0
                ) {
                    tErrors.price = "Ticket price must be a valid non-negative number";
                    isValid = false;
                }

                ticketErrors[i] = tErrors;
            });

            errors.eventTicketType = ticketErrors;
        }

        setFormErrors(errors);
        return isValid;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Please fix errors before submitting");
            console.log(formErrors);
            return;
        }
        console.log(formData);
        return;

        const data = new FormData();
        data.append("Title", formData.title);
        data.append("Description", formData.description);
        data.append("Venue", formData.venue);
        data.append("Location", formData.location);
        data.append("TermsAndConditions", formData.termsAndConditions);
        data.append("StartTime", formData.startTime);
        data.append("EndTime", formData.endTime);
        data.append("StartDate", formData.startDate);
        data.append("EndDate", formData.endDate);
        data.append("BookingStart", formData.bookingStart);
        data.append("BookingEnd", formData.bookingEnd);
        if (formData.entryCloseTime)
            data.append("EntryCloseTime", formData.entryCloseTime);
        data.append("Latitude", formData.latitude);
        data.append("Longitude", formData.longitude);
        data.append("Capacity", formData.capacity);
        data.append("EventCategoryId", formData.eventCategoryId);

        if (formData.image) {
            data.append("Image", formData.image);
        }

        if (formData.images?.length) {
            formData.images.forEach((img) => {
                data.append("Images", img);
            });
        }

        // Ticket types - serialize as JSON
        data.append("EventTicketType", JSON.stringify(formData.eventTicketType));

        try {
            setLoading(true);
            const response = await axios.post(`${apiKey}api/events/create`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success(response.data.message);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const handleCustomCategoryAdd = () => {
        const trimmed = customCategoryName.trim();
        const alreadyExists = categories.some(
            (cat) => cat.label.toLowerCase() === trimmed.toLowerCase()
        );
        if (alreadyExists) {
            setFormErrors((prev) => ({
                ...prev,
                customCategoryName: "Already Exists",
            }));
            return;
        }
        const newCategory = {
            label: trimmed,
            value: trimmed, // Use label as value for non-backend items
            isCustom: true,
        };
        setCategories((prev) => [...prev, newCategory]);
        setCustomCategoryModalOpen(false);
        setCustomCategoryName(""); // reset input
        setFormErrors((prev) => ({ ...prev, customCategoryName: "" })); // clear error
    };

    const handleCustomCategoryModalClose = () => {
        setCustomCategoryModalOpen(false);
        setCustomCategoryName(""); // reset input
        setFormErrors((prev) => ({ ...prev, customCategoryName: "" })); // clear error
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData((prev) => ({
            ...prev,
            eventImages: [...prev.eventImages, ...files],
        }));
    };

    const removeImage = (index) => {
        setFormData((prev) => {
            const updatedImages = [...prev.eventImages];
            updatedImages.splice(index, 1);
            return {
                ...prev,
                eventImages: updatedImages,
            };
        });
    };

    return (
        <>
            {!loading && !pageLoading && (
                <>
                    <div className="">
                        <div>
                            <h2 className="text-sm inline-block border-b-2 border-gray-400">
                                {id ? "Edit" : "Create"} Event
                            </h2>
                        </div>
                    </div>
                    <div className="mt-5">
                        <form action="">
                            <div className="mt-5">
                                <ImageUploadInput
                                    setFile={handleInputChange("image")}
                                    customKey="image"
                                    error={formErrors.image}
                                />
                            </div>
                            <div className="grid md:grid-cols-2 gap-5 mt-5">
                                <TextBox
                                    value={formData.title}
                                    label="Title"
                                    onchange={handleInputChange("title")}
                                    onBlur={handleInputBlur("title")}
                                    error={formErrors.title}
                                />
                                <TextBox
                                    value={formData.venue}
                                    label="Venue"
                                    onchange={handleInputChange("venue")}
                                    onBlur={handleInputBlur("venue")}
                                    error={formErrors.venue}
                                />
                                <TextBox
                                    value={formData.location}
                                    label="Location"
                                    onchange={handleInputChange("location")}
                                    onBlur={handleInputBlur("location")}
                                    error={formErrors.location}
                                />
                                <TextBox
                                    value={formData.startTime}
                                    label="Start Time"
                                    onchange={handleInputChange("startTime")}
                                    onBlur={handleInputBlur("startTime")}
                                    error={formErrors.startTime}
                                    type="time"
                                />
                                <TextBox
                                    value={formData.endTime}
                                    label="End Time"
                                    onchange={handleInputChange("endTime")}
                                    onBlur={handleInputBlur("endTime")}
                                    error={formErrors.endTime}
                                    type="time"
                                />
                                <TextBox
                                    value={formData.startDate}
                                    label="Start Date"
                                    onchange={handleInputChange("startDate")}
                                    onBlur={handleInputBlur("startDate")}
                                    error={formErrors.startDate}
                                    type="date"
                                />
                                <TextBox
                                    value={formData.endDate}
                                    label="End Date"
                                    onchange={handleInputChange("endDate")}
                                    onBlur={handleInputBlur("endDate")}
                                    error={formErrors.endDate}
                                    type="date"
                                />
                                <TextBox
                                    value={formData.bookingStart}
                                    label="Booking Start"
                                    onchange={handleInputChange("bookingStart")}
                                    onBlur={handleInputBlur("bookingStart")}
                                    error={formErrors.bookingStart}
                                    type="datetime-local"
                                />
                                <TextBox
                                    value={formData.bookingEnd}
                                    label="Booking End"
                                    onchange={handleInputChange("bookingEnd")}
                                    onBlur={handleInputBlur("bookingEnd")}
                                    error={formErrors.bookingEnd}
                                    type="datetime-local"
                                />
                                <TextBox
                                    value={formData.entryCloseTime}
                                    label="Entry Close Time"
                                    onchange={handleInputChange("entryCloseTime")}
                                    onBlur={handleInputBlur("entryCloseTime")}
                                    error={formErrors.entryCloseTime}
                                    type="time"
                                />

                                <TextBox
                                    value={formData.latitude}
                                    label="Latitude"
                                    onchange={handleInputChange("latitude")}
                                    onBlur={handleInputBlur("latitude")}
                                    error={formErrors.latitude}
                                />
                                <TextBox
                                    value={formData.longitude}
                                    label="Longitude"
                                    onchange={handleInputChange("longitude")}
                                    onBlur={handleInputBlur("longitude")}
                                    error={formErrors.longitude}
                                />
                                <TextBox
                                    value={formData.capacity}
                                    label="Capacity"
                                    onchange={handleInputChange("capacity")}
                                    onBlur={handleInputBlur("capacity")}
                                    error={formErrors.capacity}
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
                                            onChange={handleInputChange("description")}
                                            onBlur={handleInputBlur("description")}
                                        ></textarea>
                                        <label
                                            htmlFor="website_url"
                                            className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-[1] origin-[0] bg-white dark:bg-black dark:text-white dark:peer-focus:text-blue-100 dark:peer-focus:outline-blue-200  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                        >
                                            Description
                                        </label>
                                    </div>
                                    {formErrors.description && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {formErrors.description}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <div className="relative">
                                        <textarea
                                            type="text"
                                            id="termsAndConditions"
                                            className="block px-2.5 h-16 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                                            placeholder=" "
                                            value={formData.termsAndConditions}
                                            onChange={handleInputChange("termsAndConditions")}
                                            onBlur={handleInputBlur("termsAndConditions")}
                                        ></textarea>
                                        <label
                                            htmlFor="termsAndConditions"
                                            className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-[1] origin-[0] bg-white dark:bg-black dark:text-white dark:peer-focus:text-blue-100 dark:peer-focus:outline-blue-200  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                        >
                                            Terms and Conditions
                                        </label>
                                    </div>
                                    {formErrors.termsAndConditions && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {formErrors.termsAndConditions}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Event Categories */}

                            <div className="my-8">
                                <div className="flex justify-between items-center my-5">
                                    <div>
                                        <h2 className="text-sm inline-block border-b-2 border-gray-400">
                                            Event Categories
                                        </h2>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCustomCategoryModalOpen(true);
                                        }}
                                        className="bg-blue-600 text-sm text-white py-1.5 px-4 rounded-xl border border-blue-600 hover:bg-blue-700 duration-500 transition-all "
                                    >
                                        Add Custom Categories
                                    </button>
                                </div>
                                <div className="relative">
                                    <Select
                                        value={formData.eventCategories}
                                        // classNames="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                                        isMultiple={true}
                                        isSearchable={true}
                                        isClearable={true}
                                        formatOptionLabel={(data) => (
                                            <div className="p-2 text-xs flex items-center justify-between cursor-pointer hover:bg-blue-100 transition-all duration-300 ease-linear">
                                                <span className="">{data.label}</span>
                                            </div>
                                        )}
                                        onChange={handleCategoryChange}
                                        options={categories}
                                        formatGroupLabel={(data) => (
                                            <div
                                                className={`py-2 text-xs flex items-center justify-between`}
                                            >
                                                <span className="font-bold">{data.label}</span>
                                                <span className="bg-gray-200 h-5 p-1.5 flex items-center justify-center rounded-full">
                                                    {data.options.length}
                                                </span>
                                            </div>
                                        )}
                                    />
                                    <label
                                        for="extras"
                                        class="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-[1] origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                    >
                                        Categories
                                    </label>
                                    {formErrors.eventCategories && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {formErrors.eventCategories}
                                        </p>
                                    )}
                                </div>
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
                                    <button
                                        type="button"
                                        onClick={addTicket}
                                        className="bg-blue-600 text-sm text-white py-1.5 px-4 rounded-xl border border-blue-600 hover:bg-blue-700 duration-500 transition-all "
                                    >
                                        Add Ticket Types
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    {formData.eventTicketType &&
                                        formData.eventTicketType.map((option, index) => (
                                            <div
                                                key={index}
                                                className="border border-gray-300 rounded-lg p-5 pt-3"
                                            >
                                                <div className="flex justify-end">
                                                    <CiTrash
                                                        onClick={() => {
                                                            removeTicket(index);
                                                        }}
                                                        className="text-xl text-red-600 cursor-pointer"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-5 mt-2">
                                                    <TextBox
                                                        id={`tickettype_name_${index}`}
                                                        value={option.name}
                                                        label="Name"
                                                        onchange={handleTicketInputChange(index, "name")}
                                                        onBlur={handleTicketInputBlur(index, "name")}
                                                        error={
                                                            formErrors.eventTicketType[index]?.name || ""
                                                        }
                                                    />

                                                    <TextBox
                                                        id={`tickettype_price_${index}`}
                                                        value={option.price}
                                                        label="Price"
                                                        onchange={handleTicketInputChange(index, "price")}
                                                        onBlur={handleTicketInputBlur(index, "price")}
                                                        error={
                                                            formErrors.eventTicketType[index]?.price || ""
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                            {/*End of Event Ticket Types */}

                            {/* Event Images */}
                            <div>
                                <div className="flex justify-between items-center my-5">
                                    <h2 className="text-sm inline-block border-b-2 border-gray-400">
                                        Event Images
                                    </h2>
                                    <label className="bg-blue-600 text-sm text-white py-1.5 px-4 rounded-xl border border-blue-600 hover:bg-blue-700 duration-500 transition-all cursor-pointer">
                                        Add Images
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            hidden
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files);
                                                const imagesWithPreview = files.map((file) => ({
                                                    file,
                                                    preview: URL.createObjectURL(file),
                                                }));
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    images: [...prev.images, ...imagesWithPreview],
                                                }));
                                            }}
                                        />
                                    </label>
                                </div>

                                {/* Preview Section */}
                                {formData.images.length > 0 && (
                                    <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                                        {formData.images.map((img, idx) => (
                                            <div key={idx} className="relative group">
                                                <img
                                                    src={img.preview}
                                                    alt={`Event Image ${idx}`}
                                                    className="rounded-lg w-full h-36 object-cover border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData((prev) => {
                                                            const updated = [...prev.images];
                                                            URL.revokeObjectURL(updated[idx].preview); // clean memory
                                                            updated.splice(idx, 1);
                                                            return { ...prev, images: updated };
                                                        });
                                                    }}
                                                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-90 group-hover:opacity-100 transition-opacity"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                    <div className="flex justify-between mt-5">
                        <div>
                            <Link
                                to="/product-management"
                                className="py-1.5 px-9 border border-blue-600 rounded-xl text-gray-900 hover:bg-blue-50 transition-all duration-500"
                            >
                                Back To List
                            </Link>
                        </div>
                        <div>
                            <button
                                onClick={handleSubmit}
                                className="bg-blue-600 text-white py-1.5 px-9 rounded-xl border border-blue-600 hover:bg-blue-700 duration-500 transition-all"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </>
            )}

            <ModalLayout
                open={customCategoryModalOpen}
                onClose={handleCustomCategoryModalClose}
                submit={handleCustomCategoryAdd}
                className=""
            >
                <div className="p-5">
                    <div className="">
                        <h2 className="text-sm inline-block border-b-2 border-gray-400">
                            Add Custom Event Category
                        </h2>
                    </div>
                    <div className="mt-5">
                        <div className="mt-5 flex-grow">
                            <TextBox
                                value={customCategoryName}
                                label="Name"
                                onchange={(e) => {
                                    setCustomCategoryName(e.target.value);
                                }}
                                error={formErrors.customCategoryName}
                            />
                        </div>
                    </div>
                </div>
            </ModalLayout>
        </>
    );
};

export default EventForm;
