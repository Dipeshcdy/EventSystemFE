import axiosInstance from "../../../services/axios";
import TextBox from "../../../components/TextBox";
import ImageUploadInput from "../../../components/ImageUploadInput";
import dummyImg from "../../../images/dummy-image.jpg";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import RejectOrganizerFormModal from "../../../components/modal/Organizer/RejectOrganizerFormModal";
import ConfirmModal from "../../../components/modal/ConfirmModal";
import toast from "react-hot-toast";
const ViewOrganizer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [organizer, setOrganizer] = useState(null);
  const { setActivePage, setActiveSubMenu, loading, setLoading } = useAuth();
  const [pageLoading, setPageLoading] = useState(true);
  setActivePage("organizers");
  const apiKey = import.meta.env["VITE_APP_BASE_URL"];
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrganizer, setSelectedOrganizer] = useState(null);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`${apiKey}api/organizer/${id}`);
      const data = res.data.data;
      setOrganizer(data); // assuming ApiResponse<T> structure
      switch (data.approvalStatus) {
        case "Pending":
          setActiveSubMenu("pendingOrganizers");
          break;
        case "Approved":
          setActiveSubMenu("approvedOrganizers");
          break;
        case "Rejected":
          setActiveSubMenu("rejectedOrganizers");
          break;
        default:
          setActiveSubMenu(null); // or some fallback if needed
      }
    } catch (error) {
    } finally {
      setLoading(false);
      setPageLoading(false);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleApproveModalClose = () => {
    setApproveModalOpen(false);
  };

  const handleApprove = async () => {
    const userId = organizer?.id;

    if (!userId) {
      toast.error("Something went wrong. Client ID is missing.");
      return;
    }
    setLoading(true);
    const url = `${apiKey}api/organizer/${userId}/approve`;
    try {
      const response = await axiosInstance.put(url);
      if (response.status === 200) {
        toast.success(response.data.message);
        navigate(-1);
        handleApproveModalClose();
      }
    } catch (error) {
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  return (
    <>
      {!pageLoading && (
        <>
          <div className="">
            <div>
              <h2 className="text-sm inline-block border-b-2 border-gray-400">
                View Organizer
              </h2>
            </div>
          </div>
          <div className="p-10">
            <div>
              <div>
                <h2 className="text-sm inline-block border-b-2 border-gray-400">
                  Organization Details
                </h2>
              </div>
              <div className="grid grid-cols-3 gap-x-10 gap-y-5 mt-3">
                <TextBox
                  value={organizer.organizationName}
                  label="Organization Name"
                  readonly={true}
                />
                <TextBox
                  value={organizer.organizationAddress}
                  label="Organization Address"
                  readonly={true}
                />
              </div>
              {/* <div className='my-5 grid grid-cols-2'>
                                <div className="relative">
                                    <textarea
                                        type="text"
                                        id="website_url"
                                        className="block px-2.5 h-16 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                                        placeholder=" "
                                        value={description}
                                        onChange={(e) => { setDescription(e.target.value) }}
                                    ></textarea>
                                    <label
                                        htmlFor="website_url"
                                        className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-[1] origin-[0] bg-white dark:bg-black dark:text-white dark:peer-focus:text-blue-100 dark:peer-focus:outline-blue-200  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                    >
                                        Oganization Description <span className='text-xs'>(Optional)</span>
                                    </label>
                                </div>
                            </div> */}

              <div className="flex justify-center gap-5 mt-8">
                <div className="w-1/2">
                  <h2 className="ml-2 text-base text-gray-500 text-center">
                    Business/Company Registration
                  </h2>
                  <div className="mt-2">
                    <ImageUploadInput
                      existingImageUrl={
                        organizer.businessRegistrationImageUrl
                          ? apiKey + organizer.businessRegistrationImageUrl
                          : ""
                      }
                      isEditable={false}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <div>
                <h2 className="text-sm inline-block border-b-2 border-gray-400">
                  User Details
                </h2>
              </div>

              <div className="flex gap-8 mt-5">
                <div className="w-[80px] h-[80px] relative">
                  <img
                    src={
                      organizer.profileImageUrl
                        ? apiKey + organizer.profileImageUrl
                        : dummyImg
                    }
                    alt="Profile"
                    className="w-full h-full object-cover object-center rounded-full"
                  />
                  {/* {isEditing && (
                    <div className="absolute -bottom-1 -right-1">
                      <AiTwotoneEdit
                        className="cursor-pointer text-lg"
                        onClick={() => imageInputRef.current.click()}
                      />
                    </div>
                  )} */}
                </div>
                {/* <input
                  ref={imageInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) =>
                    setImageSrc(URL.createObjectURL(e.target.files[0]))
                  }
                  disabled={!isEditing}
                /> */}
                <div className="flex-grow">
                  <div className="grid grid-cols-3 gap-x-10 gap-y-5 mt-3">
                    <TextBox
                      value={organizer.firstName}
                      label="First Name"
                      readonly={true}
                    />
                    <TextBox
                      value={organizer.lastName}
                      label="Last Name"
                      readonly={true}
                    />
                    <TextBox
                      value={organizer.email}
                      label="Email"
                      readonly={true}
                    />
                    <TextBox
                      value={organizer.phoneNo}
                      label="Phone No"
                      readonly={true}
                    />
                    <TextBox
                      value={organizer.address}
                      label="Address"
                      readonly={true}
                    />
                    <TextBox
                      value={organizer.gender}
                      label="Gender"
                      readonly={true}
                    />
                    <TextBox
                      value={organizer.isEmailVerified}
                      label="Email Verified"
                      readonly={true}
                    />
                    <TextBox
                      value={organizer.approvalStatus}
                      label="Approval Status"
                      readonly={true}
                    />
                    <TextBox
                      value={organizer.idType}
                      label="ID Type"
                      readonly={true}
                    />
                    <TextBox
                      value={organizer.idNumber}
                      label="ID Number"
                      readonly={true}
                    />
                    
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-5 mt-8">
                <div className="w-1/2">
                  <h2 className="ml-2 text-base text-gray-500 text-center">
                    Id Verification Image
                  </h2>
                  <div className="mt-2">
                    <ImageUploadInput
                      existingImageUrl={
                        organizer.idDocumentImageUrl
                          ? apiKey + organizer.idDocumentImageUrl
                          : ""
                      }
                      isEditable={false}
                    />
                  </div>
                </div>
              </div>

              {organizer.remarks && (
                <div className="mt-5">
                  <div className="relative">
                    <textarea
                      type="text"
                      id="website_url"
                      className="block px-2.5 h-16 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                      placeholder=" "
                      value={organizer.remarks}
                    ></textarea>
                    <label
                      htmlFor="website_url"
                      className="absolute text-sm text-red-500  duration-300 transform -translate-y-4 scale-75 top-2 z-[1] origin-[0] bg-white dark:bg-black dark:text-white dark:peer-focus:text-blue-100 dark:peer-focus:outline-blue-200  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                    >
                      Remarks for Rejection
                    </label>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center mt-10">
              <div>
                <button
                  onClick={() => navigate(-1)}
                  className="py-1.5 px-9 border border-blue-600 rounded-xl text-gray-900 hover:bg-blue-50 transition-all duration-500"
                >
                  Back
                </button>
              </div>
              {(organizer.approvalStatus === "Pending" ||
                organizer.approvalStatus === "Rejected") && (
                <div className="flex gap-4">
                  <button
                    onClick={() => setModalOpen(true)}
                    className="bg-red-600 text-white py-1.5 px-9 rounded-xl border border-red-600 hover:bg-red-700 duration-500 transition-all"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => setApproveModalOpen(true)}
                    className="bg-blue-600 text-white py-1.5 px-9 rounded-xl border border-green-600 hover:bg-green-700 duration-500 transition-all"
                  >
                    Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <RejectOrganizerFormModal
        open={modalOpen}
        onClose={handleModalClose}
        loading={loading}
        setLoading={setLoading}
        selectedDataForEdit={organizer}
        fetchData={() => navigate(-1)}
      />

      <ConfirmModal
        open={approveModalOpen}
        onClose={handleApproveModalClose}
        submit={handleApprove}
        isDanger={false}
      />
    </>
  );
};

export default ViewOrganizer;
