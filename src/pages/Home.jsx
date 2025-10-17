import React, { useEffect, useState } from 'react'
import bg from "../images/1.png"
import { FaHotel, FaTicketAlt } from "react-icons/fa";
import { IoCalendarOutline, IoRestaurant } from "react-icons/io5";

import appImage from "../images/appimage.jpeg";
import { MdMailOutline } from "react-icons/md";
import { Link } from 'react-router-dom';
import Loader from '../common/Loader';

import { useAuth } from '../context/AuthContext';
import Nav from '../components/User/Includes/Nav';
import Footer from '../components/User/Includes/Footer';

const Home = () => {
    const [isLoading, setIsLoading] = useState(true);
    const {setLoading}=useAuth();

    useEffect(() => {
        const img = new Image();
        img.src = bg;
        img.onload = () => {
            setIsLoading(false);
        };
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, []);
    
    return (
        <>
            {isLoading && (
                <Loader />
            )}

            {!isLoading && (
                <>
                    {/* hero section */}
                    <section
                        className="relative h-[100vh] overflow-y-auto "
                        style={{
                            backgroundImage: `url(${bg})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'top',
                            backgroundAttachment: 'fixed',
                        }}
                    >
                        {/* Dark overlay to reduce brightness */}
                        <div className="absolute inset-0 bg-black opacity-70"></div>

                        <div className="relative w-full h-full max-h-[100vh] overflow-y-auto flex items-center justify-center">
                            {/* Section content goes here */}
                            <div className="p-8 relative z-10 text-white">
                                <h1 className="md:text-4xl text-lg mb-4 font-bold !font-sans  text-center">SIMPLIFYING EVENT TICKETING AND <br /> MANAGEMENT</h1>
                                <div className='grid md:grid-cols-2 gap-5 mt-10 mx-10'>
                                    <div className='text-center hover:bg-blue-800 p-5 rounded-xl transition-all duration-500 ease-linear hover:scale-105 cursor-default'>
                                        <div className='flex justify-center'>
                                            <FaTicketAlt  className='text-5xl' />
                                        </div>
                                        <h2 className='md:text-xl text-md font-semibold mt-2'>Event Ticketing</h2>
                                        <div className=''>
                                            <p className='text-xs'>Easily sell and manage tickets <br /> for any event. </p>
                                        </div>

                                    </div>
                                    <div className='text-center hover:bg-blue-800 p-5 rounded-xl transition-all duration-500 ease-linear hover:scale-105 cursor-default'>
                                        <div className='flex justify-center'>
                                            <IoCalendarOutline className='text-5xl' />
                                        </div>
                                        <h2 className='md:text-xl text-md font-semibold mt-2'>Event Management</h2>
                                        <div className=''>
                                            <p className='text-xs'>Organize, promote, and track your events <br />in one place.</p>
                                        </div>

                                    </div>
                                </div>
                                {/* Repeat content for testing scrolling */}
                            </div>
                        </div>
                    </section>
                    {/*end of hero section */}

                    {/* about section */}
                    <section className='md:px-20 px-10 py-10'>
                        <div className='grid md:grid-cols-2 gap-10 items-center'>
                            <div className="text-center md:text-left space-y-4">
                                <h2 className="text-3xl md:text-4xl font-bold text-[#236a9d]">Looking for a Smarter Way to Manage Your Events?</h2>
                                <p className="text-gray-600 text-justify">
                                    Our event ticketing platform offers a seamless experience for organizers and attendees alike. From online ticket sales to check-in, reporting, and engagement — everything you need is under one roof. Whether it's a concert, conference, or workshop, our software scales with your needs.
                                </p>
                                <a href="#" className="inline-block mt-4 px-6 py-3 text-white font-semibold button-gradient rounded-full shadow-md  transition hover:bg-right">
                                    Learn More
                                </a>
                            </div>
                            <div className='h-[500px] flex justify-center'>
                                <img src={appImage} className='h-full rounded-xl object-cover object-center' alt="" />
                            </div>
                        </div>
                    </section>
                    {/*end of about section */}
                    {/* {{-- contact us section --}} */}
                    
                    {/* {{--end of contact us section --}} */}
                </>
            )}

        </>
    )
}

export default Home