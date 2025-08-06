import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";

const CustomNepaliDatePicker = ({ label, value, ...rest }) => {
  return (
    <div className="relative w-full">
      <NepaliDatePicker
        value={value}
        inputClassName="border-2 rounded-lg  border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer p-2 dark:bg-black dark:text-white"
        {...rest}
      />
      <label
        className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-[1] origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-primary-light peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 dark:bg-black dark:text-white"
      >
        {label}
      </label>
    </div>
  );
};

export default CustomNepaliDatePicker;
