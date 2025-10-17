import React from "react";
import logo from "../../../images/logo3.jpeg";
import { useAuth } from "../../../context/AuthContext";

const Footer = () => {
  const { loading } = useAuth();
  return (
    <>
      {!loading && (
        <>
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
                {/* Brand */}
                <div className="md:w-1/3">
                  <a href="/" aria-label="Go home" title="Event Ticketing" className="flex items-center">
                    <div className="h-10 w-10">
                      <img src={logo} className="h-full w-full rounded-full object-cover object-center" alt="Logo" />
                    </div>
                    <span className="ml-2 mt-auto text-lg font-bold tracking-wide text-gray-100 uppercase">
                      Event Ticketing System
                    </span>
                  </a>
                  <p className="mt-4 text-sm text-deep-purple-50 text-justify">
                    Streamline your event organization with our robust ticketing platform – sell tickets, manage check-ins,
                    and track attendance from one dashboard.
                  </p>
                </div>

                {/* Quick Links */}
                <div className="flex-grow flex items-center">
                  <div className="text-center flex justify-center flex-col w-full">
                    <p className="font-semibold tracking-wide text-teal-accent-400">Quick Links</p>
                    <ul className="mt-5 flex gap-5 justify-center">
                      <li>
                        <a href="/" className="transition-colors duration-300 text-deep-purple-50 hover:text-teal-300">
                          Home
                        </a>
                      </li>
                      <li>
                        <a href="/mytickets" className="transition-colors duration-300 text-deep-purple-50 hover:text-teal-300">
                          Tickets
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="flex flex-col justify-between pt-5 pb-10 border-t border-blue-300 sm:flex-row">
                <p className="text-sm text-gray-100">
                  © {new Date().getFullYear()} EventTicketing Inc. All rights reserved.
                </p>
                <div className="flex items-center mt-4 space-x-4 sm:mt-0">
                  <a href="/" className="hover:text-blue-400 transition-colors duration-300 text-deep-purple-100">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5">
                      <path d="M24,4.6c-0.9,0.4-1.8,0.7-2.8,0.8..." />
                    </svg>
                  </a>
                  <a href="/" className="hover:text-pink-400 transition-colors duration-300 text-deep-purple-100">
                    <svg viewBox="0 0 30 30" fill="currentColor" className="h-6">
                      <circle cx="15" cy="15" r="4" />
                      <path d="M19.999,3h-10C6.14,3,3,6.141,3..." />
                    </svg>
                  </a>
                  <a href="/" className="hover:text-blue-400 transition-colors duration-300 text-deep-purple-100">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5">
                      <path d="M22,0H2C0.895,0,0,0.895,0..." />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* end of footer section */}
        </>
      )}
    </>
  );
};

export default Footer;
