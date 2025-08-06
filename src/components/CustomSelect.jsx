import { Listbox } from '@headlessui/react';
import { useState, Fragment } from 'react';

const CustomSelect = ({
  value,
  setValue,
  options = [],
  label = "Select",
  disabled = false,
  autoFocus = false,
}) => {
  const [hasFocus, setHasFocus] = useState(false);

  return (
    <div className="relative w-full">
      <Listbox value={value} onChange={setValue} disabled={disabled}>
        {() => (
          <>
            {/* Styled Button to mimic native input */}
            <Listbox.Button
              onFocus={() => setHasFocus(true)}
              onBlur={() => setHasFocus(false)}
              autoFocus={autoFocus}
              className={`peer w-full text-sm text-black px-3 pt-5 pb-1.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-blue-500`}
            >
              {value || ""}
            </Listbox.Button>

            {/* Floating Label exactly like native input */}
            <label
              className={`absolute left-3 px-1 text-sm text-gray-500 bg-white transition-all duration-200 ease-in-out z-[1]
                ${hasFocus || value
                  ? 'top-1 scale-75'
                  : 'top-1/2 -translate-y-1/2 scale-100'}`}
            >
              {label}
            </label>

            {/* Dropdown menu */}
            <Listbox.Options className="absolute mt-1 w-full max-h-60 overflow-auto rounded-xl border border-gray-300 bg-white text-sm shadow-md z-50">
              {options.map((option, idx) => (
                <Listbox.Option
                  key={idx}
                  value={option}
                  className={({ active, selected }) =>
                    `cursor-pointer px-4 py-2 ${
                      active ? 'bg-blue-100' : ''
                    } ${selected ? 'font-semibold text-blue-700' : 'text-gray-800'}`
                  }
                >
                  {option}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </>
        )}
      </Listbox>
    </div>
  );
};

export default CustomSelect;
