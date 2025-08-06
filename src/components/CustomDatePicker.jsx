import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CustomDatePicker = ({ label, value, onChange, ...rest }) => {
  // Safely extract and parse the startDate
  let selectedDate = null;

  try {
    if (value?.startDate) {
      selectedDate = new Date(value.startDate);
      if (isNaN(selectedDate.getTime())) selectedDate = null;
    }
  } catch {
    selectedDate = null;
  }

  // Wrap the onChange to return the same structure expected by parent
  const handleDateChange = (date) => {
    if (!date || isNaN(date.getTime())) {
      onChange(null);
    } else {
      onChange({ startDate: date, endDate: date });
    }
  };

  return (
    <div className="relative ">
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        className="border-2 rounded-lg border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary-light !w-full px-3 py-2 z-10 dark:bg-black dark:text-white"
        placeholderText="Select date"
        dateFormat="yyyy-MM-dd"
        
        popperClassName="z-10"
        {...rest}
      />
      <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-[1] origin-[0] bg-white px-2 start-1 dark:bg-black dark:text-white">
        {label}
      </label>
    </div>
  );
};

export default CustomDatePicker;
