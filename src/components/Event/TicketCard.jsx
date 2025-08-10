import React from "react";
import formatNepaliCurrency from "../../utils/utils";
import ticketbg from "../../images/ticketbg.jpg";
import {
  extractDayMonth,
  extractYear,
  formatDate,
  formatTime,
} from "../../utils/dateFormatter";
import {
  IoCalendarOutline,
  IoCloseCircleOutline,
  IoLocationOutline,
  IoPricetagsOutline,
  IoTimeOutline,
} from "react-icons/io5";

const ticketBgUrl =
  "https://media.pitchfork.com/photos/60db53e71dfc7ddc9f5086f9/1:1/w_1656,h_1656,c_limit/Olivia-Rodrigo-Sour-Prom.jpg";

const barcodeUrl =
  "https://external-preview.redd.it/cg8k976AV52mDvDb5jDVJABPrSZ3tpi1aXhPjgcDTbw.png?auto=webp&s=1c205ba303c1fa0370b813ea83b9e1bddb7215eb";

const TicketCard = ({ ticket, checked, onCheck,isForPrint=false }) => {
  const apiKey = import.meta.env["VITE_APP_BASE_URL"];

  return (
    <>
      <div className="grid grid-cols-5">
        {!isForPrint && (
            <div className="flex items-center justify-center">
            <input
                type="checkbox"
                className="mb-2 w-4 h-4"
                checked={checked}
                onChange={() => onCheck(ticket.id)}
            />
            </div>
        )}
        <div class={` ${isForPrint?"col-span-5":"col-span-3"}`}>
          <div class="grid grid-cols-6">
            <div
              class="col-span-2 relative"
              // style={{
              //   backgroundImage: `url(${apiKey + ticket.imageUrl})`,
              //   backgroundSize: "cover",
              //   backgroundPosition: "center",
              // }}
            >
              <div className="absolute top-0 left-0 w-full h-full">
                <img
                  src={apiKey + ticket.imageUrl}
                  className="w-full h-full object-top object-cover"
                  alt=""
                />
              </div>
            </div>
            <div class="ticket-info col-span-3">
              <p class="date w-full">
                <span className="uppercase">{ticket.ticketTypeName}</span>
                <span class="june-29 ">
                  {ticket.startDate === ticket.endDate
                    ? extractDayMonth(ticket.startDate)
                    : `${extractDayMonth(ticket.startDate)} - ${extractDayMonth(
                        ticket.endDate
                      )}`}
                </span>
                <span>{extractYear(ticket.startDate)}</span>
              </p>
              <div class="show-name">
                <h2 className="font-medium">{ticket.eventTitle}</h2>
                <h1>{ticket.organizerName}</h1>
              </div>
              {/* <div class="time">
                            <p>8:00 PM <span>TO</span> 11:00 PM</p>
                            <p>DOORS <span>@</span> 7:00 PM</p>
                        </div> */}

              <div className="space-y-2 my-3">
                {/* <div className="flex gap-2">
                                <IoLocationOutline className="text-lg" />
                                <h2 className="text-sm">
                                    {ticket.venue}, {ticket.location}
                                </h2>
                            </div> */}
                <div className="flex gap-2">
                  <IoCalendarOutline />
                  <h2 className="text-sm">
                    {ticket.startDate === ticket.endDate
                      ? formatDate(ticket.startDate)
                      : `${formatDate(ticket.startDate)} - ${formatDate(
                          ticket.endDate
                        )}`}
                  </h2>
                </div>

                <div className="flex gap-2">
                  <IoTimeOutline />
                  <h2 className="text-sm">
                    {ticket.startTime === ticket.endTime
                      ? formatTime(ticket.startTime)
                      : `${formatTime(ticket.startTime)} - ${formatTime(
                          ticket.endTime
                        )}`}
                  </h2>
                </div>
                {/* Entry Close Time */}
                <div className="flex gap-2">
                  <IoCloseCircleOutline />
                  <h2 className="text-sm">
                    Entry Closes at: {formatTime(ticket.entryCloseTime)}
                  </h2>
                </div>

                {/* Category */}
                <div className="flex gap-2">
                  <IoPricetagsOutline />
                  <h2 className="text-sm">Category: {ticket.eventCategory}</h2>
                </div>
              </div>
              <p class="location">
                <span>{ticket.venue}</span>
                <span class="separator">
                  <i class="far fa-smile"></i>
                </span>
                <span>{ticket.location}</span>
              </p>
            </div>
            <div class="flex flex-col py-8 items-center">
              <div className="flex flex-grow items-center justify-center">
                <div class="barcode">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                      JSON.stringify({
                        ticketId: ticket.id,
                        eventId: ticket.eventId,
                        eventTicketTypeId: ticket.eventTicketTypeId,
                        sequence: ticket.sequence,
                      })
                    )}`}
                    alt="QR Code"
                  />
                </div>
              </div>
              <p class="ticket-number">#{ticket.sequence}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketCard;
