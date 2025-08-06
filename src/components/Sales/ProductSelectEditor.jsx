import React, { useState, useImperativeHandle, forwardRef, useEffect, useRef } from 'react';
import axiosInstance from '../../services/axios'; // Adjust path accordingly

const ProductSelectEditor = forwardRef((props, ref) => {
  const [searchTerm, setSearchTerm] = useState(props.value || '');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    getValue: () => selectedProduct || searchTerm,
    afterGuiAttached: () => inputRef.current?.focus()
  }));

  useEffect(() => {
    if (searchTerm.trim()) {
      const timeout = setTimeout(() => {
        axiosInstance.get(`/api/product?search=${searchTerm}`)
          .then(res => {
            if (res.status === 200) setProducts(res.data.data.items);
          });
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [searchTerm]);

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        className="border px-2 py-1 w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onBlur={() => setTimeout(() => setProducts([]), 200)}
      />
      {products.length > 0 && (
        <ul className="absolute z-50 bg-white border w-full max-h-40 overflow-auto text-sm">
          {products.map((product, idx) => (
            <li
              key={idx}
              onMouseDown={() => {
                setSelectedProduct(product);
                setSearchTerm(product.productName);
              }}
              className="p-2 hover:bg-blue-100 cursor-pointer"
            >
              {product.productName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export default ProductSelectEditor;
