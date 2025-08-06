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
