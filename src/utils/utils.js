export default function formatNepaliCurrency(amount) {
  // Convert to number with 2 decimal places
  let num = parseFloat(amount).toFixed(2);
  // Split into integer and decimal parts
  let [integer, decimal] = num.split(".");

  // Nepali comma format: split from right: 3,2,2,...
  let lastThree = integer.slice(-3);
  let otherNumbers = integer.slice(0, -3);
  if (otherNumbers !== "") {
    lastThree = "," + lastThree;
  }
  let formattedOtherNumbers = otherNumbers.replace(
    /\B(?=(\d{2})+(?!\d))/g,
    ","
  );

  // Combine formatted parts
  let formattedAmount = formattedOtherNumbers + lastThree + "." + decimal;

  return "रु " + formattedAmount;
}

export const isBookingOpen = (start, end) => {
  const now = new Date();
  const bookingStart = new Date(start);
  const bookingEnd = new Date(end);
  return now >= bookingStart && now <= bookingEnd;
};

// Event has ended
export const isPastEvent = (end) => {
  const now = new Date();
  const eventEnd = new Date(end);
  return now > eventEnd;
};

// Event is ongoing (started but not yet ended)
export const isOngoingEvent = (start, end) => {
  const now = new Date();
  const eventStart = new Date(start);
  const eventEnd = new Date(end);
  return now >= eventStart && now <= eventEnd;
};