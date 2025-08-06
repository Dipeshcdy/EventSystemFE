import React, { useEffect, useState } from 'react'
import FileUploadInput from '../components/FileUploadInput'
import ImageUploadInput from '../components/ImageUploadInput';
import Select from "react-tailwindcss-select";
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import setup from "../images/setup.jpg"
import axiosInstance from '../services/axios';
import Loader from '../common/Loader';
import TextBox from '../components/TextBox';

const initialState = {
    email: '',
    firstName: '',
    lastName: '',
    phoneNo: '',
    address: '',
    gender: '',
    password: '',
    confimPassword: '',
    organizationName: '',
    organizationAddress: '',
    idType: '',
    idNumber: '',
    idDocumentImage: null,
    businessRegistrationImage: null,
    profile: null,
};

const OrganizerRegister = () => {
    const apiKey = import.meta.env["VITE_APP_BASE_URL"];
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState(initialState);
    const [formErrors, setFormErrors] = useState({});
    const genders = [{ value: 1, label: "Male" }, { value: 2, label: "Female" }];
    const idTypes = [{ value: 1, label: "Citizenship" }, { value: 2, label: "Passport" }, { value: 3, label: "NIN" }];
    const handleChange = (e) => {
        const { name, value, files, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'file' ? files[0] : value,
        });
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, []);


    const validateInputField = (fieldName, value) => {
        let message = "";
        const trimmed = value?.toString().trim();

        switch (fieldName) {
            case "email":
                if (!trimmed) message = "Email is required";
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) message = "Invalid email";
                break;

            case "phoneNo":
                if (!trimmed) message = "Phone number is required";
                else if (!/^\d{10}$/.test(trimmed)) message = "Phone number must be 10 digits";
                break;

            case "password":
                if (!trimmed) message = "Password is required";
                else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/.test(trimmed)) {
                    message = "Password must include upper/lower case, number, special character and be at least 6 characters";
                }
                break;

            case "confimPassword":
                if (!trimmed) message = "Confirm password is required";
                else if (trimmed !== formData.password) message = "Passwords do not match";
                break;

            case "idNumber":
                if (!trimmed) message = "ID number is required";
                else if (!/^\d+$/.test(trimmed)) message = "ID number must be numeric";
                break;
            
            default:
                if (!trimmed) message = `${fieldName.replace(/([A-Z])/g, " $1")} is required`;
                break;
        }

        setFormErrors((prev) => ({ ...prev, [fieldName]: message }));
    };


    const handleInputChange = (field) => (valueOrEvent) => {
        let value = valueOrEvent;

        // Handle file input
        if (valueOrEvent?.target) {
            const target = valueOrEvent.target;

            if (field.includes("Image") && target?.files?.[0]) {
                value = target.files[0];
            } else {
                value = target.value;
            }
        }

        setFormData((prev) => ({ ...prev, [field]: value }));

        if ([
            "email", "firstName", "lastName", "phoneNo", "address", "gender",
            "password", "confimPassword", "organizationName", "organizationAddress",
            "idType", "idNumber", "idDocumentImage", "businessRegistrationImage", "profile"
        ].includes(field)) {
            validateInputField(field, value);
        }
    };


    const handleInputBlur = (field) => (e) => {
        validateInputField(field, e.target.value);
    };


    const validateForm = () => {
        const errors = {};
        let isValid = true;

        const requiredFields = [
            "email", "firstName", "lastName", "phoneNo", "address", "gender",
            "password", "confimPassword", "organizationName", "organizationAddress",
            "idType", "idNumber", "idDocumentImage", "businessRegistrationImage","profile"
        ];

        for (const field of requiredFields) {
            const value = formData[field];

            if (!value || (typeof value === "string" && !value.trim())) {
                errors[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
                isValid = false;
            }
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = "Invalid email";
            isValid = false;
        }

        if (formData.phoneNo && !/^\d{10}$/.test(formData.phoneNo)) {
            errors.phoneNo = "Phone number must be 10 digits";
            isValid = false;
        }

        if (formData.idNumber && !/^\d+$/.test(formData.idNumber)) {
            errors.idNumber = "ID number must be numeric";
            isValid = false;
        }

        if (
            formData.password &&
            !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}/.test(formData.password)
        ) {
            errors.password =
                "Password must include upper/lower case, number, special character and be at least 6 characters";
            isValid = false;
        }

        if (formData.password !== formData.confimPassword) {
            errors.confimPassword = "Passwords do not match";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const formData = new FormData();
        formData.append("Address", address);
        formData.append("RegistrationNumber", registrationNumber);
        formData.append("TaxNumber", taxtNumber);
        formData.append("ContactNumber", contactNumber);
        formData.append("WebsiteUrl", websiteUrl);
        formData.append("Description", description);
        formData.append("OrganizationTypeId", organizationType.value);
        formData.append("Logo", logo);
        formData.append("TaxDocument", taxdoc);
        formData.append("UserName", userName);
        formData.append("UserAddress", userAddress);
        formData.append("UserContact", userContact);
        formData.append("Gender", gender.value);
        formData.append("Profile", profilePicture);
        setLoading(true);
        try {
            const response = await axiosInstance.post(`${apiKey}api/organization/organization-setup`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })

            if (response.status === 200) {
                toast.success(response.data.message + " Please do login again");
                setLoading(false);
                logout();
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
    };
    return (
        <>
            {loading ? (
                <>
                    <Loader />
                </>
            ) : (
                <div>
                    <div style={{
                        backgroundImage: `url(${setup})`,
                    }}
                        className="bg-cover bg-center  h-32  2xl:h-72  relative shadow-xl">
                        <div className="absolute inset-0 bg-gray-800 bg-opacity-60 text-white flex items-center">
                            <div className="mx-4 md:mx-6 lg:mx-8 xl:mx-14 2xl:w-11/12 2xl:mx-auto wow animated fadeInLeft">
                                <h1 className="md:text-3xl text-2xl">Organizer Register</h1>
                            </div>
                        </div>
                    </div>

                    <div className='p-10'>
                        <div>
                            <div>
                                <h2 className="text-sm inline-block border-b-2 border-gray-400">
                                    Organization Details
                                </h2>
                            </div>
                            <div className='grid grid-cols-3 gap-x-10 gap-y-5 mt-3'>
                                <TextBox
                                    value={formData.organizationName}
                                    label="Organization Name"
                                    onchange={handleInputChange("organizationName")}
                                    onBlur={handleInputBlur("organizationName")}
                                    error={formErrors.organizationName}
                                />
                                <TextBox
                                    value={formData.organizationAddress}
                                    label="Organization Address"
                                    onchange={handleInputChange("organizationAddress")}
                                    onBlur={handleInputBlur("organizationAddress")}
                                    error={formErrors.organizationAddress}
                                />
                            </div>
                            {/* <div className='my-5 grid grid-cols-2'>
                                <div className="relative">
                                    <textarea
                                        type="text"
                                        id="website_url"
                                        className="block px-2.5 h-16 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                                        placeholder=" "
                                        value={description}
                                        onChange={(e) => { setDescription(e.target.value) }}
                                    ></textarea>
                                    <label
                                        htmlFor="website_url"
                                        className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-[1] origin-[0] bg-white dark:bg-black dark:text-white dark:peer-focus:text-blue-100 dark:peer-focus:outline-blue-200  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                    >
                                        Oganization Description <span className='text-xs'>(Optional)</span>
                                    </label>
                                </div>
                            </div> */}

                            <div className='flex justify-center gap-5 mt-8'>
                                <div className='w-1/2'>
                                    <h2 className='ml-2 text-base text-gray-500 text-center'>Business/Company Registration</h2>
                                    <div className='mt-2'>
                                        <ImageUploadInput setFile={handleInputChange("businessRegistrationImage")} customKey="businessRegistration"
                                         error={formErrors.businessRegistrationImage}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='mt-10'>
                            <div>
                                <h2 className="text-sm inline-block border-b-2 border-gray-400">
                                    User Details
                                </h2>
                            </div>
                            <div className='grid grid-cols-3 gap-x-10 gap-y-5 mt-3'>
                                <TextBox
                                    value={formData.firstName}
                                    label="First Name"
                                    onchange={handleInputChange("firstName")}
                                    onBlur={handleInputBlur("firstName")}
                                    error={formErrors.firstName}
                                />
                                <TextBox
                                    value={formData.lastName}
                                    label="Last Name"
                                    onchange={handleInputChange("lastName")}
                                    onBlur={handleInputBlur("lastName")}
                                    error={formErrors.lastName}
                                />
                                <TextBox
                                    value={formData.email}
                                    label="Email"
                                    onchange={handleInputChange("email")}
                                    onBlur={handleInputBlur("email")}
                                    error={formErrors.email}
                                />
                                <TextBox
                                    value={formData.phoneNo}
                                    label="Phone No"
                                    onchange={handleInputChange("phoneNo")}
                                    onBlur={handleInputBlur("phoneNo")}
                                    error={formErrors.phoneNo}
                                />
                                <TextBox
                                    value={formData.address}
                                    label="Address"
                                    onchange={handleInputChange("address")}
                                    onBlur={handleInputBlur("address")}
                                    error={formErrors.address}
                                />


                                <div className="relative">
                                    <Select
                                        value={formData.gender}
                                        classNames="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-red-800 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                                        isSearchable={true}
                                        onChange={handleInputChange("gender")}
                                        options={genders}
                                    />
                                    <label
                                        className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-[1] origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                    >
                                        Gender
                                    </label>
                                    {formErrors.gender && <p className="mt-1 text-xs text-red-500">{formErrors.gender}</p>}
                                </div>
                                <TextBox
                                    value={formData.password}
                                    label="Password"
                                    onchange={handleInputChange("password")}
                                    onBlur={handleInputBlur("password")}
                                    error={formErrors.password}
                                />
                                <TextBox
                                    value={formData.confimPassword}
                                    label="Confirm Password"
                                    onchange={handleInputChange("confimPassword")}
                                    onBlur={handleInputBlur("confimPassword")}
                                    error={formErrors.confimPassword}
                                />
                                <div className="relative">
                                    <Select
                                        value={formData.idType}
                                        classNames="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                                        isSearchable={true}
                                        onChange={handleInputChange("idType")}
                                        options={idTypes}
                                    />
                                    <label
                                        className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-[1] origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                    >
                                        ID Type
                                    </label>
                                    {formErrors.idType && <p className="mt-1 text-xs text-red-500">{formErrors.idType}</p>}

                                </div>
                                <TextBox
                                    value={formData.idNumber}
                                    label="ID Number"
                                    onchange={handleInputChange("idNumber")}
                                    onBlur={handleInputBlur("idNumber")}
                                    error={formErrors.idNumber}
                                />
                            </div>
                            <div className='grid grid-cols-2 gap-5 mt-8'>
                                <div>
                                    <h2 className='ml-2 text-base text-gray-500 text-center'>Id Verification Image</h2>
                                    <div className='mt-2'>
                                        <ImageUploadInput setFile={handleInputChange("idDocumentImage")} customKey="idDocumentImage"
                                        error={formErrors.idDocumentImage}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <h2 className='ml-2 text-base text-gray-500 text-center'>Upload Profile</h2>
                                    <div className='mt-2'>
                                        <ImageUploadInput setFile={handleInputChange("profile")} customKey="profile"
                                        error={formErrors.profile}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end mt-10">
                            {/* <div>
                                <button onClick={handleLogout}
                                    className="py-1.5 px-9 border border-blue-600 rounded-xl text-gray-900 hover:bg-blue-50 transition-all duration-500"
                                >
                                    Logout
                                </button>
                            </div> */}
                            <div>
                                <button onClick={handleSubmit} className="bg-blue-600 text-white py-1.5 px-9 rounded-xl border border-blue-600 hover:bg-blue-700 duration-500 transition-all">
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>



                </div>
            )}
        </>
    )
}

export default OrganizerRegister