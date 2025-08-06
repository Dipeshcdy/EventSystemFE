import React from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

const ModalLayout = ({children,setOpen,open,submit,onClose=null,className=""}) => {
    return (
        <>
            <Dialog open={open} onClose={onClose??setOpen} className="relative z-[1000] !h-[100vh]">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
                />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            transition
                            className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 dark:bg-black dark:text-white ${className}`}
                        >
                            {children}
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 dark:bg-black">
                                <button
                                    type="button"
                                    onClick={submit}
                                    data-autofocus
                                    className="inline-flex w-full justify-center rounded-md border-2 focus:!border-blue-600 focus:bg-transparent focus:text-blue-600 bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 dark:text-white dark:bg-blue-600 dark:hover:bg-blue-800 sm:ml-3 sm:w-auto"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => (onClose ? onClose() : setOpen(false))} 
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto dark:hover:bg-red-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default ModalLayout