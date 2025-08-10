import { useEffect, useRef, useState } from 'react'
import ModalLayout from '../ModalLayout';
import TextBox from '../../TextBox';
import toast from 'react-hot-toast';
import axiosInstance from '../../../services/axios';

const EventCategoryFormModal = ({ open, onClose, loading, setLoading, selectedDataForEdit = null, fetchData = null }) => {
    const apiKey = import.meta.env["VITE_APP_BASE_URL"];
    //addcustomer states
    const [formData, setFormData] = useState({
        name: "",
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
                    name: "",
                });
            }, 100);
            setFormErrors({});
        }
    }, [open]);

    useEffect(() => {
        if (selectedDataForEdit && open) {
            setFormData({
                name: selectedDataForEdit.name || "",
            });
        }
    }, [selectedDataForEdit, open]);

    const validateModalInputField = (fieldName, value) => {
        let message = "";
        const trimmed = value?.trim();

        switch (fieldName) {
            case "name":
                if (!trimmed) message = "Name is required";
                break;

            default:
                break;
        }

        setFormErrors((prev) => ({ ...prev, [fieldName]: message }));
    };


    const handleModalInputChange = (field) => (e) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (["name"].includes(field)) {
            validateModalInputField(field, value);
        }
    };

    const handleCustomerModalBlur = (field) => (e) => {
        validateModalInputField(field, e.target.value);
    };


    const validateForm = () => {
        const errors = {};
        let isValid = true;
        const {
            name,
        } = formData;


        if (!name.trim()) {
            errors.name = "Name is required";
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
        if (isEditMode) {
            formData.id=selectedDataForEdit.id; // only if backend needs ID in form body too
        }
        const method = isEditMode ? "put" : "post";
        const url = `${apiKey}api/eventcategory`;
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
            <ModalLayout
                open={open}
                onClose={onClose}
                submit={saveData}
                className=''
            >
                <div className='p-5'>
                    <div className="">
                        <h2 className="text-sm inline-block border-b-2 border-gray-400">
                            {selectedDataForEdit ? "Edit" : "Add"} Event Category
                        </h2>
                    </div>
                    <div className='mt-5'>
                        <div className="mt-5 flex-grow">
                            <TextBox
                                ref={nameRef}
                                value={formData.name}
                                label="Name"
                                onchange={handleModalInputChange("name")}
                                onBlur={handleCustomerModalBlur("name")}
                                error={FormErrors.name}
                            />
                        </div>
                    </div>

                </div>
            </ModalLayout>
            {/*end of add customer modal  */}
        </>
    )
}

export default EventCategoryFormModal