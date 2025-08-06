import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { FaXmark } from "react-icons/fa6";
const ImageUploadInput = ({ setFile, customKey, existingImageUrl, isEditable = true, error = "" }) => {
    const max_file_size = import.meta.env["VITE_MAX_FILE_SIZE"];
    const [image, setImage] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    useEffect(() => {
        if (existingImageUrl) {
            setImage(existingImageUrl);
        }
    }, [])

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
            const validFileTypes = ["image/png", "image/jpeg", "image/jpg"];

            if (validFileTypes.includes(file.type)) {
                setFile(file);

                // For image preview
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImage(reader.result); // Set the preview URL
                };
                reader.readAsDataURL(file);

            } else {
                toast.error("Invalid file type. Please upload a PNG, JPEG.");
            }
        }
    };

    // Handle file selection
    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            // Validate file type
            const validFileTypes = ["image/png", "image/jpeg", "image/jpg"];
            if (validFileTypes.includes(selectedFile.type)) {
                setFile(selectedFile); // Set the file for API submission

                // For image preview
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImage(reader.result); // Set the preview URL
                };
                reader.readAsDataURL(selectedFile);
            } else {
                toast.error("Invalid file type. Please upload a PNG, JPEG.");
            }
        }
    };
    return (
        <>
            <div className="">
                {image ? (
                    <div className="flex items-center justify-center mt-">
                        <div className="relative h-56">
                            <img src={image} className="h-full object-contain rounded-lg" alt="" />
                            {isEditable && (
                                <div className="absolute -top-4 -right-4">
                                    <FaXmark onClick={() => { setImage(null); }} className="text-red-400 text-xl hover:text-red-600 cursor-pointer" title="Delete Image" />
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor={`dropzone-file${customKey}`}
                            className={`flex flex-col items-center justify-center w-full h-56 border-2 ${isDragging ? "border-blue-500 bg-blue-100" : "border-gray-300 bg-gray-50"
                                } ${error ? "border-red-500" : ""} border-dashed rounded-lg cursor-pointer  dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600`}
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
                                    PNG, JPG, JPEG
                                </p>
                            </div>
                            <input
                                id={`dropzone-file${customKey}`}
                                type="file"
                                onChange={handleImageChange}
                                className="hidden"
                                accept=".png, .jpg, .jpeg, .pdf"
                            />
                        </label>
                    </div>
                )}
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>


        </>
    )
}

export default ImageUploadInput