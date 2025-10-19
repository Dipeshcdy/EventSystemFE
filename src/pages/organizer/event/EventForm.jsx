import { useEffect, useState } from "react";
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
import PlacesAutocomplete from "../../../components/LoactionPicker/PlacesAutoComplete";
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
const EventForm = ({ id = null, isViewMode = false }) => {
  const navigate = useNavigate();
  const { loading, setLoading } = useAuth();
  const [pageLoading, setPageLoading] = useState(true); // 🔹 Local loading
  const apiKey = import.meta.env["VITE_APP_BASE_URL"];
  const [formData, setFormData] = useState(initialEventState);
  const [formErrors, setFormErrors] = useState({
    eventTicketType: initialEventState.eventTicketType.map(() => ({})),
  });
  const [removedImageIds, setRemovedImageIds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customCategoryModalOpen, setCustomCategoryModalOpen] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      setLoading(true);
      await fetchCategories();
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
  const fetchEventById = async (id) => {
    try {
      const response = await axiosInstance.get(`${apiKey}api/event/${id}`);
      if (response.status === 200) {
        const data = response.data.data;

        setFormData({
          termsAndConditions: data.termsAndConditions || "",
          title: data.title || "",
          description: data.description || "",
          status: data.status || "",
          remarks: data.remarks || "",
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



      case "eventCategoryId":
        if (!trimmed) message = "Event Category is required";
        break;

      default:
        // Optional generic required check
        if (!trimmed)
          message = `${fieldName.replace(/([A-Z])/g, " $1")} is required`;
        break;
    }

    // ✅ Additional rule for entryCloseTime
    if (fieldName === "entryCloseTime" && !message) {
      const start = formValues.startTime?.trim();
      const end = formValues.endTime?.trim();

      if (start && /^\d{2}:\d{2}$/.test(start) && /^\d{2}:\d{2}$/.test(trimmed)) {
        const [sh, sm] = start.split(":").map(Number);
        const [eh, em] = (end || "23:59").split(":").map(Number);
        const [ch, cm] = trimmed.split(":").map(Number);

        const startMinutes = sh * 60 + sm;
        const endMinutes = eh * 60 + em;
        const closeMinutes = ch * 60 + cm;

        if (closeMinutes < startMinutes)
          message = "Entry close time cannot be before start time";
        else if (closeMinutes > endMinutes)
          message = "Entry close time cannot be after end time";
      }
    }


    setFormErrors((prev) => ({ ...prev, [fieldName]: message }));
  };

  const handleInputChange = (field) => (valueOrEvent) => {
    let value = valueOrEvent;

    // Handle file inputs (single or multiple)
    if (valueOrEvent?.target) {
      const target = valueOrEvent.target;

      if (field === "image" && target.files?.[0]) {
        value = target.files[0];
      } else if (field === "eventImages" && target.files?.length > 0) {
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
      eventTicketType: [...prev.eventTicketType, { name: "", price: "", capacity: "" }],
    }));
  };

  const removeTicket = (index) => {
    const updatedTickets = [...formData.eventTicketType];
    updatedTickets.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      eventTicketType: updatedTickets.length
        ? updatedTickets
        : [{ name: "", price: "", capacity: "" }],
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
      if (!value) updatedErrors[index][field] = "Price is required";
      else if (!priceRegex.test(value)) {
        updatedErrors[index][field] =
          "Enter a valid price (e.g., 100 or 99.99)";
      } else {
        updatedErrors[index][field] = "";
      }
    }
    else if (field === "capacity") {
      const capacityRegex = /^\d+$/;
      if (!value) updatedErrors[index][field] = "Capacity is required";
      else if (!capacityRegex.test(value)) {
        updatedErrors[index][field] =
          "Capacity must be a positive integer";
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

    // ---- small helpers
    const toMinutes = (hhmm) => {
      const m = /^(\d{2}):(\d{2})$/.exec((hhmm || "").trim());
      if (!m) return null;
      const h = Number(m[1]), min = Number(m[2]);
      if (h > 23 || min > 59) return null;
      return h * 60 + min;
    };
    const toDate = (yyyyMMdd) => (yyyyMMdd ? new Date(yyyyMMdd) : null);


    const requiredFieldsCreate = [
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
      "image", // required only on create
      "eventCategories",
    ];

    // List of required fields for edit mode (image NOT required)
    const requiredFieldsEdit = requiredFieldsCreate.filter(
      (f) => f !== "image"
    );

    // Use the correct list depending on whether it's create or edit
    const requiredFields = id ? requiredFieldsEdit : requiredFieldsCreate;

    for (const field of requiredFields) {
      const value = formData[field];
      if (!value || (typeof value === "string" && !value.trim())) {
        // Converts camelCase to readable field names (e.g., "startDate" => "start Date")
        const readableField = field.replace(/([A-Z])/g, " $1");
        errors[field] = `${readableField.charAt(0).toUpperCase() + readableField.slice(1)
          } is required`;
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



    // Time validation: endTime must be after startTime
    if (formData.startTime && formData.endTime) {
      const start = new Date(`1970-01-01T${formData.startTime}`);
      const end = new Date(`1970-01-01T${formData.endTime}`);
      if (start >= end) {
        errors.endTime = "End Time must be after Start Time";
        isValid = false;
      }
    }

    // ✅ NEW: entryCloseTime must be >= startTime and <= endTime
    if (formData.entryCloseTime) {
      const closeMin = toMinutes(formData.entryCloseTime);
      const startMin = formData.startTime ? toMinutes(formData.startTime) : null;
      const endMin = formData.endTime ? toMinutes(formData.endTime) : null;

      if (closeMin == null) {
        errors.entryCloseTime = "Entry Close Time must be HH:mm";
        isValid = false;
      } else {
        if (startMin != null && closeMin < startMin) {
          errors.entryCloseTime = "Entry Close Time cannot be before Start Time";
          isValid = false;
        }
        if (endMin != null && closeMin > endMin) {
          errors.entryCloseTime = "Entry Close Time cannot be after End Time";
          isValid = false;
        }
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
    if (!formData.eventTicketType || formData.eventTicketType.length === 0) {
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

        // Capacity validation (must be numeric and non-negative)
        if (
          ticket.capacity &&
          (!/^\d+$/.test(ticket.capacity) || Number(ticket.capacity) <= 0)
        ) {
          tErrors.capacity = "Capacity must be a positive number";
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
      console.log(formData);
      console.log(formErrors);
      return;
    }
    console.log(formData);

    const data = new FormData();
    if (id) data.append("Id", id);
    // Basic Fields
    data.append("Title", formData.title);
    data.append("Description", formData.description);
    data.append("Venue", formData.venue);
    data.append("Location", formData.location);
    data.append("TermsAndConditions", formData.termsAndConditions);

    // Dates & Times
    data.append("StartTime", formData.startTime); // Format: HH:mm
    data.append("EndTime", formData.endTime);
    data.append("StartDate", formData.startDate); // Format: yyyy-MM-dd
    data.append("EndDate", formData.endDate);
    data.append("BookingStart", formData.bookingStart); // ISO
    data.append("BookingEnd", formData.bookingEnd);
    if (formData.entryCloseTime) {
      data.append("EntryCloseTime", formData.entryCloseTime);
    }

    // Geo & Capacity
    data.append("Latitude", formData.latitude);
    data.append("Longitude", formData.longitude);

    // ✅ Single Category
    data.append("EventCategoryId", formData.eventCategories.value);

    // Main Image
    if (formData.image instanceof File) {
      data.append("Image", formData.image);
    }

    if (id) {
      // UPDATE mode

      // Append new images as NewImages
      if (formData.eventImages?.length) {
        formData.eventImages.forEach((img) => {
          if (img.file) data.append("NewImages", img.file);
        });
      }

      // Append removed image IDs
      if (removedImageIds.length > 0) {
        removedImageIds.forEach((removedId) => {
          data.append("RemoveImageIds", removedId);
        });
      }
    } else {
      // CREATE mode

      // Append new images as EventImages
      if (formData.eventImages?.length) {
        formData.eventImages.forEach((img) => {
          if (img.file) data.append("EventImages", img.file);
        });
      }
    }
    // ✅ Ticket Types as JSON
    formData.eventTicketType.forEach((ticket, index) => {
      if (ticket.id) {
        data.append(`EventTicketType[${index}].Id`, ticket.id);
      }
      if (ticket.eventId) {
        data.append(`EventTicketType[${index}].EventId`, ticket.eventId);
      }
      data.append(`EventTicketType[${index}].Name`, ticket.name);
      data.append(`EventTicketType[${index}].Price`, ticket.price);
      data.append(`EventTicketType[${index}].Capacity`, ticket.capacity);
    });

    try {
      setLoading(true);
      const response = await axiosInstance({
        method: id ? "put" : "post",
        url: `${apiKey}api/event`,
        data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
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


  const getMinForDateTimeLocal = () => {
    // Convert "now" to local ISO without timezone, then cut to yyyy-MM-ddTHH:mm
    const now = new Date();
    const tzOffsetMs = now.getTimezoneOffset() * 60000; // minutes -> ms
    return new Date(now - tzOffsetMs).toISOString().slice(0, 16);
  };


  return (
    <>
      {!loading && !pageLoading && (
        <>
          <div className="">
            <div>
              <h2 className="text-sm inline-block border-b-2 border-gray-400">
                {isViewMode ? "View" : id ? "Edit" : "Create"} Event
              </h2>
            </div>
          </div>
          <div className="mt-5">
            <form action="">
              <div className="mt-5">
                <ImageUploadInput
                  setFile={handleInputChange("image")}
                  customKey="image"
                  existingImageUrl={
                    formData.imageUrl ? apiKey + formData.imageUrl : ""
                  }
                  error={formErrors.image}
                  isEditable={!isViewMode}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-5 mt-5">
                <TextBox
                  value={formData.title}
                  label="Title"
                  onchange={handleInputChange("title")}
                  onBlur={handleInputBlur("title")}
                  error={formErrors.title}
                  readonly={isViewMode}
                />
                <TextBox
                  value={formData.venue}
                  label="Venue"
                  onchange={handleInputChange("venue")}
                  onBlur={handleInputBlur("venue")}
                  error={formErrors.venue}
                  readonly={isViewMode}
                />
                <TextBox
                  value={formData.location}
                  label="Location"
                  onchange={handleInputChange("location")}
                  onBlur={handleInputBlur("location")}
                  error={formErrors.location}
                  readonly={isViewMode}
                />
                <TextBox
                  value={formData.startTime}
                  label="Start Time"
                  onchange={handleInputChange("startTime")}
                  onBlur={handleInputBlur("startTime")}
                  error={formErrors.startTime}
                  type="time"
                  readonly={isViewMode}
                />
                <TextBox
                  value={formData.endTime}
                  label="End Time"
                  onchange={handleInputChange("endTime")}
                  onBlur={handleInputBlur("endTime")}
                  error={formErrors.endTime}
                  min={new Date().toISOString().split("T")[0]}  // <-- prevents past dates
                  type="time"
                  readonly={isViewMode}
                />
                <TextBox
                  value={formData.startDate}
                  label="Start Date"
                  onchange={handleInputChange("startDate")}
                  onBlur={handleInputBlur("startDate")}
                  error={formErrors.startDate}
                  min={new Date().toISOString().split("T")[0]}  // <-- prevents past dates
                  type="date"
                  readonly={isViewMode}
                />
                <TextBox
                  value={formData.endDate}
                  label="End Date"
                  onchange={handleInputChange("endDate")}
                  onBlur={handleInputBlur("endDate")}
                  error={formErrors.endDate}
                  min={new Date().toISOString().split("T")[0]}  // <-- prevents past dates
                  type="date"
                  readonly={isViewMode}
                />
                <TextBox
                  value={formData.bookingStart}
                  label="Booking Start"
                  onchange={handleInputChange("bookingStart")}
                  onBlur={handleInputBlur("bookingStart")}
                  error={formErrors.bookingStart}
                  min={getMinForDateTimeLocal()}   // prevents past datetimes
                  type="datetime-local"
                  readonly={isViewMode}
                />
                <TextBox
                  value={formData.bookingEnd}
                  label="Booking End"
                  onchange={handleInputChange("bookingEnd")}
                  onBlur={handleInputBlur("bookingEnd")}
                  error={formErrors.bookingEnd}
                   min={getMinForDateTimeLocal()}   // prevents past datetimes
                  type="datetime-local"
                  readonly={isViewMode}
                />
                <TextBox
                  value={formData.entryCloseTime}
                  label="Entry Close Time"
                  onchange={handleInputChange("entryCloseTime")}
                  onBlur={handleInputBlur("entryCloseTime")}
                  error={formErrors.entryCloseTime}
                  type="time"
                  readonly={isViewMode}
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
                      readOnly={isViewMode}
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
                      readOnly={isViewMode}
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
                      isEditable={!isViewMode}
                    />
                  </div>
                  <TextBox
                    value={formData.latitude}
                    label="Latitude"
                    onchange={handleInputChange("latitude")}
                    onBlur={handleInputBlur("latitude")}
                    error={formErrors.latitude}
                    readonly={isViewMode}
                  />
                  <TextBox
                    value={formData.longitude}
                    label="Longitude"
                    onchange={handleInputChange("longitude")}
                    onBlur={handleInputBlur("longitude")}
                    error={formErrors.longitude}
                    readonly={isViewMode}
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
                <div className="relative">
                  <Select
                    value={formData.eventCategories}
                    // classNames="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                    // isMultiple={true}
                    isSearchable={true}
                    isClearable={true}
                    isDisabled={isViewMode}
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
                  {!isViewMode && (
                    <button
                      type="button"
                      onClick={addTicket}
                      className="bg-blue-600 text-sm text-white py-1.5 px-4 rounded-xl border border-blue-600 hover:bg-blue-700 duration-500 transition-all "
                    >
                      Add Ticket Types
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-5">
                  {formData.eventTicketType &&
                    formData.eventTicketType.map((option, index) => (
                      <div
                        key={index}
                        className="border border-gray-300 rounded-lg p-5 pt-3"
                      >
                        {!isViewMode && (
                          <div className="flex justify-end">
                            <CiTrash
                              onClick={() => {
                                removeTicket(index);
                              }}
                              className="text-xl text-red-600 cursor-pointer"
                            />
                          </div>
                        )}
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
                            readonly={isViewMode}
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
                            readonly={isViewMode}
                          />

                          <TextBox
                            id={`tickettype_capacity_${index}`}
                            value={option.capacity}
                            label="Capacity"
                            onchange={handleTicketInputChange(index, "capacity")}
                            onBlur={handleTicketInputBlur(index, "capacity")}
                            error={
                              formErrors.eventTicketType[index]?.capacity || ""
                            }
                            readonly={isViewMode}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              {/*End of Event Ticket Types */}

              {/* Event Images */}
              <div>
                {(formData.eventImages.length > 0 || !isViewMode) && (
                  <div className="flex justify-between items-center my-5">
                    <h2 className="text-sm inline-block border-b-2 border-gray-400">
                      Event Images
                    </h2>
                    {!isViewMode && (
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
                              eventImages: [
                                ...prev.eventImages,
                                ...imagesWithPreview,
                              ],
                            }));
                          }}
                        />
                      </label>
                    )}
                  </div>
                )}

                {/* Preview Section */}
                {formData.eventImages.length > 0 && (
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
                          {!isViewMode && (
                            <button
                              type="button"
                              onClick={() => {
                                setFormData((prev) => {
                                  const updated = [...prev.eventImages];
                                  const removedImg = updated.splice(idx, 1)[0];
                                  if (removedImg.id) {
                                    setRemovedImageIds((prevRemoved) => [
                                      ...prevRemoved,
                                      removedImg.id,
                                    ]);
                                  }

                                  if (removedImg.preview) {
                                    URL.revokeObjectURL(removedImg.preview);
                                  }
                                  return { ...prev, eventImages: updated };
                                });
                              }}
                              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-90 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Event Remarks*/}
              {isViewMode && formData.remarks && (
                <div>
                  <div className="flex justify-between items-center my-5">
                    <div>
                      <h2 className="text-sm inline-block border-b-2 border-gray-400">
                        Remarks
                      </h2>
                    </div>
                  </div>
                  <div>
                    <p>{formData.remarks}</p>
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
            {!isViewMode && (
              <div>
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white py-1.5 px-9 rounded-xl border border-blue-600 hover:bg-blue-700 duration-500 transition-all"
                >
                  Save
                </button>
              </div>
            )}
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

      {/* <LocationPickerMap open={locationPickerModalOpen} onClose={() => { setLocationPickerModalOpen(false) }} setFormData={setFormData} /> */}
    </>
  );
};

export default EventForm;