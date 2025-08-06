import React, { useState } from 'react'
import { LuSettings2 } from "react-icons/lu";

const FilterModal = ({ children, applyFilter, resetFilter }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toogleModal = () => {
        setIsOpen((prev) => !prev);
    }
    const closeModal = () => setIsOpen(false);
    return (
        <div className='relative'>
            <button onClick={toogleModal} className='flex items-center gap-2 border border-gray-300 px-2.5 py-2 rounded-lg text-sm'>
                <LuSettings2 className='text-lg' />
                Filter
            </button>
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={closeModal}
                ></div>
            )}
            <div className={`absolute  top-[150%] left-0 bg-white text-sm text-gray-700 w-96 py-6 px-4 z-50 border border-gray-300 rounded-md transition-all duration-300 ease-linear dark:bg-black dark:text-white ${isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
                } `}>

                {/* arrow section */}
                <div className="absolute top-[-18px] left-6 w-0 h-0 border-l-[20px] border-r-[20px] border-b-[20px] border-l-transparent border-r-transparent border-b-gray-300"></div>
                <div className="absolute top-[-16px] left-6 w-0 h-0 border-l-[18px] border-r-[18px] border-b-[18px] border-l-transparent border-r-transparent border-b-white dark:border-b-black"></div>
                <div>
                    <h2>Filter</h2>
                </div>
                <div className='mt-3 flex flex-col gap-5'>
                    {children}
                </div>
                <div className='flex mt-5 gap-5'>
                    <button onClick={() => {
                        resetFilter();
                        toggleModal();
                    }} className='w-full border border-blue-600 rounded-xl text-gray-900 hover:bg-blue-50 transition-all duration-500 dark:text-white dark:hover:bg-red-600'>
                        Reset
                    </button>
                    <button onClick={() => {
                        applyFilter();
                        toggleModal();
                    }} className='bg-blue-600 text-white w-full py-2 rounded-xl border border-blue-600 hover:bg-blue-700 duration-500 transition-all'>Filter</button>
                </div>
            </div>
        </div>
    )
}

export default FilterModal