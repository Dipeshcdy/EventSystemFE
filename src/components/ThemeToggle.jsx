import React, { useEffect, useState } from "react";
import { BsMoonStars } from "react-icons/bs";
import { GoSun } from "react-icons/go";
export function ToggleTheme() {
  const [isDark, setIsDark] = useState(false);

  function setDark() {
    // Add or Remove Mode to HTML tag 
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
    localStorage.setItem("theme", "dark");
    setIsDark(true);
  }

  function setLight() {
    // Add or Remove Mode to HTML tag 
    document.documentElement.classList.add("light");
    document.documentElement.classList.remove("dark");
    localStorage.removeItem("theme");
    setIsDark(false);
  }

  function toggleMode() {
    if (isDark) {
      setLight();
    } else {
      setDark();
    }
  }

  // When the page is loaded or refreshed, check for theme preference
  useEffect(() => {
    if (localStorage.getItem("theme") == "dark") {
      setDark();
    } else {
      setLight();
    }
  }, []);

  return (
    <div>
        <button onClick={toggleMode} className="hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded-full transition-all duration-300 ease-linear border-none outline-none">
            {isDark?<>
                <GoSun className="dark:!text-white text-xl" />
            </>:<>
                <BsMoonStars className="dark:!text-white text-md" />
            </>}
        </button>
    </div>
  );
}