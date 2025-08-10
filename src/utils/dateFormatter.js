// src/utils/dateFormatter.js

export function formatDateToLocal(dateString, options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      ...defaultOptions,
      ...options,
    });
  } catch (error) {
    console.warn('Invalid date:', dateString);
    return '';
  }
}



export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function extractDayMonth(date) {
  return new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
  });
}

export function extractYear(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
  });
}

export const formatTime = (time) => {
  return new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  
};

export const formatTimeWithDateTime = (dateTime) => {
  const date = new Date(dateTime);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true // AM/PM format
  });
};
