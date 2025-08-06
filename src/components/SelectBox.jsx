import React from 'react'
import Select from "react-tailwindcss-select";
const SelectBox = ({label,...rest}) => {
    return (
        <div className="relative">
            <Select
                classNames="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                formatGroupLabel={data => (
                    <div className={`py-2 text-xs flex items-center justify-between`}>
                      <span className="font-bold">{data.label}</span>
                      <span className="bg-gray-200 h-5 p-1.5 flex items-center justify-center rounded-full">
                        {data.options.length}
                      </span>
                    </div>
                  )}
                {...rest}
            />
            <label
                // htmlFor="address"
                className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-[1] origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
                {label}
            </label>
        </div>
    )
}

export default SelectBox