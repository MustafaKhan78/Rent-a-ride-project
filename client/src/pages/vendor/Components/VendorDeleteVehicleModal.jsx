import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setVendorDeleteSuccess } from "../../../redux/vendor/vendorDashboardSlice";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const VendorDeleteVehicleModal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const queryParams = new URLSearchParams(location.search);
  const vehicle_id = queryParams.get("vehicle_id");

  const [isDeleting, setIsDeleting] = useState(false);

  const closeModal = () => {
    navigate("/vendorDashboard/vendorAllVehicles");
  };

  const vendorHandleDelete = async () => {
    if (!vehicle_id) {
      toast.error("No vehicle selected");
      return;
    }

    setIsDeleting(true);
    const toastId = toast.loading("Deleting vehicle...");

    try {
      const res = await fetch(
        `/api/vendor/vendorDeleteVehicles/${vehicle_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete vehicle");
      }

      toast.success("Vehicle deleted successfully", { id: toastId });
      dispatch(setVendorDeleteSuccess(true));
      navigate("/vendorDashboard/vendorAllVehicles");
    } catch (error) {
      console.error("Delete vehicle error:", error);
      toast.error(error.message || "Something went wrong", { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  // If no vehicle_id → show error-like UI but still allow cancel
  if (!vehicle_id) {
    return (
      <>
        <Toaster position="top-center" />
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="relative w-full max-w-md p-4">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="p-6 text-center">
                <h3 className="mb-5 text-lg font-normal text-red-600">
                  Invalid request — no vehicle selected
                </h3>
                <button
                  onClick={closeModal}
                  className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-center" />

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
        <div className="relative w-full max-w-md p-4">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <button
              type="button"
              className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={closeModal}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>

            <div className="p-4 md:p-5 text-center">
              <svg
                className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>

              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this vehicle?
              </h3>

              <button
                type="button"
                disabled={isDeleting}
                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={vendorHandleDelete}
              >
                {isDeleting ? "Deleting..." : "Yes, I'm sure"}
              </button>

              <button
                type="button"
                disabled={isDeleting}
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={closeModal}
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VendorDeleteVehicleModal;
