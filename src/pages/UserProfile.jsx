import { useState, useRef, useEffect } from "react";
import Layout from "../components/Layout";
import dummyImg from "../images/dummy-image.jpg";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../services/axios";
import TextBox from "../components/TextBox";
import { AiTwotoneEdit } from "react-icons/ai";
import toast from "react-hot-toast";
import ModalLayout from "../components/modal/ModalLayout";
import { useAuth } from "../context/AuthContext";
const UserProfile = () => {
  const apiKey = import.meta.env["VITE_IDENTITY_BASE_URL"];
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState(null);
  const [file, setFile] = useState(null);
  const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] =
    useState(false);
  const [pageLoading, setPageLoading] = useState(true); // 🔹 Local loading

  const { setActivePage, setActiveSubMenu, loading, setLoading } = useAuth();

  //input states
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDOB] = useState("");
  const [gender, setGender] = useState(1);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const imageInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleImageChange = (e) => {
    const image = e.target.files[0];
    setFile(image);
    if (image) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result);
      };
      reader.readAsDataURL(image);
    }
  };
  const triggerFileInput = () => {
    imageInputRef.current.click();
  };

  const handleSaveClick = async () => {
    try {
      const formData = new URLSearchParams();

      formData.append("firstName", firstName);
      formData.append("middleName", middleName || "");
      formData.append("lastName", lastName);
      formData.append("phoneNumber", phoneNumber);
      formData.append("email", email);
      formData.append("address", address);
      formData.append("gender", gender);
      formData.append("isActive", isActive);

      if (dob) {
        formData.append("dateOfBirth", new Date(dob).toISOString());
      }

      if (imageSrc instanceof File) {
        formData.append("image", imageSrc);
      }

      const response = await axiosInstance.put(
        `${apiKey}api/Profile`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      console.log(response);

      if (response.status === 200) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axiosInstance.get(`${apiKey}api/Profile`);
        console.log(response);
        if (response.status === 200) {
          const user = response.data.data;
          setFirstName(user.firstName);
          setMiddleName(user.middleName);
          setLastName(user.lastName);
          setPhoneNumber(user.phoneNumber);
          setEmail(user.email);
          setAddress(user.address);
          setDOB(
            user.dateOfBirth
              ? new Date(user.dateOfBirth).toLocaleDateString("en-CA")
              : ""
          );
          setGender(user.gender);
          setImageSrc(user.imageUrl || dummyImg);
          setIsActive(user.isActive);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Error fetching user data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const handleChangePassword = async () => {

    if (!password || !newPassword || !confirmPassword){
      toast.error("Please fill all the fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append("CurrentPassword", password);
      formData.append("NewPassword", newPassword);
      formData.append("ConfirmPassword", confirmPassword);

      const response = await axiosInstance.put(
        `${apiKey}api/Profile/change-password`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      console.log(response);

      if (response.status === 200) {
        toast.success("Password changed successfully");
        setIsPasswordChangeModalOpen(false);
      } else {
        toast.error("Failed to change password");
      }
    } catch (error) {
    console.error("Change password error:", error);
    if (error.response) {
      const { data, status } = error.response;

      if (status === 400) {
        if (typeof data === "string") {
          toast.error(data);
        } else if (typeof data === "object" && data.message) {
          toast.error(data.message);
        } else if (data.errors) {
          const messages = Object.values(data.errors).flat();
          messages.forEach((msg) => toast.error(msg));
        } else {
          toast.error("Invalid request.");
        }
      } else if (status === 401) {
        toast.error("Current password is incorrect.");
      } else {
        toast.error(`Server error (${status}). Please try again later.`);
      }
    } else {
      toast.error("Network error. Please check your connection.");
    }
  } finally {
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }
};

  return (
    <>
      <div>
        <h2 className="text-sm inline-block border-b-2 border-gray-400">
          {isEditing ? "Edit" : "View"} User
        </h2>
      </div>

      <div className="mt-5 flex lg:flex-row flex-col gap-5 ml-5">
        {/* Profile Image Section */}
        <div>
          <div className="w-[80px] h-[80px] relative">
            <img
              src={imageSrc ? imageSrc : dummyImg}
              alt="Profile"
              className="w-full h-full object-cover object-center rounded-full"
            />
            {isEditing && (
              <div className="absolute -bottom-1 -right-1">
                <AiTwotoneEdit
                  className="cursor-pointer text-lg"
                  onClick={() => imageInputRef.current.click()}
                />
              </div>
            )}
          </div>
          <input
            ref={imageInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) =>
              setImageSrc(URL.createObjectURL(e.target.files[0]))
            }
            disabled={!isEditing}
          />
        </div>

        {/* User Details Form */}
        <div className="flex-grow">
          <form>
            <div className="grid lg:grid-cols-2 gap-5">
              <TextBox
                id="firstName"
                value={firstName}
                label="First Name"
                onchange={(e) => setFirstName(e.target.value)}
                disabled={!isEditing}
              />
              <TextBox
                id="middleName"
                value={middleName}
                label="Middle Name"
                onchange={(e) => setMiddleName(e.target.value)}
                disabled={!isEditing}
              />
              <TextBox
                id="lastName"
                value={lastName}
                label="Last Name"
                onchange={(e) => setLastName(e.target.value)}
                disabled={!isEditing}
              />
              <TextBox
                id="contact"
                value={phoneNumber}
                label="Contact Number"
                onchange={(e) => setPhoneNumber(e.target.value)}
                disabled={!isEditing}
              />
              <TextBox
                id="email"
                value={email}
                label="Email Address"
                onchange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
              />
              <TextBox
                id="address"
                value={address}
                label="Address"
                onchange={(e) => setAddress(e.target.value)}
                disabled={!isEditing}
              />
              <TextBox
                id="dob"
                value={dob}
                label="Date Of Birth"
                onchange={(e) => setDOB(e.target.value)}
                type="date"
                disabled={!isEditing}
              />

              {/* Gender Selection */}
              <div className="relative">
                <select
                  id="sex"
                  className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary-light peer dark:bg-black dark:text-white"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  disabled={!isEditing}
                >
                  <option disabled>Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <label
                  htmlFor="sex"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 bg-white px-2 peer-focus:text-primary-light peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 dark:bg-black dark:text-white"
                >
                  Sex
                </label>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="flex justify-between mt-5">
        {/* Toggle between Edit and Save buttons */}
        {isEditing ? (
          <button
            onClick={handleSaveClick}
            className="bg-green-600 text-white py-1.5 px-9 rounded-xl border border-green-600 hover:bg-green-700 duration-500 transition-all"
          >
            Save
          </button>
        ) : (
          <button
            onClick={handleEditClick}
            className="bg-blue-600 text-white py-1.5 px-9 rounded-xl border border-blue-600 hover:bg-blue-700 duration-500 transition-all"
          >
            Edit
          </button>
        )}
        <button
          onClick={() => setIsPasswordChangeModalOpen(true)}
          className="bg-green-600 text-white py-1.5 px-9 rounded-xl border border-green-600 hover:bg-green-700 duration-500 transition-all"
        >
          Change Password
        </button>
      </div>

      <ModalLayout
        open={isPasswordChangeModalOpen}
        submit={handleChangePassword}
        onClose={() => {
          setIsPasswordChangeModalOpen(false);
          setPassword("");
          setConfirmPassword("");
          setNewPassword("");
        }}
        submitLabel="Change Password"
      >
        <div className="p-5">
          {/* Title */}
          <h2 className="text-sm inline-block border-b-2 border-gray-400">
            Change Password
          </h2>

          <div className="mt-5">
            <div className="flex flex-col gap-4">
              {/* Current Password */}
              <div className="w-full">
                <TextBox
                  type="password"
                  id="password"
                  value={password}
                  label="Current Password"
                  onchange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* New Password */}
              <div className="w-full">
                <TextBox
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  label="New Password"
                  onchange={(e) => {
                    setNewPassword(e.target.value);
                  }}
                />
              </div>

              {/* Confirm Password */}
              <div className="w-full">
                <TextBox
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  label="Confirm Password"
                  onchange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </ModalLayout>
    </>
  );
};
export default UserProfile;
