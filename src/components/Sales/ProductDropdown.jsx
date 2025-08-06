import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import TextBox from '../TextBox';
import { CiSearch } from "react-icons/ci";
import axiosInstance from '../../services/axios';
import toast from 'react-hot-toast';

const ProductDropdown = forwardRef(({ products, setProducts, searchProduct, selectedProductIndex, setSelectedProductIndex, selectProduct, showSuggestions }, ref) => {
    const apiKey = import.meta.env["VITE_APP_BASE_URL"];
    const rowRefs = useRef([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef(null);
    useEffect(() => {
        if (searchProduct?.trim() === "") {
            setProducts([]);
            return;
        }

        const delayDebounce = setTimeout(() => {
            const run = async () => {
                await fetchProducts();                // ✅ wait for API to return
                setSelectedProductIndex(0);         // ✅ reset index after data is ready
            };
            run();
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchProduct]);

    useEffect(() => {
        if (products?.length > 0) {
            rowRefs.current = products.map((_, i) => rowRefs.current[i] || React.createRef());
        }
    }, [products]);

    useEffect(() => {
        if (rowRefs.current[selectedProductIndex]?.current && products.length > 0) {
            rowRefs.current[selectedProductIndex].current.scrollIntoView({
                behavior: "auto",
                block: "nearest",
            });
        }
    }, [selectedProductIndex]);

    const constructUrl = (page = 1, size = 10) => {
        const url = `${apiKey}api/menu`;
        const params = new URLSearchParams();
        if (searchProduct) params.append("search", searchProduct);
        params.append("pageNumber", page);
        params.append("pageSize", size);
        return `${url}?${params.toString()}`;
    };


    const fetchProducts = async (page = 1, append = false) => {
        setIsLoading(true);
        const url = constructUrl(page);
        try {
            const response = await axiosInstance.get(url);
            if (response.status == 200) {
                const { items, totalPages } = response.data.data;
                console.log(response.data.data);
                setProducts(prev => (append ? [...prev, ...items] : items));
                console.log(products);
                setHasMore(page < totalPages); // ✅ check if more pages remain
                setPageNumber(page);           // ✅ keep current page state
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
    const handleScroll = () => {
        if (!hasMore || isLoading || !dropdownRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = dropdownRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 5) {
            fetchProducts(pageNumber + 1, true); // fetch next chunk
        }
    };

    const handleInputKeyDown = async (e) => {
        if (e.key === "ArrowUp" && selectedProductIndex > 0) {
            e.preventDefault();
            setSelectedProductIndex(prev => prev - 1);
        }
        else if (e.key == "ArrowDown" && selectedProductIndex < products.length - 1) {
            e.preventDefault();
            const nextIndex = selectedProductIndex + 1;
            if (nextIndex < products.length) {
                setSelectedProductIndex(nextIndex);
            } else if (hasMore && !isLoading) {
                console.log("chalyo");
                await fetchProducts(pageNumber + 1, true);
                setSelectedProductIndex(products.length); // point to first new item
            }
        }
    }

    useImperativeHandle(ref, () => ({
        handleInputKeyDown
    }));


    return (
        <>
            <div className={` `}>
                {products && products.length > 0 && showSuggestions && (
                    <div
                        ref={dropdownRef}
                        onScroll={handleScroll}
                        className="absolute top-[102%] z-[999] bg-white border border-gray-200 client-contact-card rounded-md overflow-auto custom-scroll  max-h-96 left-0 min-w-60 w-max dark:bg-black dark:text-white">
                        <table className='w-full'>
                            <thead>
                                <tr className="text-xs text-left">
                                    <th className="pl-4 pr-6 py-2 ">Name</th>
                                    <th className="pl-6 pr-4 py-2">Price</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {products.map((element, index) => (
                                    <tr key={index}
                                        ref={rowRefs.current[index]}
                                        onClick={() => {
                                                selectProduct(element,true);
                                        }}
                                        className={`px-6 py-2 outline outline-1 outline-gray-200 hover:bg-blue-100 cursor-pointer  dark:bg-black dark:text-white dark:hover:bg-blue-600 ${selectedProductIndex == index && "bg-blue-100"}`}>
                                        <td className="pl-4 pr-6 py-2" >
                                            {element.itemName}
                                        </td>
                                        <td className="pl-6 pr-4 py-2">
                                            {element.itemPrice}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div></>
    )
})

export default ProductDropdown 