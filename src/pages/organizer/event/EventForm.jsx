import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FaXmark } from "react-icons/fa6";
import Select from "react-tailwindcss-select";
import { CiTrash } from "react-icons/ci";
import { getToken, logout } from '../../../utils/jwtUtils';
import toast from 'react-hot-toast';
import axiosInstance from '../../../services/axios';
import { useAuth } from '../../../context/AuthContext';
const EventForm = () => {
    const { id } = useParams();
    const { setActivePage, setActiveSubMenu, loading, setLoading } = useAuth();
    const [pageLoading, setPageLoading] = useState(true); // 🔹 Local loading
    setActivePage("menu");
    setActiveSubMenu("");
    const apiKey = import.meta.env["VITE_APP_BASE_URL"];
    const token = getToken();
    const navigate = useNavigate();
    const [category, setCategory] = useState(null);
    const [image, setImage] = useState(null);
    const [options, setOptions] = useState([]);
    const [file, setFile] = useState(null)
    const [itemName, setItemName] = useState("");
    const [itemPrice, setItemPrice] = useState("");
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            setLoading(true);
            await fetchCategories();
            if (id) {
                await fetchMenu();
            }
            setTimeout(() => {
                setLoading(false);
                setPageLoading(false);
            }, 500);
        }
        fetchData();
    }, []);


    // Function to handle adding options
    const handleAddOption = (e) => {
        e.preventDefault();
        setOptions((prevOptions) => [...prevOptions, { optionName: "", optionPrice: "" }]);
    };
    const [isDragging, setIsDragging] = useState(false);
    // Handle drag events
    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (event) => {
        event.preventDefault(); // Prevent default behavior
        const files = event.dataTransfer.files; // Access the files
        setIsDragging(false);
        if (files.length > 0) {
            const file = files[0]; // Get the first file

            // Validate that the file is an image
            const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            if (validImageTypes.includes(file.type)) {
                setFile(file);
                const reader = new FileReader();

                // Read the selected file and set it to state
                reader.onloadend = () => {
                    setImage(reader.result); // Set the image data URL
                };

                reader.readAsDataURL(file);
            } else {
                toast.error('Invalid file type. Please upload a PNG or JPEG image.');
            }
        }
    };

    // Handle file selection
    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            // Validate file type
            const validImageTypes = ["image/png", "image/jpeg", "image/jpg"];
            if (validImageTypes.includes(selectedFile.type)) {
                setFile(selectedFile); // Set the file for API submission

                const reader = new FileReader();
                reader.onloadend = () => {
                    setImage(reader.result); // Set the preview URL
                };
                reader.readAsDataURL(selectedFile);
            } else {
                toast.error("Invalid file type. Please upload a PNG or JPEG image.");
            }
        }
    };
    const handleCategoryChange = value => {
        setCategory(value);
    }

    const handleDeleteOption = (index) => {
        setOptions((prevOptions) => prevOptions.filter((_, i) => i !== index));
    };

    const handleOptionChange = (index, field, value) => {
        setOptions((prevOptions) =>
            prevOptions.map((option, i) =>
                i === index ? { ...option, [field]: value } : option
            )
        );
    };


    const isValidDecimal = (value) => {
        const decimalRegex = /^\d*\.?\d*$/; // Allow only numbers and one decimal point
        return decimalRegex.test(value);
    };

    // Main onChange handler for optionPrice
    const handleOptionPriceChange = (index, value) => {
        if (isValidDecimal(value)) {
            handleOptionChange(index, "optionPrice", value);
        }
    };


    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get(`${apiKey}api/category`);
            if (response.status == 200) {
                var filteredCategories = response.data.data.map(item => ({
                    value: item.id,
                    label: item.name
                }));
                setCategories(filteredCategories);
            }
        } catch (error) {
            if (error.response) {
                var errorMessage = error.response.data.message;
                toast.error(errorMessage);
            } else if (error.message) {
                console.log("Error", error.message);
                toast.error("Error", error.message);
            } else {
                toast.error(error);
                console.log("Error", error);
            }
        }
    }


    const fetchMenu = async () => {
        try {
            const response = await axiosInstance.get(`${apiKey}api/menu/${id}`);
            if (response.status == 200) {
                const menu = response.data.data;
                setItemName(menu.itemName);
                setItemPrice(menu.itemPrice);
                if (menu.imageUrl) {
                    setImage(`${menu.imageUrl}`);
                }
                setOptions(menu.menuOptions);
                console.log(menu)
                const existingCategory = {
                    value: menu.categoryId,
                    label: menu.categoryName
                }
                setCategory(existingCategory);
            }
        } catch (error) {
            if (error.response) {
                var errorMessage = error.response.data.message;
                toast.error(errorMessage);
            } else if (error.message) {
                console.log("Error", error.message);
                toast.error("Error", error.message);
            } else {
                toast.error(error);
                console.log("Error", error);
            }
        }
    }

    const validateForm = () => {
        if (
            itemName.trim() === "" ||
            !itemPrice ||
            !category
        ) {
            toast.error("Please fill all fields");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }
         if (Array.isArray(options) && options.length > 0) {
            const hasInvalid = options.some(
                (opt) => !opt.optionName?.trim() || !opt.optionPrice?.toString().trim()
            );
            if (hasInvalid) {
                toast.error("All options must have a title and price filled.");
                return;
            }
        }
        const formData = new FormData();
        if (id) {
            formData.append("id", id);
        }
        formData.append("ItemName", itemName);
        formData.append("ItemPrice", itemPrice);
        formData.append("CategoryId", category.value);
        formData.append("Image", file);

        options.forEach((option, index) => {
            formData.append(`MenuOptions[${index}][optionName]`, option.optionName);
            formData.append(`MenuOptions[${index}][optionPrice]`, option.optionPrice);
            if (option.id) {
                formData.append(`MenuOptions[${index}][id]`, option.id);
            }
        });
        const method = id ? "put" : "post";
        const url = `${apiKey}api/menu`;
        setLoading(true);
        try {
            const response = await axiosInstance({
                method,
                url,
                data: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                toast.success(response.data.message);
                setLoading(false);
                navigate("/product-management");
            }
        } catch (error) {
            if (error.response) {
                var errorMessage = error.response.data.message;
                toast.error(errorMessage);
            } else if (error.message) {
                console.log("Error", error.message);
                toast.error("Error", error.message);
            } else {
                toast.error(error);
                console.log("Error", error);
            }
        }
        finally{
            setLoading(false);
        }
    };



    return (
        <>
            {!loading && !pageLoading && (
                <>
                    <div className="">
                        <div>
                            <h2 className="text-sm inline-block border-b-2 border-gray-400">
                                {id ? "Edit" : "Add"} Menu Item
                            </h2>
                        </div>
                    </div>
                    <div className="mt-5">
                        <form action="">
                            <div className="mt-5">
                                {image ? <>
                                    <div className="flex items-center justify-center mt-">
                                        <div className="relative h-64">
                                            <img src={image} className="h-full object-contain rounded-lg" alt="" />
                                            <div className="absolute -top-4 -right-4">
                                                <FaXmark onClick={() => { setImage(null) }} className="text-red-400 text-xl hover:text-red-600 cursor-pointer" title="Delete Image" />
                                            </div>
                                        </div>
                                    </div>
                                </> : <>
                                    <div className="flex items-center justify-center w-full">
                                        <label htmlFor='dropzone-file'
                                            className={`flex flex-col items-center justify-center w-full h-64 border-2 ${isDragging ? "border-blue-500 bg-blue-100" : "border-gray-300 bg-gray-50"
                                                } border-dashed rounded-lg cursor-pointer  dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600`}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                        >
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg
                                                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 20 16"
                                                >
                                                    <path
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                                    />
                                                </svg>
                                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="font-semibold">Click to upload</span> or drag and
                                                    drop
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    PNG, JPG, JPEG (MAX. 800x400px)
                                                </p>
                                            </div>
                                            <input
                                                id="dropzone-file"
                                                type="file"
                                                onChange={handleImageChange}
                                                className="hidden"
                                                accept=".png, .jpg, .jpeg"
                                            />
                                        </label>
                                    </div>
                                </>}

                            </div>
                            <div className="grid md:grid-cols-2 gap-5 mt-5">
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="guest_name"
                                        className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                                        placeholder=" "
                                        value={itemName}
                                        onChange={(e) => { setItemName(e.target.value) }}
                                    />
                                    <label
                                        htmlFor="guest_name"
                                        className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-[1] origin-[0] bg-white dark:bg-black dark:text-white dark:peer-focus:text-blue-100 dark:peer-focus:outline-blue-200  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                    >
                                        Item Name
                                    </label>
                                </div>
                                <div className="relative">
                                    <Select
                                        value={category}
                                        classNames="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                                        isSearchable={true}
                                        onChange={handleCategoryChange}
                                        options={categories}
                                    />
                                    <label
                                        htmlFor="address"
                                        className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-[1] origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                    >
                                        Category
                                    </label>
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="guest_name"
                                        // disabled={options.length > 0}
                                        // readOnly={options.length > 0}
                                        className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                                        placeholder=" "
                                        value={itemPrice}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d*\.?\d*$/.test(value)) { // Allow only decimal values
                                                setItemPrice(value);
                                            }
                                        }}
                                    />
                                    <label
                                        htmlFor="guest_name"
                                        className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-[1] origin-[0] bg-white dark:bg-black dark:text-white dark:peer-focus:text-blue-100 dark:peer-focus:outline-blue-200  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                    >
                                        Price
                                    </label>
                                </div>
                            </div>
                            <div>
                                <div className='flex justify-end my-5'>
                                    <button type='button' onClick={handleAddOption} className="bg-blue-600 text-sm text-white py-1.5 px-4 rounded-xl border border-blue-600 hover:bg-blue-700 duration-500 transition-all ">
                                        Add Options
                                    </button>
                                </div>
                                <div className='grid grid-cols-2 gap-5'>
                                    {options &&
                                        options.map((option, index) => (
                                            <div key={index} className="border border-gray-300 rounded-lg p-5 pt-3">
                                                <div className="flex justify-end">
                                                    <CiTrash onClick={() => { handleDeleteOption(index) }} className="text-xl text-red-600 cursor-pointer" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-5 mt-2">
                                                    {/* Title Input */}
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            id={`guest_name_title_${index}`}
                                                            className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary-light peer"
                                                            placeholder=" "
                                                            value={option.optionName}
                                                            onChange={(e) => handleOptionChange(index, "optionName", e.target.value)}
                                                        />
                                                        <label
                                                            htmlFor={`guest_name_title_${index}`}
                                                            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-[1] origin-[0] bg-white dark:bg-black dark:text-white dark:peer-focus:text-blue-100 dark:peer-focus:outline-blue-200 px-2 peer-focus:px-2 peer-focus:text-primary-light peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                                        >
                                                            Title
                                                        </label>
                                                    </div>

                                                    {/* Price Input */}
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            id={`guest_name_price_${index}`}
                                                            className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary-light peer"
                                                            placeholder=" "
                                                            value={option.optionPrice}
                                                            onChange={(e) => handleOptionPriceChange(index, e.target.value)}
                                                        />
                                                        <label
                                                            htmlFor={`guest_name_price_${index}`}
                                                            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-[1] origin-[0] bg-white dark:bg-black dark:text-white dark:peer-focus:text-blue-100 dark:peer-focus:outline-blue-200 px-2 peer-focus:px-2 peer-focus:text-primary-light peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                                        >
                                                            Price
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
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
                            <button onClick={handleSubmit} className="bg-blue-600 text-white py-1.5 px-9 rounded-xl border border-blue-600 hover:bg-blue-700 duration-500 transition-all">
                                Save
                            </button>
                        </div>
                    </div>
                </>)}
        </>
    )
}

export default EventForm