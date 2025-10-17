import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../common/Loader";
//import { handleRedirect, getToken } from "../utils/jwtUtils";
import bg from "../images/event.png"
import designerImage from "../images/Designer.png"
import login from "../images/login.webp"
import { RiLockPasswordLine } from "react-icons/ri";
import { CiUser } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { FaXmark } from "react-icons/fa6";
import FileUploadInput from "../components/FileUploadInput";
import axiosInstance from "../services/axios";

const Register = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const apiKey = import.meta.env["VITE_IDENTITY_BASE_URL"];
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisible = () => {
    setIsPasswordVisible(!isPasswordVisible);
  }


  const validateForm = () => {
    console.log(name)
    console.log(email)
    console.log(password)
    if (
      name.trim() === "" ||
      email.trim() === "" ||
      password.trim() === "" ||
      !file
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
    formData.append("Email", email);
    formData.append("Password", password);
    formData.append("Name", name);
    formData.append("File", file);
    setLoading(true);
    try {
      const response = await axiosInstance.post(`${apiKey}api/authentication/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      })

      if (response.status === 200) {
        console.log(response);
        toast.success(response.data.message);
        setLoading(false);
        navigate("/login");
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
      {loading ? (
        <>
          <Loader />
        </>
      ) : (
        <>
          <div className="font-[sans-serif]" style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'top',
            backgroundAttachment: 'fixed',
          }}>
            <div className="min-h-screen flex flex-col items-center justify-center backdrop-blur-sm">
              <div className="grid  items-center gap-4 max-md:gap-8 max-w-6xl max-md:max-w-lg w-full p-4 m-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md bg-white">
                <div className=" w-full px-4 py-4">
                  <form>
                    <div className="mb-12">
                      <h3 className="text-gray-800 text-3xl font-extrabold">Register</h3>
                      <p className="text-sm mt-4 text-gray-800">Already got an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap">Login here</Link></p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">

                      <div class="backdrop-blur-lg bg-white/70 border border-white/30 rounded-2xl p-8 shadow-xl hover:scale-105 transition-transform duration-300">
                        <div class="flex flex-col items-center text-center">
                          <div class="bg-blue-100 p-4 rounded-full mb-4">
                            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" stroke-width="2"
                              viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round"
                                d="M5.121 17.804A10.001 10.001 0 0112 2a10.001 10.001 0 016.879 15.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <h2 class="text-xl font-bold text-gray-800 mb-2">Register as User</h2>
                          <p class="text-gray-600 mb-6">Purchase Event Tickets and explore activities.</p>
                         <Link to="/register/user"
                            class="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition">Join Now</Link>
                        </div>
                      </div>

                      <div class="backdrop-blur-lg bg-white/70 border border-white/30 rounded-2xl p-8 shadow-xl hover:scale-105 transition-transform duration-300">
                        <div class="flex flex-col items-center text-center">
                          <div class="bg-green-100 p-4 rounded-full mb-4">
                            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" stroke-width="2"
                              viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round"
                                d="M9 12h6m-3-3v6m-7.5 4h15a2.5 2.5 0 002.5-2.5V5.5A2.5 2.5 0 0018.5 3h-13A2.5 2.5 0 003 5.5v11a2.5 2.5 0 002.5 2.5z" />
                            </svg>
                          </div>
                          <h2 class="text-xl font-bold text-gray-800 mb-2">Register as Organizer</h2>
                          <p class="text-gray-600 mb-6">Host your events and gain visibility.</p>
                          <Link to="/register/organizer"
                            class="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition">Start Hosting</Link>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Register;