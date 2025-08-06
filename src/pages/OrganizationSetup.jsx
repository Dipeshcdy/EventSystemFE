import React, { useEffect, useState } from 'react'
import FileUploadInput from '../components/FileUploadInput'
import ImageUploadInput from '../components/ImageUploadInput';
import Select from "react-tailwindcss-select";
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import setup from "../images/setup.jpg"
import axiosInstance from '../services/axios';
import Loader from '../common/Loader';
const OrganizationSetup = () => {
  const { logout } = useAuth();
  const apiKey = import.meta.env["VITE_IDENTITY_BASE_URL"];
  const [loading, setLoading] = useState(true);
  //data
  const [address, setAddress] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [taxtNumber, setTaxNumber] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [description, setDescription] = useState("");
  const [userName, setUserName] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [userContact, setUserContact] = useState("");

  const [logo, setLogo] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [taxdoc, setTaxdoc] = useState(null);
  const [orgTypes, setOrgTypes] = useState([]);
  const [organizationType, setOrganizationType] = useState(null);
  const [genders, setGenders] = useState([{value:1,label:"Male"},{value:2,label:"Female"},{value:3,label:"Other"}]);
  const [gender, setGender] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      setLoading(true);
      await fetchOrganizationTypes();
      setLoading(false);
    }
    fetchData();
  }, []);



  const handleOrganizationTypeChange = value => {
    setOrganizationType(value);
  }
  const handleGenderChange = value => {
    setGender(value);
  }
  const handleLogout = () => {
    toast.success("Logged Out Successfully");
    logout()
  };


  const fetchOrganizationTypes = async () => {
    try {
      const response = await axiosInstance.get(`${apiKey}api/organization/organizationTypes`);
      if (response.status == 200) {
        var filteredOrganizationTypes = response.data.data.map(item => ({
          value: item.id,
          label: item.name
        }));
        setOrgTypes(filteredOrganizationTypes);
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
      address.trim() === "" ||
      registrationNumber.trim() === "" ||
      taxtNumber.trim() === "" ||
      contactNumber.trim() === "" ||
      !organizationType ||
      !logo || !taxdoc ||
      userName.trim() === "" ||
      userContact.trim() === "" ||
      userAddress.trim() === "" ||
      !profilePicture || !gender

    ) {
      toast.error("Please fill all fields and upload a all files!");
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
                <h1 className="md:text-3xl text-2xl">Organization Setup</h1>
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
                <div className="relative">
                  <input
                    type="text"
                    id="address"
                    className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                    placeholder=" "
                    value={address}
                    onChange={(e) => { setAddress(e.target.value) }}
                  />
                  <label
                    htmlFor="address"
                    className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-[1] origin-[0] bg-white dark:bg-black dark:text-white dark:peer-focus:text-blue-100 dark:peer-focus:outline-blue-200  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                  >
                    Address
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    id="reg_number"
                    className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                    placeholder=" "
                    value={registrationNumber}
                    onChange={(e) => { setRegistrationNumber(e.target.value) }}
                  />
                  <label
                    htmlFor="reg_number"
                    className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-[1] origin-[0] bg-white dark:bg-black dark:text-white dark:peer-focus:text-blue-100 dark:peer-focus:outline-blue-200  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                  >
                    Registration Number
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    id="tax_number"
                    className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                    placeholder=" "
                    value={taxtNumber}
                    onChange={(e) => { setTaxNumber(e.target.value) }}
                  />
                  <label
                    htmlFor="tax_number"
                    className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-[1] origin-[0] bg-white dark:bg-black dark:text-white dark:peer-focus:text-blue-100 dark:peer-focus:outline-blue-200  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                  >
                    Tax Number
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    id="contact"
                    className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                    placeholder=" "
                    value={contactNumber}
                    onChange={(e) => { setContactNumber(e.target.value) }}
                  />
                  <label
                    htmlFor="contact"
                    className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-[1] origin-[0] bg-white dark:bg-black dark:text-white dark:peer-focus:text-blue-100 dark:peer-focus:outline-blue-200  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                  >
                    Contact Number
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    id="website_url"
                    className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                    placeholder=" "
                    value={websiteUrl}
                    onChange={(e) => { setWebsiteUrl(e.target.value) }}
                  />
                  <label
                    htmlFor="website_url"
                    className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-[1] origin-[0] bg-white dark:bg-black dark:text-white dark:peer-focus:text-blue-100 dark:peer-focus:outline-blue-200  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                  >
                    Website Url <span className='text-xs'>(Optional)</span>
                  </label>
                </div>
                <div className="relative">
                  <Select
                    value={organizationType}
                    classNames="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                    isSearchable={true}
                    onChange={handleOrganizationTypeChange}
                    options={orgTypes}
                  />
                  <label
                    htmlFor="address"
                    className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-[1] origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                  >
                    Organization Type
                  </label>
                </div>

              </div>
              <div className='my-5 grid grid-cols-2'>
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
              </div>
              <div className='grid grid-cols-2 gap-5 mt-8'>
                <div>
                  <h2 className='ml-2 text-base text-gray-500 text-center'>Upload Logo</h2>
                  <div className='mt-2'>
                    {/* logo */}
                    <ImageUploadInput setFile={setLogo} customKey="logo-upload" />
                    {/* end of logo */}
                  </div>
                </div>
                <div>
                  <h2 className='ml-2 text-base text-gray-500 text-center'>Upload Tax Document</h2>
                  <div className='mt-2'>
                    {/* tax */}
                    <FileUploadInput setFile={setTaxdoc} customKey="taxdoc-upload" />
                    {/* end of tax */}
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
                <div className="relative">
                  <input
                    type="text"
                    id="user-name"
                    className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                    placeholder=" "
                    value={userName}
                    onChange={(e) => { setUserName(e.target.value) }}
                  />
                  <label
                    htmlFor="user-name"
                    className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-[1] origin-[0] bg-white dark:bg-black dark:text-white dark:peer-focus:text-blue-100 dark:peer-focus:outline-blue-200  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                  >
                    Name
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    id="user-address"
                    className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                    placeholder=" "
                    value={userAddress}
                    onChange={(e) => { setUserAddress(e.target.value) }}
                  />
                  <label
                    htmlFor="user-address"
                    className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-[1] origin-[0] bg-white dark:bg-black dark:text-white dark:peer-focus:text-blue-100 dark:peer-focus:outline-blue-200  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                  >
                    Address
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    id="user-contact"
                    className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                    placeholder=" "
                    value={userContact}
                    onChange={(e) => { setUserContact(e.target.value) }}
                  />
                  <label
                    htmlFor="user-contact"
                    className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-[1] origin-[0] bg-white dark:bg-black dark:text-white dark:peer-focus:text-blue-100 dark:peer-focus:outline-blue-200  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                  >
                    Contact Number
                  </label>
                </div>
                <div className="relative">
                  <Select
                    value={gender}
                    classNames="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                    isSearchable={true}
                    onChange={handleGenderChange}
                    options={genders}
                  />
                  <label
                    htmlFor="address"
                    className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-[1] origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                  >
                    Gender
                  </label>
                </div>
              </div>
              <div className='flex justify-center gap-5 mt-8'>
                <div className='w-1/2'>
                  <h2 className='ml-2 text-base text-gray-500 text-center'>Upload Profile</h2>
                  <div className='mt-2'>
                    {/* profile */}
                    <ImageUploadInput setFile={setProfilePicture} customKey="profile-upload" />
                    {/* end of profile */}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-10">
              <div>
                <button onClick={handleLogout}
                  className="py-1.5 px-9 border border-blue-600 rounded-xl text-gray-900 hover:bg-blue-50 transition-all duration-500"
                >
                  Logout
                </button>
              </div>
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

export default OrganizationSetup