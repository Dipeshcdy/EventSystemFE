import React, { useEffect, useRef, useState } from 'react'
import ModalLayout from '../ModalLayout';
import TextBox from '../../TextBox';
import { AiTwotoneEdit } from "react-icons/ai";
import toast from 'react-hot-toast';
import axiosInstance from '../../../services/axios';

const ClientFormModal = ({ open, onClose, loading, setLoading, selectedClientForEdit = null, fetchClients = null }) => {
    const apiKey = import.meta.env["VITE_APP_BASE_URL"];
    //addcustomer states
    const [clientForm, setClientForm] = useState({
        clientName: "",
        clientId: "",
        phoneNumber: "",
        email: "",
        country: "",
        state: "",

        website: "",
        address1: "",
        address2: "",
        vatNumber: "",
        creditLimit: "",
        creditDays: "",
    });

    const [customerFormErrors, setCustomerFormErrors] = useState({});
    const clientNameRef = useRef(null);
    const logoInputRef = useRef(null);
    const [logo, setLogo] = useState(null);
    const [file, setFile] = useState(null);
    //end of add customer states
    useEffect(() => {
        if (open) {
            setTimeout(() => {
                clientNameRef.current?.focus();
            }, 50); // small delay ensures DOM is ready
        } else {
            setTimeout(() => {
                setClientForm({
                    clientName: "",
                    clientId: "",
                    phoneNumber: "",
                    email: "",
                    country: "",
                    state: "",
                    website: "",
                    address1: "",
                    address2: "",
                    vatNumber: "",
                    creditLimit: "",
                    creditDays: ""
                });
                setLogo(null);
                setFile(null);
            }, 100);
            setCustomerFormErrors({});
        }
    }, [open]);

    useEffect(() => {
        if (selectedClientForEdit && open) {
            setClientForm({
                clientName: selectedClientForEdit.clientName || "",
                clientId: selectedClientForEdit.clientId || "",
                phoneNumber: selectedClientForEdit.phoneNumber || "",
                email: selectedClientForEdit.email || "",
                country: selectedClientForEdit.country || "",
                state: selectedClientForEdit.state || "",
                website: selectedClientForEdit.website || "",
                address1: selectedClientForEdit.addressLine1 || "",
                address2: selectedClientForEdit.addressLine2 || "",
                vatNumber: selectedClientForEdit.vatNumber || "",
                creditLimit: selectedClientForEdit.creditLimit || "",
                creditDays: selectedClientForEdit.creditDays || "",
            });

            if (selectedClientForEdit.logoUrl) {
                setLogo(selectedClientForEdit.logoUrl);
            }
        }
    }, [selectedClientForEdit, open]);


    const handleLogoChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            // Validate file type
            const validImageTypes = ["image/png", "image/jpeg", "image/jpg"];
            if (validImageTypes.includes(selectedFile.type)) {
                setFile(selectedFile); // Set the file for API submission

                const reader = new FileReader();
                reader.onloadend = () => {
                    setLogo(reader.result); // Set the preview URL
                };
                reader.readAsDataURL(selectedFile);
            } else {
                toast.error("Invalid file type. Please upload a PNG or JPEG image.");
            }
        }
    };

    const handleEditLogoClick = () => {
        logoInputRef.current.click();
    };

    const validateCustomerModalInputField = (fieldName, value) => {
        let message = "";
        const trimmed = value?.trim();

        switch (fieldName) {
            case "clientName":
                if (!trimmed) message = "Client name is required";
                break;

            case "clientId":
                if (!trimmed) message = "Client ID is required";
                break;

            case "phoneNumber":
                if (!trimmed) message = "Phone number is required";
                else if (!/^\d{10}$/.test(trimmed)) message = "Invalid phone number format";
                break;

            case "email":
                if (!trimmed) message = "Email is required";
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) message = "Invalid email format";
                break;

            case "country":
                if (!trimmed) message = "Country is required";
                break;

            case "state":
                if (!trimmed) message = "State is required";
                break;

            case "website":
                if (trimmed && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(trimmed)) message = "Invalid website URL";
                break;

            case "address1":
                if (!trimmed) message = "Address Line 1 is required";
                break;

            case "vatNumber":
                if (trimmed && !/^\d{9}$/.test(trimmed)) {
                    message = "VAT number must be exactly 9 digits";
                }
                break;

            case "creditLimit":
            case "creditDays":
                if (trimmed) {
                    const numberValue = parseFloat(trimmed);
                    if (isNaN(numberValue) || numberValue < 0) {
                        message = `${fieldName === "creditLimit" ? "Credit Limit" : "Credit Days"} must be a non-negative number`;
                    }
                }
                break;

            default:
                break;
        }

        setCustomerFormErrors((prev) => ({ ...prev, [fieldName]: message }));
    };


    const handleCustomerModalInputChange = (field) => (e) => {
        const value = e.target.value;
        setClientForm((prev) => ({ ...prev, [field]: value }));
        if (["clientName", "clientId", "phoneNumber", "email", "country", "state", "website", "address1", "vatNumber", "creditLimit", "creditDays"].includes(field)) {
            validateCustomerModalInputField(field, value);
        }
    };

    const handleCustomerModalBlur = (field) => (e) => {
        validateCustomerModalInputField(field, e.target.value);
    };


    const validateCustomerForm = () => {
        const errors = {};
        let isValid = true;
        const {
            clientName,
            clientId,
            phoneNumber,
            email,
            country,
            state,
            website,
            address1,
            address2,
            vatNumber,
            creditLimit,
            creditDays,
        } = clientForm;


        if (!clientName.trim()) {
            errors.clientName = "Client name is required";
            isValid = false;
        }

        if (!clientId.trim()) {
            errors.clientId = "Client ID is required";
            isValid = false;
        }

        if (!phoneNumber.trim()) {
            errors.phoneNumber = "Phone number is required";
            isValid = false;
        } else if (!/^\d{10}$/.test(phoneNumber)) {
            errors.phoneNumber = "Invalid phone number format";
            isValid = false;
        }

        if (!email.trim()) {
            errors.email = "Email is required";
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = "Invalid email format";
            isValid = false;
        }

        if (!country.trim()) {
            errors.country = "Country is required";
            isValid = false;
        }

        if (!state.trim()) {
            errors.state = "State is required";
            isValid = false;
        }

        if (website.trim() && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(website)) {
            errors.website = "Invalid website URL";
            isValid = false;
        }

        if (!address1.trim()) {
            errors.address1 = "Address Line 1 is required";
            isValid = false;
        }

        if (vatNumber.trim() && !/^\d{9}$/.test(vatNumber.trim())) {
            errors.vatNumber = "VAT number must be exactly 9 digits";
            isValid = false;
        }

        const creditLimitValue = parseFloat(String(creditLimit ?? "").trim());
        if (!isNaN(creditLimitValue)) {
            if (creditLimitValue <= 0) {
                errors.creditLimit = "Credit Limit must be a positive number";
                isValid = false;
            }
        } else if (String(creditLimit ?? "").trim() !== "") {
            errors.creditLimit = "Credit Limit must be a valid number";
            isValid = false;
        }

        const creditDaysValue = parseFloat(String(creditDays ?? "").trim());
        if (!isNaN(creditDaysValue)) {
            if (creditDaysValue <= 0) {
                errors.creditDays = "Credit Days must be a positive number";
                isValid = false;
            }
        } else if (String(creditDays ?? "").trim() !== "") {
            errors.creditDays = "Credit Days must be a valid number";
            isValid = false;
        }


        // Update the error state (so each <TextBox /> can render error)
        setCustomerFormErrors(errors);

        return isValid;
    };
    const saveCustomer = async (e) => {
        e.preventDefault();
        if (!validateCustomerForm()) {
            return;
        }
        setLoading(true);
        const formData = new FormData();
        if (file) {
            formData.append("Logo", file); // Assuming 'file' is your IFormFile
        }
        formData.append("ClientName", clientForm.clientName);
        formData.append("ClientId", clientForm.clientId);
        formData.append("PhoneNumber", clientForm.phoneNumber);
        formData.append("Email", clientForm.email);
        formData.append("AddressLine1", clientForm.address1);
        formData.append("AddressLine2", clientForm.address2);
        formData.append("Country", clientForm.country);
        formData.append("State", clientForm.state);
        formData.append("Website", clientForm.website);
        formData.append("VatNumber", clientForm.vatNumber);
        formData.append("CreditLimit", clientForm.creditLimit);
        formData.append("CreditDays", clientForm.creditDays);
        const isEditMode = !!selectedClientForEdit?.id;
        if (isEditMode) {
            formData.append("Id", selectedClientForEdit.id); // only if backend needs ID in form body too
        }
        const method = isEditMode ? "put" : "post";
        const url = `${apiKey}api/client`;
        setLoading(true);
        try {
            const response = await axiosInstance({
                method,
                url,
                data: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                toast.success(response.data.message);
                if (typeof fetchClients === "function") {
                    await fetchClients();
                }
                onClose();
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
                submit={saveCustomer}
                className='sm:!max-w-[60%]'
            >
                <div className='p-5'>
                    <div className="">
                        <h2 className="text-sm inline-block border-b-2 border-gray-400">
                            {selectedClientForEdit ? "Edit" : "Add"} Customer
                        </h2>
                    </div>
                    <div className='flex gap-5 mt-5'>
                        <div className="mt-5">
                            <div className='w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center relative'>
                                {logo ? (
                                    <img src={logo} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <h2>Logo</h2>
                                )}
                                <div className='absolute right-0 bottom-1 cursor-pointer' onClick={handleEditLogoClick}>
                                    <AiTwotoneEdit className='text-xl' />
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={logoInputRef}
                                    onChange={handleLogoChange}
                                    className="hidden"
                                />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-5 mt-5 flex-grow">
                            <TextBox
                                ref={clientNameRef}
                                value={clientForm.clientName}
                                label="Client Name"
                                onchange={handleCustomerModalInputChange("clientName")}
                                onBlur={handleCustomerModalBlur("clientName")}
                                error={customerFormErrors.clientName}
                            />

                            <TextBox
                                value={clientForm.clientId}
                                label="Client ID"
                                onchange={handleCustomerModalInputChange("clientId")}
                                onBlur={handleCustomerModalBlur("clientId")}
                                error={customerFormErrors.clientId}
                            />

                            <TextBox
                                value={clientForm.phoneNumber}
                                label="Phone Number"
                                onchange={handleCustomerModalInputChange("phoneNumber")}
                                onBlur={handleCustomerModalBlur("phoneNumber")}
                                error={customerFormErrors.phoneNumber}
                            />

                            <TextBox
                                value={clientForm.email}
                                label="Email"
                                onchange={handleCustomerModalInputChange("email")}
                                onBlur={handleCustomerModalBlur("email")}
                                error={customerFormErrors.email}
                            />

                            <TextBox
                                value={clientForm.address1}
                                label="Address Line 1"
                                onchange={handleCustomerModalInputChange("address1")}
                                onBlur={handleCustomerModalBlur("address1")}
                                error={customerFormErrors.address1}
                            />

                            <TextBox
                                value={clientForm.address2}
                                label="Address Line 2"
                                onchange={handleCustomerModalInputChange("address2")}
                            />

                            <TextBox
                                value={clientForm.country}
                                label="Country"
                                onchange={handleCustomerModalInputChange("country")}
                                onBlur={handleCustomerModalBlur("country")}
                                error={customerFormErrors.country}
                            />

                            <TextBox
                                value={clientForm.state}
                                label="State"
                                onchange={handleCustomerModalInputChange("state")}
                                onBlur={handleCustomerModalBlur("state")}
                                error={customerFormErrors.state}
                            />

                            <TextBox
                                value={clientForm.website}
                                label="Website"
                                onchange={handleCustomerModalInputChange("website")}
                                onBlur={handleCustomerModalBlur("website")}
                                error={customerFormErrors.website}
                            />

                            <TextBox
                                value={clientForm.vatNumber}
                                label="Vat"
                                onchange={handleCustomerModalInputChange("vatNumber")}
                                onBlur={handleCustomerModalBlur("vatNumber")}
                                error={customerFormErrors.vatNumber}
                            />

                            <TextBox
                                value={clientForm.creditLimit}
                                label="Credit Limit"
                                onchange={handleCustomerModalInputChange("creditLimit")}
                                onBlur={handleCustomerModalBlur("creditLimit")}
                                error={customerFormErrors.creditLimit}
                            />

                            <TextBox
                                value={clientForm.creditDays}
                                label="Credit Days"
                                onchange={handleCustomerModalInputChange("creditDays")}
                                onBlur={handleCustomerModalBlur("creditDays")}
                                error={customerFormErrors.creditDays}
                            />
                        </div>
                    </div>

                </div>
            </ModalLayout>
            {/*end of add customer modal  */}
        </>
    )
}

export default ClientFormModal