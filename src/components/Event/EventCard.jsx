import React from "react";
import { IoLocationOutline, IoPricetagOutline } from "react-icons/io5";
import { IoCalendarOutline } from "react-icons/io5";
import formatNepaliCurrency from "../../utils/utils";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/dateFormatter";

const EventCard = ({ element }) => {
  const apiKey = import.meta.env["VITE_APP_BASE_URL"];

  const isBookingOpen = () => {
    const now = new Date();
    const bookingStart = new Date(element.bookingStart);
    const bookingEnd = new Date(element.bookingEnd);
    return now >= bookingStart && now <= bookingEnd;
  };

  const formattedBookingStart = formatDate(element.bookingStart);
  const formattedBookingEnd = formatDate(element.bookingEnd);

  return (
    <>
      <div class="relative flex w-full max-w-[26rem] flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-lg">
        <div class="relative overflow-hidden text-white shadow-lg bg-blue-gray-500 bg-clip-border shadow-blue-gray-500/40">
          <img src={`${apiKey + element.imageUrl}`} alt="ui/ux review check" />
          <div class="absolute inset-0 w-full h-full to-bg-black-10 bg-gradient-to-tr from-transparent via-transparent to-black/60"></div>
          <button
            class="!absolute top-4 right-4 h-8 max-h-[32px] w-8 max-w-[32px] select-none rounded-full text-center align-middle font-sans text-xs font-medium uppercase text-red-500 transition-all hover:bg-red-500/10 active:bg-red-500/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
          >
            <span class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-6 h-6"
              >
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"></path>
              </svg>
            </span>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div class="">
            <div class="flex items-center justify-between mb-3">
              <h5 class="block font-sans text-xl antialiased font-medium leading-snug tracking-normal text-blue-gray-900">
                {element.title}
              </h5>
              <p class="flex items-center gap-1.5 font-sans text-base font-normal leading-relaxed text-blue-gray-900 antialiased">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="-mt-0.5 h-5 w-5 text-yellow-700"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                5.0
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex gap-2">
              <IoLocationOutline className="text-lg" />
              <h2 className="text-sm">
                {element.venue}, {element.location}
              </h2>
            </div>
            <div className="flex gap-2">
              <IoCalendarOutline />
              <h2 className="text-sm">
                {element.startDate === element.endDate
                  ? formatDate(element.startDate)
                  : `${formatDate(element.startDate)} - ${formatDate(
                      element.endDate
                    )}`}
              </h2>
            </div>
            <div className="flex gap-2">
              <IoPricetagOutline />
              <h2 className="text-sm">
                {(() => {
                  if (
                    !element.eventTicketType ||
                    element.eventTicketType.length === 0
                  ) {
                    return "No Tickets";
                  }

                  const prices = element.eventTicketType.map((t) => t.price);
                  const minPrice = Math.min(...prices);
                  const maxPrice = Math.max(...prices);

                  return minPrice === maxPrice
                    ? `${formatNepaliCurrency(minPrice)}`
                    : `${formatNepaliCurrency(
                        minPrice
                      )} - ${formatNepaliCurrency(maxPrice)}`;
                })()}
              </h2>
            </div>
          </div>

          <div className="pt-3">
            {isBookingOpen() ? (
              <Link
                to={`/event/${element.id}`}
                className="bg-blue-600 text-white py-1.5 px-9 w-full rounded-xl border border-blue-600 hover:bg-blue-700 duration-500 transition-all"
                type="button"
              >
                Buy Ticket
              </Link>
            ) : (
              <div className="space-y-2 ">
                <Link
                  to={`/event/${element.id}`}
                  className="bg-blue-600 text-white py-1.5 px-9 w-full rounded-xl border border-blue-600 hover:bg-blue-700 duration-500 transition-all"
                  type="button"
                >
                  View Details
                </Link>
                <p className="text-xs text-gray-600 mt-1">
                  {new Date() < new Date(element.bookingStart)
                    ? `Booking will start at ${formattedBookingStart}`
                    : `Booking date is already ended ${formattedBookingEnd}`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EventCard;
