export const handleEnterAsTab = (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const focusableSelectors =
      'input, select, textarea, button, [tabindex]:not([tabindex="-1"])';
    const allFocusable = Array.from(document.querySelectorAll(focusableSelectors))
      .filter(el => !el.disabled && el.offsetParent !== null);

    const currentIndex = allFocusable.indexOf(e.target);
    if (currentIndex !== -1 && currentIndex + 1 < allFocusable.length) {
      allFocusable[currentIndex + 1].focus();
    }
  }
};

// utils/domUtils.js or in component
export const handleEnterAfterSelect = (e) => {
  if (e.key === 'Enter') {
    // Let the browser handle selection first
    setTimeout(() => {
      const focusableSelectors =
        'input, select, textarea, button, [tabindex]:not([tabindex="-1"])';
      const allFocusable = Array.from(document.querySelectorAll(focusableSelectors))
        .filter(el => !el.disabled && el.offsetParent !== null);

      const currentIndex = allFocusable.indexOf(e.target);
      if (currentIndex !== -1 && currentIndex + 1 < allFocusable.length) {
        allFocusable[currentIndex + 1].focus();
      }
    }, 0); // Run AFTER native Enter behavior
  }
};

