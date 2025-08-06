import React from 'react'

const ApproveModal = ({ showApproveModal, handleModalClose, handleApprove }) => {
    return (
        <>
            {showApproveModal ? (<>
                <div className="fixed inset-0 flex items-center justify-center z-[999] backdrop-blur confirm-dialog ">
                    <div className="relative px-4 min-h-screen md:flex md:items-center md:justify-center">
                        <div className=" opacity-25 w-full h-full absolute z-10 inset-0"></div>
                        <div className="bg-white rounded-lg md:max-w-md md:mx-auto p-4 fixed inset-x-0 bottom-0 z-50 mb-4 mx-4 md:relative shadow-lg">
                            <div className="md:flex items-center">
                                <div className="rounded-full border border-gray-300 flex items-center justify-center w-16 h-16 flex-shrink-0 mx-auto">
                                    {/* <i className="bx bx-error text-3xl">
                                        &#9888;
                                    </i> */}
                                    <i className="bx bx-check-circle text-green-600 text-4xl">&#10004;</i>
                                </div>
                                <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                                    <p className="font-bold">Are You Sure?</p>
                                    <p className="text-sm text-gray-700 mt-1">You are going to approve this. This action cannot be undone.
                                    </p>
                                </div>
                            </div>
                            <div className="text-center md:text-right mt-4 md:flex md:justify-end">
                                <button onClick={handleApprove} id="confirm-delete-btn" className="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-green-500 text-white rounded-lg font-semibold text-sm md:ml-2 md:order-2">
                                    Approve
                                </button>
                                <button onClick={handleModalClose} id="confirm-cancel-btn" className="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-gray-200 rounded-lg font-semibold text-sm mt-4 md:mt-0 md:order-1">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>) : (<></>)}
        </>
    )
}

export default ApproveModal