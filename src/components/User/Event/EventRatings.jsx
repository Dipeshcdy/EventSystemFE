import React, { useEffect, useState } from 'react'
import { Rating } from "@material-tailwind/react";
import { useAuth } from '../../../context/AuthContext';
import Pagination from '../../Pagination';
import ModalLayout from '../../modal/ModalLayout';
import axiosInstance from '../../../services/axios';
import toast from 'react-hot-toast';
import { IoTimeOutline } from 'react-icons/io5';
const pageSize = 10;
const EventRatings = ({ eventId }) => {
    const { setLoading } = useAuth();
    const [eventRatings, setEventRatings] = useState([]);
    const [currentUserHasRated, setCurrentUserHasRated] = useState(false);
    const apiKey = import.meta.env["VITE_APP_BASE_URL"];
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 5,
        totalPages: null,
        totalRecords: null,
    });

    const [ratingFormData, setRatingFormData] = useState({
        feedback: "",
        rating: 0,
    });
    const [FormErrors, setFormErrors] = useState({});

    // modal states
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            await fetchData();
        };
        loadData();
    }, []);

    const constructUrl = (currentPage, pageSize) => {
        let url = `${apiKey}api/event/${eventId}/ratings`;
        const params = new URLSearchParams();
        params.append("pageNumber", currentPage);
        params.append("pageSize", pageSize);

        return `${url}?${params.toString()}`;
    };
    const fetchData = async (currentPage = 1) => {
        const url = constructUrl(currentPage, pageSize);
        try {
            const response = await axiosInstance.get(url);
            if (response.status == 200) {
                const data = response.data.data.ratings;
                setEventRatings(data.items);
                setPagination({
                    currentPage: data.pageNumber,
                    pageSize: data.pageSize,
                    totalPages: data.totalPages,
                    totalRecords: data.totalRecords,
                });
                setCurrentUserHasRated(response.data.data.currentUserHasRated);
            }
        } catch (error) { }
    };
    //fetch category

    const onPaginationChange = async (paginationData) => {
        setPagination(paginationData);
        fetchData(paginationData.currentPage, pageSize);
    };


    //rating methods
    const validateModalInputField = (fieldName, value) => {
        let message = "";
        const trimmed = value?.trim();

        switch (fieldName) {
            case "feedback":
                if (!trimmed) message = "Feedback is required";
                break;

            case "rating":
                if (!value || value <= 0) message = "Please select a rating";
                break;

            default:
                break;
        }

        setFormErrors((prev) => ({ ...prev, [fieldName]: message }));
    };
    const handleRatingChange = (value) => {
        setRatingFormData((prev) => ({ ...prev, rating: value }));
        validateModalInputField("rating", value);
    };

    const handleModalInputChange = (field) => (e) => {
        const value = e.target.value;
        setRatingFormData((prev) => ({ ...prev, [field]: value }));
        if (["feedback"].includes(field)) {
            validateModalInputField(field, value);
        }
    };

    const handleModalBlur = (field) => (e) => {
        validateModalInputField(field, e.target.value);
    };

    const validateForm = () => {
        const errors = {};
        let isValid = true;
        const { feedback, rating } = ratingFormData;

        if (!feedback.trim()) {
            errors.feedback = "Feedback is required";
            isValid = false;
        }
        if (!rating || rating <= 0) {
            errors.rating = "Please select a rating";
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
        const url = `${apiKey}api/event/rate`;

        const payload = {
            eventId: eventId,
            feedback: ratingFormData.feedback, // or any custom remarks
            rating: ratingFormData.rating, // or any custom remarks
        };

        try {
            const response = await axiosInstance.post(url, payload);
            if (response.status === 200) {
                toast.success(response.data.message);
                await fetchData();
                handleModalClose();
            }
        } catch (error) {
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 500);
        }
    };


    const handleModalClose = () => {
        setOpenModal(false);
        setFormErrors({});
    }
    return (
        <>
            <div>
                <div className='flex justify-between items-center'>
                    <h2 className='text-2xl border-b border-gray-500'>User Reviews</h2>
                    {!currentUserHasRated && (
                        <button
                            onClick={() => { setOpenModal(true) }}
                            className="bg-blue-600 text-white py-1.5 px-9 rounded-xl border border-green-600 hover:bg-green-700 duration-500 transition-all"
                        >
                            Add Review
                        </button>
                    )}
                </div>
                <div >
                    {eventRatings.length > 0 ? (
                        eventRatings.map((element, index) => (
                            <div key={index} className='py-10 border-b border-gray-400'>
                                <div className="flex justify-between items-center">
                                    <div className='flex gap-5 items-center'>
                                        <div className='w-16 h-16'>
                                            <img
                                                className='w-full h-full rounded-full object-cover object-center'
                                                src={apiKey + element.profileImageUrl}
                                                alt=""
                                            />
                                        </div>
                                        <div className='space-y-1'>
                                            <h2>{element.fullName}</h2>
                                            <Rating value={element.rating} readonly />
                                        </div>
                                    </div>
                                    <div className='flex gap-4 items-center'>
                                        <IoTimeOutline />
                                        {(() => {
                                            const utcDate = element.createdAt.endsWith("Z")
                                                ? element.createdAt
                                                : element.createdAt + "Z";
                                            const dateObj = new Date(utcDate);
                                            return dateObj.toLocaleString(undefined, {
                                                hour12: true,
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                second: "2-digit",
                                            });
                                        })()}
                                    </div>
                                </div>
                                <div className='mt-8'>
                                    <p>{element.feedback}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-10 text-center text-gray-500">
                            No reviews yet. Be the first to leave a review!
                        </div>
                    )}
                </div>

                <div className="mt-4">
                    {eventRatings.length > 0 && (
                        <Pagination
                            totalRecords={pagination.totalRecords}
                            currentPage={pagination.currentPage}
                            pageSize={pagination.pageSize}
                            totalPages={pagination.totalPages}
                            onPaginationChange={onPaginationChange}
                        />
                    )}
                </div>

            </div>





            {/* rate event modal */}
            <ModalLayout open={openModal} onClose={handleModalClose} submit={saveData} className="" isDanger={true}>
                <div className="p-5">
                    <div className="">
                        <h2 className="text-sm inline-block border-b-2 border-gray-400">
                            Rate Event
                        </h2>
                    </div>
                    <div className="mt-5 grid gap-5">
                        <div>
                            <Rating value={ratingFormData.rating}
                                onChange={handleRatingChange}
                            />
                            {FormErrors.rating && <p className="mt-1 text-xs text-red-500">{FormErrors.rating}</p>}
                        </div>
                        <div className="relative">
                            <textarea
                                type="text"
                                id="website_url"
                                className="block px-2.5 h-16 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                                placeholder=" "
                                value={ratingFormData.feedback}
                                onChange={handleModalInputChange("feedback")}
                                onBlur={handleModalBlur("feedback")}
                            ></textarea>
                            <label
                                htmlFor="website_url"
                                className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-[1] origin-[0] bg-white dark:bg-black dark:text-white dark:peer-focus:text-blue-100 dark:peer-focus:outline-blue-200  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                            >
                                Feedback
                            </label>
                            {FormErrors.feedback && <p className="mt-1 text-xs text-red-500">{FormErrors.feedback}</p>}
                        </div>
                    </div>
                </div>
            </ModalLayout>
            {/*end of rate event */}

        </>
    )
}

export default EventRatings