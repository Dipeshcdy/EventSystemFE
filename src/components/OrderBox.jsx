import { CiEdit } from "react-icons/ci";
import { FaRegEye } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
import PermissionWrapper from "./PermissionWrapper";

const OrderBox = ({
  orders = [],
  navigate,
  editOrder,
  viewOrder,
  clickCard,
  setSelectedOrder,
  setShowDeleteModal,
  setIsPayBillModalOpen,
  showEdit = true,
  showDelete = true,
  showDone = true,
  showView = true,
}) => {
  return (
    <div className="gap-5 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 xl:grid-cols-4 mt-5">
      {orders.length > 0 &&
        orders.map((item, index) => (
          <div
            // onClick={() =>
            //   navigate(
            //     `/pos/orders/${item.status == "Open" ? "" : "view/"}${item.id}`
            //   )
            // }
            onClick={(e) => {
              e.stopPropagation();
              clickCard(item);
            }}
            key={index}
            className="flex gap-2 flex-col justify-between p-2 rounded-lg transition-all duration-300 ease-linear cursor-pointer bg-gray-100 text-gray-700 border border-gray-500 dark:text-white dark:bg-black dark:border-gray-300"
          >
            <div className="">
              <div className="flex justify-between gap-3">
                <h2 className="text-sm font-semibold">{item.orderName}</h2>
                <span
                  className={`text-xs h-8 flex items-center rounded-lg capitalize border ${
                    item.status == "Open"
                      ? "bg-green-200 border-green-500 dark:bg-green-500 dark:border-green-800"
                      : "bg-yellow-200 border-yellow-500 dark:bg-yellow-500 dark:border-yellow-600"
                  } px-2 py-1 `}
                >
                  {item.status}
                </span>
              </div>
              {/* <p className="text-xs">Order Id #{item.orderId || item.id}</p> */}
              <p className="text-xs">
                Customer Name : {item.orderId || item.clientName}
              </p>
              <p className="text-xs">
                Amount: Rs. {(item.total ?? 0).toFixed(2)}
              </p>
              {/* <p className="text-xs">
                Payment:
                {item.orderPayments && item.orderPayments.length > 0 ? (
                  item.orderPayments.map((payment, index) => (
                    <span key={index}>
                      {index > 0 && ", "}
                      {payment.paymentMethod}
                    </span>
                  ))
                ) : (
                  <span>N/A</span>
                )}
              </p> */}
              <p className="text-xs">
                Payment:
                {Array.isArray(item.orderPayment) &&
                item.orderPayment.length > 0 ? (
                  item.orderPayment.map((payment, index) => {
                    let display = payment?.paymentMethod || payment?.method;
                    if (!display && payment && typeof payment === "object") {
                      const keys = Object.keys(payment);
                      if (keys.length > 0) display = payment[keys[0]];
                    }
                    return (
                      <span key={index}>
                        {index > 0 && ", "}
                        {display || "No Payment"}
                      </span>
                    );
                  })
                ) : (
                  <span>
                    {item.paymentMethod || item.method || "No Payment"}
                  </span>
                )}
              </p>
            </div>
            <div className="flex justify-between text-xs">
              <p className="">
                {" "}
                {new Date(item.createdAt + "Z").toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "long", // "September"
                  year: "numeric",
                })}
              </p>
              <span>
                {new Date(item.createdAt + "Z").toLocaleTimeString(undefined, {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </span>
            </div>
            <hr className="border-t border-dashed border-gray-700 my-1" />

            <div className="flex gap-4">
              {/* EDIT BUTTON */}
              {showEdit && item.status === "Open" && (
                <PermissionWrapper
                  service="SLS"
                  moduleCode="SLS.ORD"
                  allowedRoles={["admin", "write", "maintenance"]}
                >
                  <div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        editOrder(item.id);
                      }}
                      className="border border-blue-600 rounded-lg px-3 py-2 hover:bg-blue-600 hover:text-white transition-all duration-300 ease-linear text-blue-600  dark:text-blue-200 dark:hover:text-blue-400"
                    >
                      <CiEdit className="text-xl cursor-pointer" />
                    </button>
                  </div>
                </PermissionWrapper>
              )}

              {/* VIEW BUTTON (shown to all roles) */}
              {showView && (
                <div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      viewOrder(item.id);
                    }}
                    className="border border-blue-600 rounded-lg px-3 py-2 hover:bg-blue-600 hover:text-white transition-all duration-300 ease-linear text-blue-600  dark:text-blue-200 dark:hover:text-blue-400"
                  >
                    <FaRegEye className="text-xl cursor-pointer" />
                  </button>
                </div>
              )}

              {/* DELETE BUTTON */}
              {showDelete && (
                <PermissionWrapper
                  service="SLS"
                  moduleCode="SLS.ORD"
                  allowedRoles={["admin", "write", "maintenance"]}
                >
                  <div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrder(item.id);
                        setShowDeleteModal(true);
                      }}
                      className="text-xl cursor-pointer text-red-600 border border-red-600 rounded-lg px-3 py-2 hover:bg-red-600 hover:text-white transition-all duration-300 ease-linear"
                    >
                      <MdDeleteOutline />
                    </button>
                  </div>
                </PermissionWrapper>
              )}

              {/* DONE BUTTON */}
              {showDone && item.status === "Open" && (
                <PermissionWrapper
                  service="SLS"
                  moduleCode="SLS.ORD"
                  allowedRoles={["admin", "write", "maintenance"]}
                >
                  <div className="flex-grow w-full">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedOrder(item.id);
                        setIsPayBillModalOpen(true);
                      }}
                      className="bg-blue-600 w-full text-sm h-full text-white flex items-center justify-center rounded-lg border border-blue-600 hover:bg-transparent hover:text-blue-700 transition-all duration-300 ease-linear"
                    >
                      Done
                    </button>
                  </div>
                </PermissionWrapper>
              )}
            </div>
          </div>
        ))}
      {orders.length === 0 && (
        <div className="ml-4 text-sm text-gray-800 dark:text-white">
          No data available..
        </div>
      )}
    </div>
  );
};

export default OrderBox;
