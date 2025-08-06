import { forwardRef } from "react";
const TextBox = forwardRef(
  (
    {
      value,
      label,
      onchange,
      id,
      type = "text",
      readonly,
      onclick,
      error = "",
      options = [],
      as = "input", // <== NEW
      ...rest
    },
    ref
  ) => {
    const isSelect = as === "select";

    return (
      <div>
        <div className="relative">
          {isSelect ? (
            <select
              ref={ref}
              id={id ?? label}
              value={value ?? ""}
              onChange={onchange}
              className={`block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 appearance-none focus:outline-none focus:ring-0 peer dark:text-white dark:bg-black
              ${error ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-primary-light"}
              `}
              {...rest}
            >
              <option value="">Select a category</option>
              {options.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              ref={ref}
              type={type}
              id={id ?? label}
              className={`block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 appearance-none focus:outline-none focus:ring-0 peer dark:text-white
              ${error ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-primary-light"}
            `}
              placeholder=" "
              value={value}
              onChange={onchange}
              readOnly={readonly}
              onClick={onclick}
              {...rest}
            />
          )}

          <label
            htmlFor={id ?? label}
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-[1] origin-[0] bg-white dark:bg-black dark:text-white dark:peer-focus:text-blue-100 dark:peer-focus:outline-blue-200 px-2 peer-focus:px-2 peer-focus:text-primary-light peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 dark:bg-black dark:text-white"
          >
            {label}
          </label>
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

export default TextBox;
