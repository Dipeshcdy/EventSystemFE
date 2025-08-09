import React, { useState } from "react";
import formatNepaliCurrency from "../../../utils/utils";
import toast from "react-hot-toast";
import axiosInstance from "../../../services/axios";

const TicketSelector = ({ event }) => {
  const apiKey = import.meta.env["VITE_APP_BASE_URL"];
  // Track which tickets have been "added" & their quantities
  const [quantities, setQuantities] = useState(
    event.eventTicketType?.map(() => 0) || []
  );

  const handleAddClick = (index) => {
    setQuantities(
      (prev) => prev.map((qty, i) => (i === index ? 1 : qty)) // default quantity = 1
    );
  };

  const updateQuantity = (index, newValue) => {
    if (newValue >= 0) {
      setQuantities((prev) =>
        prev.map((qty, i) => (i === index ? newValue : qty))
      );
    }
  };

  const handleBuyTickets = async () => {
    const selectedTickets = event.eventTicketType
      .map((ticketType, idx) => ({
        TicketTypeId: ticketType.id,
        Quantity: quantities[idx],
      }))
      .filter((ticket) => ticket.Quantity > 0);
    if (!selectedTickets.length) {
      toast.error("Please add at least one ticket.");
      return;
    }

    const payload = {
      EventId: event.id,
      Tickets: selectedTickets,
    };

    try {
      const response = await axiosInstance.post(
        `${apiKey}api/ticket/ProcessPayment`,
        payload
      );
      if (response.status === 200) {
        const data = response.data.data;
        toast.success(response.data.message);
        if (data.pidx) {
          khaltiCall(data);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load event");
    }
  };

  const khaltiCall = (data) => {
    window.location.href = data.payment_url;
  };

  return (
    event.eventTicketType?.length > 0 && (
      <div className="rounded-xl shadow border border-gray-200 p-4">
        <h2 className="font-semibold">Select Ticket Types</h2>
        <div className="my-4 space-y-4">
          {event.eventTicketType.map((element, index) => (
            <div
              key={element.id || index}
              className="bg-gray-200 rounded-xl p-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-medium text-lg tracking-wider">
                    {element.name}
                  </h2>
                  <h2>{formatNepaliCurrency(element.price)}</h2>
                </div>

                {/* Show Add button or Counter */}
                {quantities[index] === 0 ? (
                  <button
                    type="button"
                    onClick={() => handleAddClick(index)}
                    className="bg-white border border-blue-500 hover:bg-blue-500 hover:text-white px-4 py-2 rounded-md duration-300 ease-linear"
                  >
                    Add
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(index, quantities[index] - 1)
                      }
                      className="bg-white border border-gray-300 hover:bg-gray-200 px-2 py-1 rounded-md"
                    >
                      -
                    </button>
                    <input
                      type="text"
                      value={quantities[index]}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (!isNaN(val) && val >= 0) updateQuantity(index, val);
                      }}
                      className="w-10 text-center border border-gray-300 rounded"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(index, quantities[index] + 1)
                      }
                      className="bg-white border border-gray-300 hover:bg-gray-200 px-2 py-1 rounded-md"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleBuyTickets}
          className="bg-blue-600 text-white py-1.5 px-9 w-full rounded-xl border border-green-600 hover:bg-green-700 duration-500 transition-all"
        >
          Buy Ticket
        </button>
      </div>
    )
  );
};

export default TicketSelector;
