import { useState, useEffect } from "react";
import ModalLayout from "../ModalLayout";
import TextBox from "../../TextBox";
import toast from "react-hot-toast";
import axiosInstance from "../../../services/axios";

const ProductFormModal = ({
  open,
  onClose,
  product = null,
  isEditMode = false,
  fetchProducts,
  categories = [],
  productApiErrors = {},
  onSave = null,
}) => {
  const apiKey = import.meta.env["VITE_APP_BASE_URL"];

  const initialProductState = {
    productCode: "",
    productName: "",
    unitMeasure1: "",
    unitMeasure2: "",
    price: 0,
    cost: 0,
    categoryId: "",
    brandName: "",
    exciseDutyPercent: "",
    barcode: "",
    hsnCode: "",
    availableQtyUnit1: 0,
    availableQtyUnit2: 0,
    minStockUnit1: 0,
    minStockUnit2: 0,
    discountAmount: 0,
    discountPercent: 0,
    vatPercent: 0,
    unitConversionRate: 0,
  };
  const [newProduct, setNewProduct] = useState(initialProductState);
  const [productFormErrors, setProductFormErrors] = useState({});

  useEffect(() => {
    if (open) {
      setNewProduct(product || initialProductState);
      setProductFormErrors({});
    }
  }, [open, product]);

  const validateField = (fieldName, value) => {
    let message = "";
    const trimmed = value?.toString().trim();

    switch (fieldName) {
      case "productCode":
        if (!trimmed) message = "Product Code is required";
        break;
      case "productName":
        if (!trimmed) message = "Product Name is required";
        break;
      case "unitMeasure1":
        if (!trimmed) message = "Unit Measure 1 is required";
        break;
      case "availableQtyUnit1":
        if (!trimmed || isNaN(value) || Number(value) <= 0)
          message = "Available Qty 1 must be more than 0";
        break;
      case "price":
        if (!trimmed || isNaN(value) || Number(value) <= 0)
          message = "Price must be a positive number";
        break;
      default:
        break;
    }

    setProductFormErrors((prev) => ({
      ...prev,
      [fieldName]: message,
    }));

    return message === "";
  };

  const validateForm = () => {
    const requiredFields = [
      "productCode",
      "productName",
      "unitMeasure1",
      "availableQtyUnit1",
      "price",
    ];

    let valid = true;
    requiredFields.forEach((field) => {
      if (!validateField(field, newProduct[field])) valid = false;
    });
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = {
      ...(isEditMode && { id: product?.id }),
      ...newProduct,
      price: Number(newProduct.price),
      cost: Number(newProduct.cost),
      exciseDutyPercent: Number(newProduct.exciseDutyPercent),
      availableQtyUnit1: Number(newProduct.availableQtyUnit1),
      availableQtyUnit2: Number(newProduct.availableQtyUnit2),
      minStockUnit1: Number(newProduct.minStockUnit1),
      minStockUnit2: Number(newProduct.minStockUnit2),
      discountAmount: Number(newProduct.discountAmount),
      discountPercent: Number(newProduct.discountPercent),
      vatPercent: Number(newProduct.vatPercent),
      unitConversionRate: Number(newProduct.unitConversionRate),
    };

    try {
      if (typeof onSave === "function") {
        await onSave(payload); // ✅ use parent handler
      } else {
        const url = `${apiKey}api/Product`;
        await axiosInstance[isEditMode ? "put" : "post"](url, payload);
        toast.success(
          `Product ${isEditMode ? "updated" : "added"} successfully!`
        );
        fetchProducts?.(); // optional
      }
      onClose(); // close either way
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <ModalLayout
      open={open}
      onClose={onClose}
      submit={handleSubmit}
      className="sm:!max-w-[60%]"
    >
      <div className="p-5">
        <h2 className="text-sm inline-block border-b-2 border-gray-400">
          {isEditMode ? "Edit Product" : "Add Product"}
        </h2>
        <div className="grid md:grid-cols-2 gap-5 mt-5 flex-grow">
          <TextBox
            label="Product Code"
            value={newProduct.productCode}
            onchange={(e) =>
              setNewProduct({ ...newProduct, productCode: e.target.value })
            }
            onBlur={(e) => validateField("productCode", e.target.value)}
            error={
              productFormErrors.productCode || productApiErrors.ProductCode
            }
          />
          <TextBox
            label="Product Name"
            value={newProduct.productName}
            onchange={(e) =>
              setNewProduct({ ...newProduct, productName: e.target.value })
            }
            onBlur={(e) => validateField("productName", e.target.value)}
            error={
              productFormErrors.productName || productApiErrors.ProductName
            }
          />
          <TextBox
            label="Unit Measure 1"
            value={newProduct.unitMeasure1}
            onchange={(e) =>
              setNewProduct({ ...newProduct, unitMeasure1: e.target.value })
            }
            onBlur={(e) => validateField("unitMeasure1", e.target.value)}
            error={
              productFormErrors.unitMeasure1 || productApiErrors.UnitMeasure1
            }
          />
          <TextBox
            label="Unit Measure 2"
            value={newProduct.unitMeasure2}
            onchange={(e) =>
              setNewProduct({ ...newProduct, unitMeasure2: e.target.value })
            }
          />
          <TextBox
            label="Price"
            type="number"
            value={newProduct.price}
            onchange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            onBlur={(e) => validateField("price", e.target.value)}
            error={productFormErrors.price || productApiErrors.Price}
          />
          <TextBox
            label="Cost"
            type="number"
            value={newProduct.cost}
            onchange={(e) =>
              setNewProduct({ ...newProduct, cost: e.target.value })
            }
          />
          <TextBox
            label="Category"
            as="select"
            value={newProduct.categoryId}
            options={categories} // array of { id, name }
            getOptionValue={(option) => option.id}
            getOptionLabel={(option) => option.name}
            onchange={(e) => {
              const value = e.target.value;
              const selectedCategory = categories.find((c) => c.id === value);
              setNewProduct((prev) => ({
                ...prev,
                categoryId: value,
                categoryCode: selectedCategory?.code || "", // ✅ sync categoryCode too
              }));
            }}
            error={
              productFormErrors.categoryId ||
              productApiErrors.CategoryId ||
              productApiErrors.CategoryCode
            }
          />
          <TextBox
            label="Brand"
            value={newProduct.brandName}
            onchange={(e) =>
              setNewProduct({ ...newProduct, brandName: e.target.value })
            }
          />
          <TextBox
            label="Excise Duty"
            value={newProduct.exciseDutyPercent}
            onchange={(e) =>
              setNewProduct({
                ...newProduct,
                exciseDutyPercent: e.target.value,
              })
            }
          />
          <TextBox
            label="Barcode"
            value={newProduct.barcode}
            onchange={(e) =>
              setNewProduct({ ...newProduct, barcode: e.target.value })
            }
          />
          <TextBox
            label="HSC"
            value={newProduct.hsnCode}
            onchange={(e) =>
              setNewProduct({ ...newProduct, hsnCode: e.target.value })
            }
          />
          <TextBox
            label="Available Qty Unit 1"
            type="number"
            value={newProduct.availableQtyUnit1}
            onchange={(e) =>
              setNewProduct({
                ...newProduct,
                availableQtyUnit1: e.target.value,
              })
            }
            onBlur={(e) => validateField("availableQtyUnit1", e.target.value)}
            error={
              productFormErrors.availableQtyUnit1 ||
              productApiErrors.AvailableQtyUnit1
            }
          />
          <TextBox
            label="Available Qty Unit 2"
            type="number"
            value={newProduct.availableQtyUnit2}
            onchange={(e) =>
              setNewProduct({
                ...newProduct,
                availableQtyUnit2: e.target.value,
              })
            }
          />
          <TextBox
            label="Min Stock 1"
            type="number"
            value={newProduct.minStockUnit1}
            onchange={(e) =>
              setNewProduct({ ...newProduct, minStockUnit1: e.target.value })
            }
          />
          <TextBox
            label="Min Stock 2"
            type="number"
            value={newProduct.minStockUnit2}
            onchange={(e) =>
              setNewProduct({ ...newProduct, minStockUnit2: e.target.value })
            }
          />
          <TextBox
            label="Discount Amount"
            type="number"
            value={newProduct.discountAmount}
            onchange={(e) =>
              setNewProduct({ ...newProduct, discountAmount: e.target.value })
            }
          />
          <TextBox
            label="Discount Percent"
            type="number"
            value={newProduct.discountPercent}
            onchange={(e) =>
              setNewProduct({ ...newProduct, discountPercent: e.target.value })
            }
          />
          <TextBox
            label="Vat Percent"
            type="number"
            value={newProduct.vatPercent}
            onchange={(e) =>
              setNewProduct({ ...newProduct, vatPercent: e.target.value })
            }
          />
          <TextBox
            label="Unit Conversion Ratio"
            type="number"
            value={newProduct.unitConversionRate}
            onchange={(e) =>
              setNewProduct({
                ...newProduct,
                unitConversionRate: e.target.value,
              })
            }
          />
        </div>
      </div>
    </ModalLayout>
  );
};

export default ProductFormModal;
