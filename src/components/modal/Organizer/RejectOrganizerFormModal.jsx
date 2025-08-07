import { useEffect, useRef, useState } from "react";
import ModalLayout from "../ModalLayout";
import TextBox from "../../TextBox";
import toast from "react-hot-toast";
import axiosInstance from "../../../services/axios";

const RejectOrganizerFormModal = ({
  open,
  onClose,
  loading,
  setLoading,
  selectedDataForEdit = null,
  fetchData = null,
}) => {
  const apiKey = import.meta.env["VITE_APP_BASE_URL"];
  //addcustomer states
  const [formData, setFormData] = useState({
    remarks: "",
  });

  const [FormErrors, setFormErrors] = useState({});
  const nameRef = useRef(null);
  //end of add customer states
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        nameRef.current?.focus();
      }, 50); // small delay ensures DOM is ready
    } else {
      setTimeout(() => {
        setFormData({
          remarks: "",
        });
      }, 100);
      setFormErrors({});
    }
  }, [open]);

  useEffect(() => {
    if (selectedDataForEdit && open) {
      setFormData({
        remarks: selectedDataForEdit.remarks || "",
      });
    }
  }, [selectedDataForEdit, open]);

  const validateModalInputField = (fieldName, value) => {
    let message = "";
    const trimmed = value?.trim();

    switch (fieldName) {
      case "remarks":
        if (!trimmed) message = "Remarks is required";
        break;

      default:
        break;
    }

    setFormErrors((prev) => ({ ...prev, [fieldName]: message }));
  };

  const handleModalInputChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (["remarks"].includes(field)) {
      validateModalInputField(field, value);
    }
  };

  const handleCustomerModalBlur = (field) => (e) => {
    validateModalInputField(field, e.target.value);
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;
    const { remarks } = formData;

    if (!remarks.trim()) {
      errors.remarks = "Remarks is required";
      isValid = false;
    }
    // Update the error state (so each <TextBox /> can render error)
    setFormErrors(errors);
    return isValid;
  };
  const saveData = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    const isEditMode = !!selectedDataForEdit?.id;
    const id = selectedDataForEdit.id;
    const method = "put";
    const url = `${apiKey}api/organizer/${id}/reject`;
    setLoading(true);
    try {
      const response = await axiosInstance({
        method,
        url,
        data: formData,
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        if (typeof fetchData === "function") {
          await fetchData();
        }
        onClose();
      }
    } catch (error) {
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  //end of add customer

  return (
    <>
      {/* add customer modal  */}
      <ModalLayout open={open} onClose={onClose} submit={saveData} className="" isDanger={true}>
        <div className="p-5">
          <div className="">
            <h2 className="text-sm inline-block border-b-2 border-gray-400">
              Reject Organizer
            </h2>
          </div>
          <div className="mt-5">
            
            <div className="relative">
              <textarea
                ref={nameRef}
                type="text"
                id="website_url"
                className="block px-2.5 h-16 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                placeholder=" "
                value={formData.remarks}
                onChange={handleModalInputChange("remarks")}
                onBlur={handleCustomerModalBlur("remarks")}
              ></textarea>
              <label
                htmlFor="website_url"
                className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-[1] origin-[0] bg-white dark:bg-black dark:text-white dark:peer-focus:text-blue-100 dark:peer-focus:outline-blue-200  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Remarks
              </label>
              {FormErrors.remarks && <p className="mt-1 text-xs text-red-500">{FormErrors.remarks}</p>}
            </div>
          </div>
        </div>
      </ModalLayout>
      {/*end of add customer modal  */}
    </>
  );
};

export default RejectOrganizerFormModal;
