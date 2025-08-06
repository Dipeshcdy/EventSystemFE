import React, { useEffect, useRef } from "react";
import ModalLayout from "../ModalLayout";
import TextBox from "../../TextBox";

const PaymentModal = ({
  open,
  setOpen,
  organizationConfigurationsData,
  selectedPaymentMethods,
  setSelectedPaymentMethods,
  paymentDetails,
  setPaymentDetails,
  handleSubmitPayment,
  totalAmount,
}) => {
  const initialized = useRef({});

  useEffect(() => {
    setPaymentDetails((prev) => {
      const updated = { ...prev };

      // Remove deselected
      Object.keys(updated).forEach((key) => {
        if (!selectedPaymentMethods.includes(key)) {
          delete updated[key];
          delete initialized.current[key];
        }
      });

      // Initialize newly selected
      selectedPaymentMethods.forEach((method) => {
        if (!initialized.current[method]) {
          initialized.current[method] = true;
          updated[method] = {
            ...updated[method],
            amount: selectedPaymentMethods.length === 1 ? String(totalAmount) : "",
          };
        }
      });

      return updated;
    });
  }, [selectedPaymentMethods]);

  const handleCheckboxChange = (methodName) => {
    setSelectedPaymentMethods((prev) =>
      prev.includes(methodName)
        ? prev.filter((m) => m !== methodName)
        : [...prev, methodName]
    );
  };

  return (
    <ModalLayout
      open={open}
      setOpen={setOpen}
      submit={handleSubmitPayment}
      onClose={() => {
        setOpen(false);
        setSelectedPaymentMethods([]);
        setPaymentDetails({});
        initialized.current = {};
      }}
      submitLabel="Pay"
    >
      <div className="p-5">
        <h2 className="text-sm inline-block border-b-2 border-gray-400">
          Choose Payment Method
        </h2>

        {/* Checkboxes */}
        {organizationConfigurationsData?.paymentMethods?.length > 0 ? (
          <div className="flex flex-wrap gap-x-8 gap-y-4 mt-4">
            {organizationConfigurationsData.paymentMethods.map((method) => (
              <div key={method.name}>
                <label className="flex gap-2 items-center text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPaymentMethods.includes(method.name)}
                    onChange={() => handleCheckboxChange(method.name)}
                  />
                  {method.name}
                </label>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm mt-4 text-gray-500 text-center">
            No payment methods available.
          </p>
        )}

        {/* Input fields */}
        {selectedPaymentMethods.length > 0 && (
          <div className="mt-4 space-y-4">
            {selectedPaymentMethods.map((method, idx) => {
              const amountValue = paymentDetails[method]?.amount ?? "";
              const isTwo = selectedPaymentMethods.length === 2;

              return (
                <div key={method} className="border p-3 rounded">
                  <TextBox
                    label={method}
                    type="text"
                    id={`amount-${method}`}
                    inputMode="decimal"
                    pattern="[0-9]*"
                    autoComplete="off"
                    value={amountValue}
                    onchange={(e) => {
                      const value = e.target.value;

                      if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
                        const newDetails = {
                          ...paymentDetails,
                          [method]: {
                            ...paymentDetails[method],
                            amount: value,
                          },
                        };

                        // Auto-fill for 2 methods
                        if (isTwo) {
                          const other = selectedPaymentMethods.find((m) => m !== method);
                          const filledValue = parseFloat(value || 0);
                          newDetails[other] = {
                            ...newDetails[other],
                            amount: (totalAmount - filledValue).toFixed(2),
                          };
                        }

                        setPaymentDetails(newDetails);
                      }
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ModalLayout>
  );
};

export default PaymentModal;
