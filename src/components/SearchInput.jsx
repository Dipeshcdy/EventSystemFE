import React, { useEffect, useRef, useState } from 'react'
import { HiOutlineXMark } from "react-icons/hi2";
const SearchInput = ({ value, label, onchange, id, type = "text", formatGroupLabel, showClearIcon = false, handleClear, options = [], forTable = false, ...rest }) => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                inputRef.current &&
                !inputRef.current.contains(event.target)
            ) {
                setDropdownVisible(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative">
            {forTable && (
                <input
                    type="text"
                    value={value}
                    onChange={onchange}
                    className="w-full  p-1 outline-none"
                    onFocus={() => setDropdownVisible(true)}
                    onBlur={() => setTimeout(() => setDropdownVisible(false), 200)}
                    {...rest}
                />
            )}
            {!forTable && (
                <>
                    <input
                        type={type}
                        id={id ?? label}
                        className="block px-2.5 pb-2 pt-3 pr-7 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                        placeholder=" "
                        value={value}
                        onChange={onchange}
                        onFocus={() => setDropdownVisible(true)}
                        onBlur={() => setTimeout(() => setDropdownVisible(false), 200)}
                    />
                    <label
                        htmlFor={id ?? label}
                        className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-[1] origin-[0] bg-white dark:bg-black dark:text-white dark:peer-focus:text-blue-100 dark:peer-focus:outline-blue-200  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                    >
                        {label}
                    </label>
                </>
            )}
            {showClearIcon && (
                <div className='absolute right-0 px-2  inset-y-0 flex items-center'>
                    <HiOutlineXMark onClick={handleClear} className='cursor-pointer' />
                </div>
            )}
            {isDropdownVisible && (
                <div
                    ref={dropdownRef}
                    onMouseEnter={() => setDropdownVisible(true)} // Keep open when hovering
                    className={`absolute  duration-300 ease-out  left-0 w-full top-[110%] bg-white shadow-xl border  z-50 rounded-lg  `}>
                    <div className='px-2 py-2 max-h-56 overflow-auto '>
                        {options.length > 0 && options.map(formatGroupLabel)}
                        {options.length <= 0 && (
                            <>
                                <h2 className='text-gray-600 py-2 px-2 cursor-default text-sm'>No Options</h2>
                            </>
                        )}
                    </div>

                    <h2 onClick={() => { alert("test") }} className="bg-blue-600 text-white py-1 text-center text-sm border border-blue-600 hover:bg-blue-700 duration-500 transition-all">Add Customer</h2>
                </div>
            )}
        </div>

    )
}

export default SearchInput