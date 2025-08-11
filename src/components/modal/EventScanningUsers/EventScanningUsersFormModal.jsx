import { useEffect, useRef, useState } from "react";
import ModalLayout from "../ModalLayout";
import TextBox from "../../TextBox";
import toast from "react-hot-toast";
import axiosInstance from "../../../services/axios";

const EventScanningUsersFormModal = ({
  open,
  onClose,
  loading,
  setLoading,
  eventId,
  fetchData = null,
  mode = "add",
  editData = null,
}) => {
  const apiKey = import.meta.env["VITE_APP_BASE_URL"];
  //addcustomer states
  const [formData, setFormData] = useState({
    fullName: "",
    eventId: eventId,
    password: "",
    confirmPassword: "",
  });

  const [FormErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const nameRef = useRef(null);
  //end of add customer states
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        nameRef.current?.focus();
      }, 50);

      if (mode === "edit" && editData) {
        setFormData({
          id: editData.id || null,
          fullName: editData.fullName || "",
          eventId: eventId,
          password: "",
          confirmPassword: "",
        });
      } else {
        setFormData({
          fullName: "",
          eventId: eventId,
          password: "",
          confirmPassword: "",
        });
      }
    } else {
      setFormErrors({});
    }
  }, [open, eventId, mode, editData]);

  const validateField = (fieldName, value) => {
    let message = "";
    const trimmed = value?.trim();

    if (
      (mode === "add" || mode === "edit") &&
      fieldName === "fullName" &&
      !trimmed
    ) {
      message = "Full Name is required";
    }

    if ((mode === "add" || mode === "password") && fieldName === "password") {
      if (!trimmed) {
        message = "Password is required";
      } else if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/.test(trimmed)
      ) {
        message =
          "Password must include upper/lower case, number, special character and be at least 6 characters";
      }
    }

    if (
      (mode === "add" || mode === "password") &&
      fieldName === "confirmPassword"
    ) {
      if (!trimmed) {
        message = "Confirm Password is required";
      } else if (trimmed !== formData.password) {
        message = "Passwords do not match";
      }
    }

    setFormErrors((prev) => ({ ...prev, [fieldName]: message }));
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleBlur = (field) => (e) => {
    validateField(field, e.target.value);
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;
    const { fullName, password, confirmPassword } = formData;

    if (mode === "add" || mode === "edit") {
      if (!fullName.trim()) {
        errors.fullName = "Full Name is required";
        isValid = false;
      }
    }

    if (mode === "add" || mode === "password") {
      if (!password.trim()) {
        errors.password = "Password is required";
        isValid = false;
      } else if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/.test(password)
      ) {
        errors.password =
          "Password must include upper/lower case, number, special character and be at least 6 characters";
        isValid = false;
      }

      if (!confirmPassword.trim()) {
        errors.confirmPassword = "Confirm Password is required";
        isValid = false;
      } else if (confirmPassword !== password) {
        errors.confirmPassword = "Passwords do not match";
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const saveData = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    let method = "post";
    let url = `${apiKey}api/ScanningUser/scanning-users`;

    if (mode === "edit") {
      method = "put";
    } else if (mode === "password") {
      method = "put";
      url = `${apiKey}api/ScanningUser/scanning-users/${editData?.id}/change-password/`;
    }

    try {
      const response = await axiosInstance({ method, url, data: formData });
      if (response.status === 200) {
        toast.success(response.data.message);
        if (typeof fetchData === "function") await fetchData();
        onClose();
      }
    } catch (error) {
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  //end of add customer

  return (
    <>
      {/* add customer modal  */}
      <ModalLayout open={open} onClose={onClose} submit={saveData} className="">
        <div className="p-5">
          <div className="">
            <h2 className="text-sm inline-block border-b-2 border-gray-400">
              {mode === "add" && "Add Scanning User"}
              {mode === "edit" && "Edit Scanning User"}
              {mode === "password" && "Change Password"}
            </h2>
          </div>
          <div className="mt-5">
            <div className="grid gap-5 mt-5 flex-grow">
              {/* Full Name - show in add & edit */}
              {(mode === "add" || mode === "edit") && (
                <TextBox
                  ref={nameRef}
                  value={formData.fullName}
                  label="Full Name"
                  onchange={handleChange("fullName")}
                  onBlur={handleBlur("fullName")}
                  error={FormErrors.fullName}
                />
              )}

              {/* Password - show in add & password */}
              {(mode === "add" || mode === "password") && (
                <>
                  <TextBox
                    value={formData.password}
                    label="Password"
                    onchange={handleChange("password")}
                    onBlur={handleBlur("password")}
                    error={FormErrors.password}
                    type={showPassword ? "text" : "password"}
                  />

                  <TextBox
                    value={formData.confirmPassword}
                    label="Confirm Password"
                    onchange={handleChange("confirmPassword")}
                    onBlur={handleBlur("confirmPassword")}
                    error={FormErrors.confirmPassword}
                    type={showPassword ? "text" : "password"}
                  />

                  {/* Show password toggle */}
                  <div className="flex items-center space-x-2 mt-1">
                    <input
                      id="show-password"
                      type="checkbox"
                      checked={showPassword}
                      onChange={() => setShowPassword((prev) => !prev)}
                      className="cursor-pointer"
                    />
                    <label
                      htmlFor="show-password"
                      className="cursor-pointer text-sm select-none"
                    >
                      Show Password
                    </label>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </ModalLayout>
      {/*end of add customer modal  */}
    </>
  );
};

export default EventScanningUsersFormModal;
