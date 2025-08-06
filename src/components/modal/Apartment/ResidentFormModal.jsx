import React, { useEffect, useRef, useState } from "react";
import ModalLayout from "../ModalLayout";
import TextBox from "../../TextBox";
import toast from "react-hot-toast";
import axiosInstance from "../../../services/axios";
import { AiTwotoneEdit } from "react-icons/ai";

const ResidentFormModal = ({
  open,
  onClose,
  fetchResidents = () => {},
  selectedResident = null,
  setLoading,
  loading,
}) => {
  const apiKey = import.meta.env["VITE_APP_BASE_URL"];
  const nameRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    apartmentNo: "",
    floorNumber: "",
    moveInDate: "",
  });

  const [errors, setErrors] = useState({});
  const [photo, setPhoto] = useState(null);
  const photoInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      if (selectedResident) {
        setForm({
          name: selectedResident.name || "",
          email: selectedResident.email || "",
          phone: selectedResident.phone || "",
          apartmentNo: selectedResident.apartmentNo || "",
          floorNumber: selectedResident.floorNumber || "",
          moveInDate: selectedResident.moveInDate?.substring(0, 10) || "",
        });
        // Load image if available
      } else {
        setForm({
          name: "",
          email: "",
          phone: "",
          apartmentNo: "",
          floorNumber: "",
          moveInDate: "",
        });
        setPhoto(null);
      }

      setTimeout(() => nameRef.current?.focus(), 50);
    } else {
      setErrors({});
    }
  }, [open, selectedResident]);

  const validateField = (field, value) => {
    let message = "";

    if (!value?.trim()) {
      message = `${field} is required`;
    } else if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      message = "Invalid email format";
    } else if (field === "phone" && !/^\d{10}$/.test(value)) {
      message = "Phone must be 10 digits";
    }

    setErrors((prev) => ({ ...prev, [field]: message }));
    return !message;
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = Object.keys(form).every((field) =>
      validateField(field, form[field])
    );
    if (!isValid) return;

    setLoading(true);
    const payload = { ...form };

    if (selectedResident?.id) payload.id = selectedResident.id;

    try {
      const method = selectedResident ? "put" : "post";
      const response = await axiosInstance({
        method,
        url: `${apiKey}api/resident`,
        data: payload,
      });

      toast.success(response.data.message);
      onClose();
      fetchResidents();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUploadClick = () => {
    photoInputRef.current?.click();
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
    }
  };

  return (
    !loading && (
      <ModalLayout
        open={open}
        onClose={onClose}
        submit={handleSubmit}
        className="sm:!max-w-[50%]"
      >
        <div className="p-6">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">
            {selectedResident ? "Edit Resident" : "Add Resident"}
          </h2>

          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {photo ? (
                <img
                  src={photo}
                  alt="Resident"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500">Upload</span>
              )}
              <button
                type="button"
                className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow"
                onClick={handlePhotoUploadClick}
              >
                <AiTwotoneEdit />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={photoInputRef}
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextBox
              ref={nameRef}
              label="Name"
              value={form.name}
              onchange={handleChange("name")}
              error={errors.name}
            />
            <TextBox
              label="Email"
              value={form.email}
              onchange={handleChange("email")}
              error={errors.email}
            />
            <TextBox
              label="Phone"
              value={form.phone}
              onchange={handleChange("phone")}
              error={errors.phone}
            />
            <TextBox
              label="Apartment No"
              value={form.apartmentNo}
              onchange={handleChange("apartmentNo")}
              error={errors.apartmentNo}
            />
            <TextBox
              label="Floor Number"
              value={form.floorNumber}
              onchange={handleChange("floorNumber")}
              error={errors.floorNumber}
            />
            <TextBox
              label="Move-In Date"
              type="date"
              value={form.moveInDate}
              onchange={handleChange("moveInDate")}
              error={errors.moveInDate}
            />
          </div>
        </div>
      </ModalLayout>
    )
  );
};

export default ResidentFormModal;
