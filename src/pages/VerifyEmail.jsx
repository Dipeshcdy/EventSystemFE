import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import TextBox from "../components/TextBox"; // Ensure this uses Tailwind
import axiosInstance from "../services/axios";
import toast from "react-hot-toast";

const VerifyEmail = () => {
  const apiKey = import.meta.env["VITE_APP_BASE_URL"];
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
const [verifying, setVerifying] = useState(true);
  const [message, setMessage] = useState("");

   useEffect(() => {
    const encodedData = searchParams.get("data");

    if (!encodedData) {
      toast.error("Invalid or missing verification data.");
      setMessage("Invalid or missing verification data.");
      setVerifying(false);
      return;
    }

    try {
      const decoded = atob(encodedData);
      const parsed = JSON.parse(decoded);

      if (!parsed.UserId || !parsed.Code) {
        throw new Error("Corrupt verification link.");
      }

      verifyEmail(parsed.UserId, parsed.Code);
    } catch (error) {
      console.error(error);
      toast.error("Invalid verification link.");
      setMessage("Invalid verification link.");
      setVerifying(false);
    }
  }, []);
const verifyEmail = async (userId, code) => {
    try {
      const res = await axiosInstance.post(`${apiKey}api/authentication/verify-email`, {
        userId,
        code,
      });

      if (res.status === 200) {
        toast.success("Email verified successfully!");
        setMessage("Email verified successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Verification failed.";
      setMessage(msg);
    } finally {
      setVerifying(false);
    }
  };
return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-md max-w-md text-center">
        <h1 className="text-2xl font-semibold text-blue-600 mb-4">Verifying Email...</h1>
        <p className="text-gray-700">
          {verifying ? "Please wait while we verify your email." : message}
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
