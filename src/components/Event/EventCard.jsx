import React from "react";
import { IoLocationOutline, IoPricetagOutline } from "react-icons/io5";
import { IoCalendarOutline } from "react-icons/io5";
import formatNepaliCurrency, { isBookingOpen } from "../../utils/utils";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/dateFormatter";
import { MdLocationOn } from "react-icons/md";

const EventCard = ({ element }) => {
  const apiKey = import.meta.env["VITE_APP_BASE_URL"];
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
          </button>
        </div>
        <div className="p-6 space-y-4">
          {element.distanceKm && (
            <div className="flex gap-2 items-center">
              <MdLocationOn className="text-xl" />
              <h2 className="text-red-600">
                {element.distanceKm.toFixed(2)} KM far away
              </h2>
            </div>
          )}
          <div class="">
            <div class="flex items-center justify-between mb-3">
              <h5 class="block font-sans text-xl antialiased font-medium leading-snug tracking-normal text-blue-gray-900">
                {element.title}
              </h5>

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
            {isBookingOpen(element.bookingStart, element.bookingEnd) ? (
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
                <p className="text-xs text-red-600 mt-1">
                  {new Date() < new Date(element.bookingStart)
                    ? `* Booking will start at ${formattedBookingStart}`
                    : `* Booking date is already ended ${formattedBookingEnd}`}
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
