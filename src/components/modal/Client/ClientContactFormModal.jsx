import React, { useEffect, useRef, useState } from 'react'
import ModalLayout from '../ModalLayout';
import TextBox from '../../TextBox';
import { AiTwotoneEdit } from "react-icons/ai";
import toast from 'react-hot-toast';
import axiosInstance from '../../../services/axios';

const ClientContactFormModal = ({ open, onClose, loading, setLoading,fetchClientById,selectedContactForEdit,clientId = null }) => {
    const apiKey = import.meta.env["VITE_APP_BASE_URL"];

    //addcustomer states
    const [contactForm, setContactForm] = useState({
        contactName: "",
        contactId: "",
        firstName: "",
        lastName: "",
        position: "",
        email: "",
        mobile: "",
        location: "",
    });

    const [contactFormErrors, setContactFormErrors] = useState({});
    const contactNameRef = useRef(null);
    // const logoInputRef = useRef(null);
    // const [logo, setLogo] = useState(null);
    // const [file, setFile] = useState(null);
    //end of add customer states
    useEffect(() => {
        if (open) {
            setTimeout(() => {
                contactNameRef.current?.focus();
            }, 50); // small delay ensures DOM is ready
        } else {
            setTimeout(() => {
                setContactForm({
                    contactName: "",
                    contactId: "",
                    firstName: "",
                    lastName: "",
                    position: "",
                    email: "",
                    mobile: "",
                    location: "",
                });
            }, 100);
            setContactFormErrors({});
        }
    }, [open]);

    useEffect(() => {
    if (selectedContactForEdit && open) {
        setContactForm({
            contactName: selectedContactForEdit.contactName || "",
            contactId: selectedContactForEdit.contactId || "",
            firstName: selectedContactForEdit.firstName || "",
            lastName: selectedContactForEdit.lastName || "",
            position: selectedContactForEdit.position || "",
            email: selectedContactForEdit.email || "",
            mobile: selectedContactForEdit.phoneNumber || "", // Match backend field if needed
            location: selectedContactForEdit.location || "",
        });
    }
}, [selectedContactForEdit, open]);


    const validateContactModalInputField = (fieldName, value) => {
        let message = "";
        const trimmed = value?.trim();

        switch (fieldName) {
            case "contactName":
                if (!trimmed) message = "Contact name is required";
                break;

            case "contactId":
                if (!trimmed) message = "Contact ID is required";
                break;

            case "firstName":
                if (!trimmed) message = "First name is required";
                break;

            case "lastName":
                if (!trimmed) message = "Last name is required";
                break;

            case "position":
                if (!trimmed) message = "Position is required";
                break;

            case "email":
                if (!trimmed) message = "Email is required";
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) message = "Invalid email format";
                break;

            case "mobile":
                if (!trimmed) message = "Mobile number is required";
                else if (!/^\d{10}$/.test(trimmed)) message = "Invalid mobile number format";
                break;

            case "location":
                if (!trimmed) message = "Location is required";
                break;

            default:
                break;
        }

        setContactFormErrors((prev) => ({ ...prev, [fieldName]: message }));
    };

    const handleContactModalInputChange = (field) => (e) => {
        const value = e.target.value;
        setContactForm((prev) => ({ ...prev, [field]: value }));

        // Validate only required or formatted fields
        const fieldsToValidate = [
            "contactName",
            "contactId",
            "firstName",
            "lastName",
            "position",
            "email",
            "mobile",
            "location"
        ];

        if (fieldsToValidate.includes(field)) {
            validateContactModalInputField(field, value);
        }
    };

    const handleContactModalBlur = (field) => (e) => {
        validateContactModalInputField(field, e.target.value);
    };


    const validateContactForm = () => {
        const errors = {};
        let isValid = true;

        const {
            contactName,
            contactId,
            firstName,
            lastName,
            position,
            email,
            mobile,
            location
        } = contactForm;

        if (!contactName.trim()) {
            errors.contactName = "Contact name is required";
            isValid = false;
        }

        if (!contactId.trim()) {
            errors.contactId = "Contact ID is required";
            isValid = false;
        }

        if (!firstName.trim()) {
            errors.firstName = "First name is required";
            isValid = false;
        }

        if (!lastName.trim()) {
            errors.lastName = "Last name is required";
            isValid = false;
        }

        if (!position.trim()) {
            errors.position = "Position is required";
            isValid = false;
        }

        if (!email.trim()) {
            errors.email = "Email is required";
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = "Invalid email format";
            isValid = false;
        }

        if (!mobile.trim()) {
            errors.mobile = "Mobile number is required";
            isValid = false;
        } else if (!/^\d{10}$/.test(mobile)) {
            errors.mobile = "Mobile number must be 10 digits";
            isValid = false;
        }

        if (!location.trim()) {
            errors.location = "Location is required";
            isValid = false;
        }

        setContactFormErrors(errors);
        return isValid;
    };


    const saveContact = async (e) => {
        e.preventDefault();

        if (!validateContactForm()) {
            return;
        }
        if (clientId == null) {
            toast.error("Please Select Client First!");
            return;
        }
        setLoading(true);
        // Prepare JSON payload from contactForm
        const contactData = {
            contactName: contactForm.contactName,
            contactId: contactForm.contactId,
            firstName: contactForm.firstName,
            lastName: contactForm.lastName,
            position: contactForm.position,
            email: contactForm.email,
            phoneNumber: contactForm.mobile,
            location: contactForm.location,
            clientId: clientId
        };
         const isEditMode = !!selectedContactForEdit?.id;
        if (isEditMode) {
            contactData.id=selectedContactForEdit.id; // only if backend needs ID in form body too
        }
         const method = isEditMode ? "put" : "post";
        const url = `${apiKey}api/clientContact`;

        try {
            const response = await axiosInstance({
                method,
                url,
                data: contactData,
            });


            if (response.status === 200) {
                toast.success(response.data.message);
                onClose(); // close modal or reset form
                await fetchClientById(clientId);
            }
        } catch (error) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else if (error.message) {
                console.error("Error:", error.message);
                toast.error(error.message);
            } else {
                console.error("Unexpected Error:", error);
                toast.error("An unexpected error occurred.");
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
            {!loading && (
                <ModalLayout
                    open={open}
                    onClose={onClose}
                    submit={saveContact}
                    className='sm:!max-w-[60%]'
                >
                    <div className='p-5'>
                        <div className="">
                            <h2 className="text-sm inline-block border-b-2 border-gray-400">
                                {selectedContactForEdit ? "Edit" : "Add"} Contact
                            </h2>
                        </div>
                        <div className='mt-5'>
                            {/* <div className="mt-5">
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
                            </div> */}
                            <div className="grid md:grid-cols-2 gap-5 mt-5 flex-grow">
                                <TextBox
                                    ref={contactNameRef}
                                    value={contactForm.contactName}
                                    label="Contact Name"
                                    onchange={handleContactModalInputChange("contactName")}
                                    onBlur={handleContactModalBlur("contactName")}
                                    error={contactFormErrors.contactName}
                                />

                                <TextBox
                                    value={contactForm.contactId}
                                    label="Contact ID"
                                    onchange={handleContactModalInputChange("contactId")}
                                    onBlur={handleContactModalBlur("contactId")}
                                    error={contactFormErrors.contactId}
                                />

                                <TextBox
                                    value={contactForm.firstName}
                                    label="First Name"
                                    onchange={handleContactModalInputChange("firstName")}
                                    onBlur={handleContactModalBlur("firstName")}
                                    error={contactFormErrors.firstName}
                                />

                                <TextBox
                                    value={contactForm.lastName}
                                    label="Last Name"
                                    onchange={handleContactModalInputChange("lastName")}
                                    onBlur={handleContactModalBlur("lastName")}
                                    error={contactFormErrors.lastName}
                                />

                                <TextBox
                                    value={contactForm.position}
                                    label="Position"
                                    onchange={handleContactModalInputChange("position")}
                                    onBlur={handleContactModalBlur("position")}
                                    error={contactFormErrors.position}
                                />

                                <TextBox
                                    value={contactForm.email}
                                    label="Email"
                                    onchange={handleContactModalInputChange("email")}
                                    onBlur={handleContactModalBlur("email")}
                                    error={contactFormErrors.email}
                                />

                                <TextBox
                                    value={contactForm.mobile}
                                    label="Mobile"
                                    onchange={handleContactModalInputChange("mobile")}
                                    onBlur={handleContactModalBlur("mobile")}
                                    error={contactFormErrors.mobile}
                                />

                                <TextBox
                                    value={contactForm.location}
                                    label="Location"
                                    onchange={handleContactModalInputChange("location")}
                                    onBlur={handleContactModalBlur("location")}
                                    error={contactFormErrors.location}
                                />
                            </div>

                        </div>

                    </div>
                </ModalLayout>
            )}
            {/*end of add customer modal  */}
        </>
    )
}

export default ClientContactFormModal