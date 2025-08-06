import React from "react";
import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../services/axios";
import { useAuth } from "../../context/AuthContext";
import { CiSearch, CiEdit } from "react-icons/ci";
import { Card, Typography } from "@material-tailwind/react";
import ModalLayout from "../../components/modal/ModalLayout";
import TextBox from "../../components/TextBox";
import { MdDeleteOutline } from "react-icons/md";
import toast from "react-hot-toast";
import Pagination from "../../components/Pagination";
import { FaSquarePlus } from "react-icons/fa6";
import ProductFormModal from "../../components/modal/Inventory/ProductFormModal";
import PermissionWrapper from "../../components/PermissionWrapper";

const Event = () => {
  const { setActivePage, setActiveSubMenu, loading, setLoading , permissions} = useAuth();
  setActivePage("inventory");
  setActiveSubMenu("inventory-index");
  const apiKey = import.meta.env["VITE_APP_BASE_URL"];
  const [pageLoading, setPageLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 5,
    totalPages: null,
    totalRecords: null,
  });
  const isFirstRender = useRef(true);

  const [category, setCategory] = useState("");
  const hasWriteAccess = Array.isArray(permissions) && permissions.some(perm => {
    return perm.service === "Inv" && 
      perm.module === "INV.PRD" &&
      perm.role && !["read"].includes(perm.role.toLowerCase());
  });

  const TABLE_HEAD = [
    { head: "SN" },
    { head: "Code" },
    { head: "Name" },
    { head: "Unit 1" },
    { head: "Unit 2" },
    { head: "Price" },
    { head: "Cost" },
    { head: "Category" },
    { head: "Brand" },
    { head: "Vat" },
    { head: "Available Unit 1" },
    { head: "Available Unit 2" },
    ...(hasWriteAccess ? [{ head: "Actions" }] : []),
  ];
  const pageSize = 5 ;

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadData = async () => {
      try {
        setLoading(true);
        await fetchProducts();
        await fetchCategory();
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
        setPageLoading(false);
      }
    };

    loadData();
  }, []);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      const delayDebounceFn = setTimeout(() => {
        fetchProducts();
      }, 1000);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [search]);
  //products
  const [products, setProducts] = useState([]);

  const constructUrl = (currentPage, pageSize) => {
    let url = `${apiKey}api/Product`;
    const params = new URLSearchParams();
    if (search) {
      params.append("search", search);
    }
    params.append("pageNumber", currentPage);
    params.append("pageSize", pageSize);

    return `${url}?${params.toString()}`;
  };

  const fetchProducts = async (currentPage = 1, pageSize = 6) => {
    const url = constructUrl(currentPage, pageSize);
    try {
      const response = await axiosInstance.get(url);
      if (response.status == 200) {
        const data = response.data.data;
        setProducts(data.items);
        setPagination({
          currentPage: data.pageNumber,
          pageSize: data.pageSize,
          totalPages: data.totalPages,
          totalRecords: data.totalRecords,
        });
      }
    } catch (error) {
      if (error.response) {
        var errorMessage = error.response.data.message;
        toast.error(errorMessage);
      } else if (error.message) {
        console.log("Error", error.message);
        toast.error("Error", error.message);
      } else {
        toast.error(error);
        console.log("Error", error);
      }
    }
  };
  //fetch category

  const fetchCategory = async () => {
    try {
      const response = await axiosInstance.get(`${apiKey}api/Category`);
      const data = response.data.data;
      setCategory(data);
    } catch (error) {
      if (error.response) {
        var errorMessage = error.response.data.message;
        toast.error(errorMessage);
      } else if (error.message) {
        console.log("Error", error.message);
        toast.error("Error", error.message);
      } else {
        toast.error(error);
        console.log("Error", error);
      }
    }
  };
  const onPaginationChange = async (paginationData) => {
    setPagination(paginationData);
    fetchProducts(paginationData.currentPage, pageSize);
  };


  const [productModalOpen, setProductModalOpen] = useState(false);


  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);


  //handle Edit
  const handleEdit = (productId) => {
    const productToEdit = products.find((p) => p.id === productId);
    console.log(productToEdit);
    if (productToEdit) {
      setSelectedProduct(productToEdit) // pre-fill modal form
      setSelectedProductId(productId);
      setIsEditMode(true);
      setProductModalOpen(true);
    }
  };

  //handle Delete

  const handleDelete = async (productId) => {
    const productToDelete = products.find((p) => p.id === productId);

    if (productToDelete) {
      try {
        const response = await axiosInstance.delete(
          `${apiKey}api/Product/${productId}`
        );

        if (response.status === 200 || response.status === 204) {
          toast.success("Product deleted successfully!");
          // Optionally refresh the list
          fetchProducts();
        } else {
          toast.error("Failed to delete product.");
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Error deleting product");
        console.error("Delete error:", error);
      }
    }
  };
  return (
    <>
      <div className="">
        <div>
          <h2 className="text-sm inline-block border-b-2 border-gray-400">
            Inventory
          </h2>
        </div>
        <div className="mt-5 flex flex-wrap gap-5 justify-between items-center ">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative w-56">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <CiSearch className="text-gray-800 dark:text-white" />
              </div>
              <input
                type="text"
                id="simple-search"
                className="bg-white border border-gray-300 placeholder:text-xs text-xs text-gray-900 rounded-3xl  block w-full ps-10 px-2.5 py-2 outline-none dark:bg-black dark:text-white"
                placeholder="Search..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </div>
          </div>
          <PermissionWrapper
            service="INV"
            moduleCode="INV.PRD"
            allowedRoles={["admin", "maintenance", "write"]}
          >
            <div>
              <button
                onClick={() => {
                  setIsEditMode(false);
                  setSelectedProduct(null);
                  setProductModalOpen(true);
                }}
                className="bg-blue-600 text-sm text-white py-1.5 px-9 rounded-xl border border-blue-600 hover:bg-blue-700 duration-500 transition-all flex items-center gap-2"
              >
                Add new Item <FaSquarePlus className="text-xl" />
              </button>
            </div>
          </PermissionWrapper>
        </div>
      </div>
      <div className="mt-2">
        <Card className="h-full w-full border rounded-none dark:bg-black dark:text-white overflow-x-auto">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map(({ head }) => (
                  <th key={head} className="border-b border-gray-300 p-4">
                    <div className="flex items-center gap-1">
                      <Typography
                        color="blue-gray"
                        variant="small"
                        className="!font-bold"
                      >
                        {head}
                      </Typography>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((element, index) => {
                  const isLast = index === products.length - 1;
                  const classes = isLast
                    ? "p-3"
                    : "p-3 border-b border-gray-300";
                  return (
                    <tr key={index}>
                      <td className={classes}>
                        <div className="flex items-center ml-2 gap-1">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-bold"
                          >
                            {(pagination.currentPage - 1) * pagination.pageSize + index + 1}
                          </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          className="font-normal text-gray-600 dark:text-white"
                        >
                          {element.productCode}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          className="font-normal text-gray-600 dark:text-white"
                        >
                          {element.productName}
                        </Typography>
                      </td>

                      <td className={classes}>
                        <Typography
                          variant="small"
                          className="font-normal text-gray-600 dark:text-white"
                        >
                          {element.availableQtyUnit1}
                        </Typography>
                      </td>

                      <td className={classes}>
                        <Typography
                          variant="small"
                          className="font-normal text-gray-600 dark:text-white"
                        >
                          {element.availableQtyUnit2 || "--"}
                        </Typography>
                      </td>

                      <td className={classes}>
                        <Typography
                          variant="small"
                          className="font-normal text-gray-600 dark:text-white"
                        >
                          {element.price}
                        </Typography>
                      </td>

                      <td className={classes}>
                        <Typography
                          variant="small"
                          className="font-normal text-gray-600 dark:text-white"
                        >
                          {element.cost || "--"}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          className="font-normal text-gray-600 dark:text-white"
                        >
                          {element.categoryId || "--"}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          className="font-normal text-gray-600 dark:text-white"
                        >
                          {element.brandName}
                        </Typography>
                      </td>

                      <td className={classes}>
                        <Typography
                          variant="small"
                          className="font-normal text-gray-600 dark:text-white"
                        >
                          {element.vatPercent || "--"}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          className="font-normal text-gray-600 dark:text-white"
                        >
                          {element.availableQtyUnit1 || "--"}
                        </Typography>
                      </td>

                      <td className={classes}>
                        <Typography
                          variant="small"
                          className="font-normal text-gray-600 dark:text-white"
                        >
                          {element.availableQtyUnit2 || "--"}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <div className="flex items-center gap-2">
                          <PermissionWrapper
                            service="INV"
                            moduleCode="INV.PRD"
                            allowedRoles={["admin", "maintenance", "write"]}
                          >
                            <button
                              onClick={() => handleEdit(element.id)}
                              className="text-2xl cursor-pointer text-blue-600 hover:text-blue-800 dark:text-blue-200 dark:hover:text-blue-400"
                            >
                              <CiEdit />
                            </button>
                          </PermissionWrapper>

                          <PermissionWrapper
                            service="INV"
                            moduleCode="INV.PRD"
                            allowedRoles={["admin", "maintenance", "write"]}
                          >
                            <button
                              onClick={() => handleDelete(element.id)}
                              className="text-2xl cursor-pointer text-red-600 hover:text-red-800 ml-2"
                            >
                              <MdDeleteOutline />
                            </button>
                          </PermissionWrapper>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>
      <div className="mt-4">
        {products.length > 0 && (
          <Pagination
            totalRecords={pagination.totalRecords}
            currentPage={pagination.currentPage}
            pageSize={pagination.pageSize}
            totalPages={pagination.totalPages}
            onPaginationChange={onPaginationChange}
          />
        )}
      </div>

      <ProductFormModal
        open={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        product={isEditMode ? selectedProduct : null}
        isEditMode={isEditMode}
        fetchProducts={fetchProducts}
        categories={category}
      />
    </>
  );
};

export default Event;
