import React, { useEffect, useState } from 'react'
import bg from "../images/1.png"
import { FaHotel } from "react-icons/fa";
import { IoRestaurant } from "react-icons/io5";
import logo from "../images/logo2.png";
import appImage from "../images/appimage.jpeg";
import { MdMailOutline } from "react-icons/md";
import { Link } from 'react-router-dom';
import Loader from '../common/Loader';
import { FaBars } from "react-icons/fa";

const Home = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }
    useEffect(() => {
        const img = new Image();
        img.src = bg;
        img.onload = () => {
            setIsLoading(false);
        };
    }, []);
    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = "hidden"; // Disable background scrolling
        } else {
            document.body.style.overflow = ""; // Re-enable background scrolling
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = "";
        };
    }, [isSidebarOpen]);
    return (
        <>
            {isLoading && (
                <Loader />
            )}

            {!isLoading && (
                <>

                    {/* overlay */}
                    <div onClick={toggleSidebar} className={`fixed left-0 top-0 w-full h-full z-[998] bg-gray-600 bg-opacity-50 transition-all duration-300 ease-linear  ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0  pointer-events-none"} `}>
                    </div>
                    {/*end of overlay */}

                    {/* navbar */}
                    <div className={`flex justify-between items-center fixed top-0 z-50 left-0 right-0 md:px-20 px-10 py-4 bg-[#227ec0] `}>
                        <div className='w-10 h-10'>
                            <img src={logo} className='w-full h-full object-center object-cover' alt="" />
                        </div>
                        <div className='md:block hidden'>
                            <ul className='flex items-center gap-10 text-white text-lg font-semibold font-sans'>
                                <li>Home</li>
                                <li>About Us</li>
                                <li>Contact</li>
                            </ul>
                        </div>
                        <div className='hidden gap-5 md:flex'>
                            <Link to="/login" className='px-4 py-2 bg-green-500 text-black rounded-xl hover:bg-green-400 duration-300 transition-all ease-linear'>Demo</Link>
                            <Link to="/login" className='px-4 py-2 bg-white text-black rounded-xl hover:bg-gray-200 duration-300 transition-all ease-linear'>Login</Link>
                            <Link to="/register" className='px-4 py-2 bg-[#28a5ff] text-white rounded-xl hover:bg-[#3fa5ed] duration-300 transition-all ease-linear'>Register</Link>
                        </div>
                        <div onClick={toggleSidebar} className="lg:hidden block ">
                            <FaBars className='text-2xl cursor-pointer text-white' />
                        </div>
                    </div>

                    {/* mobile nav */}
                    <div className={`fixed  top-0  w-[70%] h-screen z-[999] bg-[#227ec0] px-10 py-4 pt-32 transition-all duration-500 ease-linear ${isSidebarOpen ? "left-0" : "-left-full"}`}>
                        <div className='block'>
                            <ul className='flex flex-col  gap-2 text-white text-lg font-semibold font-sans'>
                                <li>Home</li>
                                <li>About Us</li>
                                <li>Contact</li>
                            </ul>
                        </div>
                        <div className='flex gap-5 mt-5'>
                            <Link to="/login" className='px-4 py-2 bg-white text-black rounded-xl hover:bg-gray-200 duration-300 transition-all ease-linear'>Login</Link>
                            <Link to="/register" className='px-4 py-2 bg-[#28a5ff] text-white rounded-xl hover:bg-[#3fa5ed] duration-300 transition-all ease-linear'>Register</Link>
                        </div>
                    </div>
                    {/*end of mobile nav */}
                    {/*end of navbar */}
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
                                <h1 className="md:text-4xl text-lg mb-4 font-bold !font-sans  text-center">EMPOWERING HOSPITALITY <br /> MANAGEMENT</h1>
                                <div className='grid md:grid-cols-2 gap-5 mt-10 mx-10'>
                                    <div className='text-center hover:bg-blue-800 p-5 rounded-xl transition-all duration-500 ease-linear hover:scale-105 cursor-default'>
                                        <div className='flex justify-center'>
                                            <FaHotel className='text-5xl' />
                                        </div>
                                        <h2 className='md:text-xl text-md font-semibold mt-2'>Hotel Software</h2>
                                        <div className=''>
                                            <p className='text-xs'>Simplify Your Hotel <br /> Operations</p>
                                        </div>

                                    </div>
                                    <div className='text-center hover:bg-blue-800 p-5 rounded-xl transition-all duration-500 ease-linear hover:scale-105 cursor-default'>
                                        <div className='flex justify-center'>
                                            <IoRestaurant className='text-5xl' />
                                        </div>
                                        <h2 className='md:text-xl text-md font-semibold mt-2'>Restaurant POS</h2>
                                        <div className=''>
                                            <p className='text-xs'>Streamlin Your <br />Restaurant Operations</p>
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
                                <h2 className="text-3xl md:text-4xl font-bold text-[#236a9d]">Are you looking for the best PMS?</h2>
                                <p className="text-gray-600 text-justify">
                                    Ardent HMS/ Restro is a complete Hotel/Restaurant Management Software that covers the overall transaction of your hotel operations. It is easier for you to streamline all tasks, increase revenue, control expenses, and save manpower cost. As per your business needs, we are ready to serve you with both Server Based and Cloud-Based solutions.
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
                    <section className="bg-blue-50" id="contact">
                        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                            <div className="mb-4">
                                <div className="mb-6 max-w-3xl text-center sm:text-center md:mx-auto md:mb-12">
                                    <p className="text-base font-semibold uppercase tracking-wide text-primary wow animate__animated animate__fadeInUp">
                                        Contact
                                    </p>
                                    <h2
                                        className="font-heading mb-4 font-bold tracking-tight text-gray-900 text-3xl sm:text-5xl wow animate__animated animate__fadeInLeft">
                                        Get in Touch
                                    </h2>
                                    <p className="mx-auto mt-4 max-w-3xl text-xl text-gray-600 wow animate__animated animate__fadeInUp animate__delay-1s">Feel free to contact us !!
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-stretch justify-center">
                                <div className="grid md:grid-cols-2">
                                    <div className="h-full pr-6">
                                        <p className="mt-3 mb-12 text-lg text-gray-600 wow animate__animated animate__fadeInLeft animate__delay-1s">
                                            If you have any questions or would like to learn more about Hotel Management Software and our services, please don’t hesitate to contact us.
                                        </p>
                                        <ul className="mb-6 md:mb-0 wow animate__animated animate__fadeInLeft animate__delay-2s">
                                            <li className="flex">
                                                <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-900 text-gray-50">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                                        stroke-linejoin="round" className="h-6 w-6">
                                                        <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
                                                        <path
                                                            d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z">
                                                        </path>
                                                    </svg>
                                                </div>
                                                <div className="ml-4 mb-4">
                                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Our Address
                                                    </h3>
                                                    <p className="text-gray-600 dark:text-slate-400">Jawalakhel</p>
                                                    <p className="text-gray-600 dark:text-slate-400">Lalitpur, Nepal</p>
                                                </div>
                                            </li>
                                            <li className="flex">
                                                <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-900 text-gray-50">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                                        stroke-linejoin="round" className="h-6 w-6">
                                                        <path
                                                            d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2">
                                                        </path>
                                                        <path d="M15 7a2 2 0 0 1 2 2"></path>
                                                        <path d="M15 3a6 6 0 0 1 6 6"></path>
                                                    </svg>
                                                </div>
                                                <div className="ml-4 mb-4">
                                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Contact
                                                    </h3>
                                                    <p className="text-gray-600 dark:text-slate-400">+977 9708618877</p>
                                                </div>
                                            </li>
                                            <li className="flex">
                                                <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-900 text-gray-50">
                                                    <MdMailOutline className="text-xl font-bold" />
                                                </div>
                                                <div className="ml-4 mb-4">
                                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Mail</h3>
                                                    <p className="text-gray-600 dark:text-slate-400">ardent.np@gmail.com</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="card h-fit max-w-6xl p-5 md:p-12 wow animate__animated animate__zoomIn animate__delay-1s" id="form">
                                        <h2 className="mb-4 text-2xl font-bold">Ready to Get Started?</h2>
                                        <form id="contactForm" action="{{route('contact.store')}}" method="POST" className="flex flex-col gap-5">
                                            {/* @csrf */}
                                            <div>
                                                <div className="relative">
                                                    <input type="text" name="name" id="name" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value="" />
                                                    <label htmlFor="name" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-blue-50  px-2 peer-focus:px-2 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Name</label>
                                                </div>
                                                {/* @error('name')
                                  <p className="text-red-500 text-sm mt-1">* {{$message}}</p>
                              @enderror */}
                                            </div>
                                            <div>
                                                <div className="relative">
                                                    <input type="text" name="email" id="email" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value="" />
                                                    <label htmlFor="email" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-blue-50  px-2 peer-focus:px-2 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Email</label>
                                                </div>
                                                {/* @error('email')
                                  <p className="text-red-500 text-sm mt-1">* {{$message}}</p>
                              @enderror */}
                                            </div>
                                            <div>
                                                <div className="relative">
                                                    <input type="text" name="phone" id="phone" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value="" />
                                                    <label htmlFor="phone" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-blue-50  px-2 peer-focus:px-2 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Phone</label>
                                                </div>
                                                {/* @error('phone')
                                  <p className="text-red-500 text-sm mt-1">* {{$message}}</p>
                              @enderror */}
                                            </div>
                                            <div>
                                                <div className="relative">
                                                    <textarea type="text" name="message" id="message" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=""></textarea>
                                                    <label htmlFor="message" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-blue-50  px-2 peer-focus:px-2 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Message</label>
                                                </div>
                                                {/* @error('message')
                                  <p className="text-red-500 text-sm mt-1">* {{$message}}</p>
                              @enderror */}
                                            </div>
                                            <div className="text-center">
                                                <button type="submit" className="w-full relative  bg-transparent border-2 border-primary  text-primary hover:text-white transition-all duration-500 px-6 py-3 font-xl rounded-md sm:mb-0 before:content-[''] before:absolute before:left-0 before:w-full before:bottom-0 before:h-0 hover:before:h-full before:bg-primary before:transition-all before:duration-500 overflow-hidden"><span className="relative">Send Message</span></button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section >
                    {/* {{--end of contact us section --}} */}



                    {/* footer section */}
                    <div className="relative mt-16 bg-[#227ec0]">
                        <svg
                            className="absolute top-0 w-full h-6 -mt-5 sm:-mt-10 sm:h-16 text-deep-purple-accent-400"
                            preserveAspectRatio="none"
                            viewBox="0 0 1440 54"
                        >
                            <path
                                fill="#227ec0"
                                d="M0 22L120 16.7C240 11 480 1.00001 720 0.700012C960 1.00001 1200 11 1320 16.7L1440 22V54H1320C1200 54 960 54 720 54C480 54 240 54 120 54H0V22Z"
                            />
                        </svg>
                        <div className="px-4 pt-12 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 text-white">
                            <div className="flex flex-wrap gap-16 row-gap-10 mb-8">
                                <div className="md:w-1/3">
                                    <a
                                        href="/"
                                        aria-label="Go home"
                                        title="Company"
                                        className="flex items-center"
                                    >
                                        <div className='h-10 w-10'>
                                            <img src={logo} className='h-full w-full object-cover object-center' alt="" />
                                        </div>
                                        <span className="ml-2 mt-auto text-lg font-bold tracking-wide text-gray-100 uppercase">
                                            Hotel Management Software
                                        </span>
                                    </a>
                                    <div className="mt-4 text-sm">
                                        <p className="text-sm text-deep-purple-50 text-justify ">
                                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                                            accusantium doloremque laudantium, totam rem aperiam.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex-grow flex items-center">
                                    <div className=' text-center flex justify-center flex-col w-full'>
                                        <p className="font-semibold tracking-wide text-teal-accent-400">
                                            Quick Links
                                        </p>
                                        <ul className="mt-5 flex gap-5 justify-center">
                                            <li>
                                                <a
                                                    href="/"
                                                    className="transition-colors duration-300 text-deep-purple-50 hover:text-teal-accent-400"
                                                >
                                                    Home
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="/"
                                                    className="transition-colors duration-300 text-deep-purple-50 hover:text-teal-accent-400"
                                                >
                                                    About Us
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="/"
                                                    className="transition-colors duration-300 text-deep-purple-50 hover:text-teal-accent-400"
                                                >
                                                    Contact
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col justify-between pt-5 pb-10 border-t border-deep-purple-accent-200 sm:flex-row">
                                <p className="text-sm text-gray-100">
                                    © Copyright 2020 Lorem Inc. All rights reserved.
                                </p>
                                <div className="flex items-center mt-4 space-x-4 sm:mt-0">
                                    <a
                                        href="/"
                                        className="transition-colors duration-300 text-deep-purple-100 hover:text-teal-accent-400 hover:text-blue-400"
                                    >
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5">
                                            <path d="M24,4.6c-0.9,0.4-1.8,0.7-2.8,0.8c1-0.6,1.8-1.6,2.2-2.7c-1,0.6-2,1-3.1,1.2c-0.9-1-2.2-1.6-3.6-1.6 c-2.7,0-4.9,2.2-4.9,4.9c0,0.4,0,0.8,0.1,1.1C7.7,8.1,4.1,6.1,1.7,3.1C1.2,3.9,1,4.7,1,5.6c0,1.7,0.9,3.2,2.2,4.1 C2.4,9.7,1.6,9.5,1,9.1c0,0,0,0,0,0.1c0,2.4,1.7,4.4,3.9,4.8c-0.4,0.1-0.8,0.2-1.3,0.2c-0.3,0-0.6,0-0.9-0.1c0.6,2,2.4,3.4,4.6,3.4 c-1.7,1.3-3.8,2.1-6.1,2.1c-0.4,0-0.8,0-1.2-0.1c2.2,1.4,4.8,2.2,7.5,2.2c9.1,0,14-7.5,14-14c0-0.2,0-0.4,0-0.6 C22.5,6.4,23.3,5.5,24,4.6z" />
                                        </svg>
                                    </a>
                                    <a
                                        href="/"
                                        className="transition-colors duration-300 text-deep-purple-100 hover:text-teal-accent-400 hover:text-pink-400"
                                    >
                                        <svg viewBox="0 0 30 30" fill="currentColor" className="h-6">
                                            <circle cx="15" cy="15" r="4" />
                                            <path d="M19.999,3h-10C6.14,3,3,6.141,3,10.001v10C3,23.86,6.141,27,10.001,27h10C23.86,27,27,23.859,27,19.999v-10   C27,6.14,23.859,3,19.999,3z M15,21c-3.309,0-6-2.691-6-6s2.691-6,6-6s6,2.691,6,6S18.309,21,15,21z M22,9c-0.552,0-1-0.448-1-1   c0-0.552,0.448-1,1-1s1,0.448,1,1C23,8.552,22.552,9,22,9z" />
                                        </svg>
                                    </a>
                                    <a
                                        href="/"
                                        className="transition-colors duration-300 text-deep-purple-100 hover:text-teal-accent-400 hover:text-blue-400"
                                    >
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5">
                                            <path d="M22,0H2C0.895,0,0,0.895,0,2v20c0,1.105,0.895,2,2,2h11v-9h-3v-4h3V8.413c0-3.1,1.893-4.788,4.659-4.788 c1.325,0,2.463,0.099,2.795,0.143v3.24l-1.918,0.001c-1.504,0-1.795,0.715-1.795,1.763V11h4.44l-1,4h-3.44v9H22c1.105,0,2-0.895,2-2 V2C24,0.895,23.105,0,22,0z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*end of footer section */}

                </>
            )}

        </>
    )
}

export default Home