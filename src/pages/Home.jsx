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

    useEffect(() => {
        const img = new Image();
        img.src = bg;
        img.onload = () => {
            setIsLoading(false);
        };
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
                                            Have questions or want a live demo of our ticketing system? Reach out and we’ll get back to you as soon as possible!
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
                </>
            )}

        </>
    )
}

export default Home