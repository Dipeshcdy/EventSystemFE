import React, { useState } from 'react'
import { FaXmark } from "react-icons/fa6";
import ModalLayout from './ModalLayout';
import toast from 'react-hot-toast';
import axiosInstance from '../../services/axios';

const CreateCategoryModal = ({ open, setOpen, setLoading, fetchCategories, categoryId,name,setName,image,setImage }) => {
    const apiKey = import.meta.env["VITE_APP_BASE_URL"];
    const [file, setFile] = useState(null)
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

    const validateForm = () => {
        if (
            name.trim() === ""
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

        const formData = new FormData();
        if (categoryId) {
            formData.append("id", categoryId);
        }
        formData.append("Name", name);
        formData.append("Image", file);
        setOpen(false);
        setLoading(true);
        const method = categoryId ? "put" : "post";
        const url = `${apiKey}api/category`;
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
                fetchCategories();
                setLoading(false);
                setName("");
                setFile(null);
                setImage(null);
            }
        } catch (error) {
            setLoading(false);
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
    };

    return (
        <>
            <ModalLayout open={open} setOpen={setOpen} submit={handleSubmit}>
                <div className='p-5'>
                    <div className="">
                        <h2 className="text-sm inline-block border-b-2 border-gray-400">
                            {categoryId?"Edit":"Add"} Category
                        </h2>
                    </div>
                    <div className="grid gap-5 mt-5">
                        <div className="relative">
                            <input
                                type="text"
                                id="guest_name"
                                className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary-light peer dark:text-white"
                                placeholder=" "
                                value={name}
                                onChange={(e) => { setName(e.target.value) }}
                            />
                            <label
                                htmlFor="guest_name"
                                className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-[1] origin-[0] bg-white dark:bg-black dark:text-white dark:peer-focus:text-blue-100 dark:peer-focus:outline-blue-200  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                            >
                                Category Name
                            </label>
                        </div>
                    </div>
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
                </div>
            </ModalLayout>
        </>
    )
}

export default CreateCategoryModal