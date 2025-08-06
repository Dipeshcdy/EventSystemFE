import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import TextBox from "../components/TextBox"; // Ensure this uses Tailwind
import axiosInstance from "../services/axios";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const apiKey = import.meta.env["VITE_IDENTITY_BASE_URL"];
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [userId, setUserId] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const encodedData = searchParams.get("data");
    if (!encodedData) {
      toast.error("Missing reset link data.");
      return;
    }

    try {
      const decodedString = atob(encodedData);
      const parsed = JSON.parse(decodedString);

      if (!parsed.UserId || !parsed.Code) {
        throw new Error("Invalid reset link content.");
      }

      setUserId(parsed.UserId);
      setCode(parsed.Code);
    } catch (err) {
      console.error(err);
      toast.error("Invalid or corrupted reset link.");
    }
  }, []);

  const handleReset = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Both password fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const res = await axiosInstance.post(
        `${apiKey}api/authentication/reset-password`,
        {
          userId,
          code,
          newPassword,
          confirmPassword,
        }
      );

      if (res.status === 200) {
        toast.success("Password reset successful!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        // Optionally redirect to login
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-blue-600 text-center mb-6">
          Choose a New Password
        </h2>

        <div className="space-y-4">
          <TextBox
            id="newPassword"
            type="password"
            label="New Password"
            value={newPassword}
            onchange={(e) => setNewPassword(e.target.value)}
          />

          <TextBox
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            value={confirmPassword}
            onchange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            onClick={handleReset}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition duration-200"
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
