import React, { useState } from "react";
import axios from "axios";
import TextBox from "../TextBox";
import toast from "react-hot-toast";

export default function FreeGeocoder({ formData, setFormData, isEditable = true }) {
  const [input, setInput] = useState("");
  const handleSearch = async () => {
    const res = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        input
      )}`
    );
    const data = res.data[0];
    if (data) {
      setFormData((prev) => ({
        ...prev,
        latitude: data.lat,
        longitude: data.lon,
        address: data.display_name,
      }));
    } else {
      toast.error("Location not found");
    }
  };

  const handleViewOnMap = () => {
    if (formData.latitude && formData.longitude) {
      window.open(
        `https://www.google.com/maps?q=${formData.latitude},${formData.longitude}`,
        "_blank"
      );
    }
  };

  return (
    <div className="w-full grid grid-cols-2 gap-5">
      {isEditable && (

        <TextBox
          value={input}
          onChange={(e) => setInput(e.target.value)}
          label="Enter location"
        />
      )}

      <div className="space-x-5">
        {isEditable && (

          <button
            type="button"
            onClick={handleSearch}
            className="bg-blue-600 text-white py-1.5 px-9 rounded-xl border border-blue-600 hover:bg-blue-700 duration-500 transition-all"
          >
            Search
          </button>
        )}
        {formData.latitude && formData.longitude && (
          <button
            type="button"
            onClick={handleViewOnMap}
            className="bg-blue-600 text-white py-1.5 px-9 rounded-xl border border-blue-600 hover:bg-blue-700 duration-500 transition-all"
          >
            View on Map
          </button>
        )}
      </div>
    </div>
  );
}
