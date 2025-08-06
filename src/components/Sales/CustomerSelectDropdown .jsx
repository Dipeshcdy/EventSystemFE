import React, { useEffect, useRef, useState } from "react";
import TextBox from "../TextBox";
import { CiSearch } from "react-icons/ci";
import axiosInstance from "../../services/axios";
import toast from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";

const CustomerSelectDropdown = ({
  selectedCustomer,
  setSelectedCustomer,
  isView = false,
  setOpenCustomerAddModal = null,
  columns = null,
}) => {
  const [searchCustomer, setSearchCustomer] = useState("");
  const [customers, setCustomers] = useState([]); // Initial loaded customers
  const apiKey = import.meta.env["VITE_APP_BASE_URL"];
  const [selectedCustomerIndex, setSelectedCustomerIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const rowRefs = useRef([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);
  const selectedCustomerRef = useRef(null);
  const defaultColumns = [
    { label: "Name", key: "clientName" },
    { label: "Vat", key: "vatNumber" },
    { label: "Phone", key: "phoneNumber" },
  ];

  const finalColumns = columns ?? defaultColumns;

  useEffect(() => {
    if (selectedCustomer != null) {
      setSearchCustomer(selectedCustomer.clientName);
      selectedCustomerRef.current = selectedCustomer;
    }
  }, [selectedCustomer]);

  useEffect(() => {
    if (searchCustomer?.trim() === "") {
      setCustomers([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      const run = async () => {
        await fetchClients(); // ✅ wait for API to return
        setSelectedCustomerIndex(0); // ✅ reset index after data is ready
      };
      run();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchCustomer]);
  useEffect(() => {
    if (customers.length > 0) {
      rowRefs.current = customers.map(
        (_, i) => rowRefs.current[i] || React.createRef()
      );
    }
  }, [customers]);

  useEffect(() => {
    if (
      rowRefs.current[selectedCustomerIndex]?.current &&
      customers.length > 0
    ) {
      rowRefs.current[selectedCustomerIndex].current.scrollIntoView({
        behavior: "auto",
        block: "nearest",
      });
    }
  }, [selectedCustomerIndex]);

  const constructUrl = (page = 1, size = 10) => {
    const url = `${apiKey}api/client`;
    const params = new URLSearchParams();
    if (searchCustomer) params.append("search", searchCustomer);
    params.append("pageNumber", page);
    params.append("pageSize", size);
    return `${url}?${params.toString()}`;
  };

  const fetchClients = async (page = 1, append = false) => {
    setIsLoading(true);
    const url = constructUrl(page);
    try {
      const response = await axiosInstance.get(url);
      if (response.status == 200) {
        const { items, totalPages } = response.data.data;
        setCustomers((prev) => (append ? [...prev, ...items] : items));
        setHasMore(page < totalPages); // ✅ check if more pages remain
        setPageNumber(page); // ✅ keep current page state
      }
    } catch (error) {
      if (error.response) {
        var errorMessage = error.response.data.message;
        toast.error(errorMessage);
      } else if (error.message) {
        toast.error("Error", error.message);
      } else {
        toast.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = async (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
      e.preventDefault(); // Prevent select all
      if (typeof setOpenCustomerAddModal === "function") {
        setOpenCustomerAddModal(true);
      }
      return;
    }
    if (e.key === "ArrowUp" && selectedCustomerIndex > 0) {
      e.preventDefault();
      setSelectedCustomerIndex((prev) => prev - 1);
    } else if (
      e.key == "ArrowDown" &&
      selectedCustomerIndex < customers.length - 1
    ) {
      e.preventDefault();
      const nextIndex = selectedCustomerIndex + 1;

      if (nextIndex < customers.length) {
        setSelectedCustomerIndex(nextIndex);
      } else if (hasMore && !isLoading) {
        await fetchClients(pageNumber + 1, true);
        setSelectedCustomerIndex(customers.length); // point to first new item
      }
    } else if (e.key == "Enter") {
      if (customers.length > 0) {
        e.preventDefault();
        e.stopPropagation();
        const customer = customers[selectedCustomerIndex];
        selectedCustomerRef.current = customer; // ✅ sync immediately
        setSelectedCustomer(customer);
        setTimeout(() => {
          setSearchCustomer(customer.clientName);
        }, 0);
        setShowSuggestions(false);
        console.log(customer); // hide the list
      }
      const focusableSelectors =
        'input, select, textarea, button, [tabindex]:not([tabindex="-1"])';
      const allFocusable = Array.from(
        document.querySelectorAll(focusableSelectors)
      ).filter((el) => !el.disabled && el.offsetParent !== null);

      const currentIndex = allFocusable.indexOf(e.target);
      if (currentIndex !== -1 && currentIndex + 1 < allFocusable.length) {
        allFocusable[currentIndex + 1].focus();
      }
    }
  };

  const handleBlur = () => {
    setShowSuggestions(false);
    setTimeout(() => {
      const customer = selectedCustomerRef.current;
      setSearchCustomer((prev) => {
        if (customer?.clientName) {
          return customer.clientName;
        } else {
          return "";
        }
      });
    }, 100);
  };

  const handleScroll = () => {
    if (!hasMore || isLoading || !dropdownRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = dropdownRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      fetchClients(pageNumber + 1, true); // fetch next chunk
    }
  };

  return (
    <>
      <div className={`relative ${isView && "pointer-events-none"} `}>
        <TextBox
          value={searchCustomer}
          label="Customer"
          id="Customer"
          type="text"
          onchange={(e) => {
            setSearchCustomer(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          name="customer-search"
          autoComplete="off"
        />
        {selectedCustomer ? (
          <span
            onClick={() => {
              setSelectedCustomer(null);
              selectedCustomerRef.current = null;
              setSearchCustomer("");
              setCustomers([]);
              setShowSuggestions(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer text-xl"
            title="Clear selection"
          >
            <RxCross2 />
          </span>
        ) : (
          <CiSearch
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl dark:text-white"
          />
        )}

        {customers.length > 0 && showSuggestions && (
          <div
            ref={dropdownRef}
            onScroll={handleScroll}
            className="absolute top-[120%] z-50 bg-white border border-gray-200 client-contact-card rounded-md overflow-auto custom-scroll max-h-96 left-0 w-max dark:bg-black dark:text-white"
          >
            <table>
              <thead>
                <tr className="text-xs text-left whitespace-nowrap">
                  {finalColumns.map((col, idx) => (
                    <th key={idx} className="px-4 py-2">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm">
                {customers.map((element, index) => (
                  <tr
                    key={index}
                    ref={rowRefs.current[index]}
                    onMouseDown={() => {
                      selectedCustomerRef.current = element;
                      setSelectedCustomer(element);
                      setSearchCustomer(element.clientName);
                      setShowSuggestions(false);
                    }}
                    className={`hover:bg-blue-400 hover:text-white cursor-pointer ${
                      selectedCustomerIndex === index ? "bg-blue-600 text-white" : ""
                    }`}
                  >
                    {finalColumns.map((col, colIdx) => (
                      <td key={colIdx} className="px-4 py-2 whitespace-nowrap">
                        {element[col.key] ?? "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default CustomerSelectDropdown;
