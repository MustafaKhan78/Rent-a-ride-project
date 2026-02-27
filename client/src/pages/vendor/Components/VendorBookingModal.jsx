import { useDispatch, useSelector } from "react-redux";
import { setVendorOrderModalOpen } from "../../../redux/vendor/vendorBookingSlice";

const VendorBookingDetailModal = () => {
  const { isVendorOderModalOpen, vendorSingleOrderDetails: cur } = useSelector(
    (state) => state.vendorBookingSlice,
  );

  const dispatch = useDispatch();

  const closeModal = (e) => {
    // Prevent closing when clicking inside the modal content
    if (e.target === e.currentTarget) {
      dispatch(setVendorOrderModalOpen(false));
    }
  };

  // Safe date formatting helpers
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Invalid date";
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0"); // 1-12
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "—";
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Early return if no data
  if (!isVendorOderModalOpen || !cur) {
    return null;
  }

  const vehicle = cur.vehicleDetails || {};

  return (
    <div
      className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition duration-300 ease-in-out overflow-auto"
      onClick={closeModal}
    >
      <div
        className="relative m-4 mx-auto min-w-[300px] md:min-w-[500px] max-w-[40%] rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 antialiased shadow-2xl"
        onClick={(e) => e.stopPropagation()} // ← important: stop click from bubbling
      >
        <div className="relative pt-10 p-4 antialiased capitalize font-medium text-[12px] md:text-[16px]">
          <div className="mb-4">
            <div className="mb-2 font-bold">Booking Details</div>
            <hr />
            <div className="mb-4 mt-2 space-y-1.5">
              <div className="flex items-center justify-between">
                <div>Booking Id</div>
                <div>{cur._id || "—"}</div>
              </div>
              <div className="flex items-center justify-between">
                <div>Total Amount</div>
                <div>{cur.totalPrice ?? "—"}</div>
              </div>
              <div className="flex items-center justify-between">
                <div>Pickup Location</div>
                <div>{cur.pickUpLocation || "—"}</div>
              </div>
              <div className="flex items-center justify-between">
                <div>Pickup Date</div>
                <div>{formatDate(cur.pickupDate)}</div>
              </div>
              <div className="flex items-center justify-between">
                <div>Pickup Time</div>
                <div>{formatTime(cur.pickupDate)}</div>
              </div>

              <div className="flex items-center justify-between">
                <div>Dropoff Location</div>
                <div>{cur.dropOffLocation || "—"}</div>
              </div>
              <div className="flex items-center justify-between">
                <div>Dropoff Date</div>
                <div>{formatDate(cur.dropOffDate)}</div>
              </div>
              <div className="flex items-center justify-between">
                <div>Dropoff Time</div>
                <div>{formatTime(cur.dropOffDate)}</div>
              </div>
            </div>
          </div>

          <div className="mt-6 font-bold">Vehicle Details</div>
          <hr className="mt-4 mb-4" />
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div>Vehicle Number</div>
              <div>{vehicle.registeration_number || "—"}</div>
            </div>
            <div className="flex items-center justify-between">
              <div>Model</div>
              <div>{vehicle.model || "—"}</div>
            </div>
            <div className="flex items-center justify-between">
              <div>Company</div>
              <div>{vehicle.company || "—"}</div>
            </div>
            <div className="flex items-center justify-between">
              <div>Vehicle Type</div>
              <div>{vehicle.car_type || "—"}</div>
            </div>
            <div className="flex items-center justify-between">
              <div>Seats</div>
              <div>{vehicle.seat || vehicle.seats || "—"}</div>
            </div>
            <div className="flex items-center justify-between">
              <div>Fuel Type</div>
              <div>{vehicle.fuel_type || "—"}</div>
            </div>
            <div className="flex items-center justify-between">
              <div>Transmission</div>
              <div>{vehicle.transmition || vehicle.transmission || "—"}</div>
            </div>
            <div className="flex items-center justify-between">
              <div>Manufacturing Year</div>
              <div>{vehicle.year_made || "—"}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end p-4 shrink-0 text-blue-gray-500">
          <button
            className="middle none center rounded-lg bg-gradient-to-tr from-green-600 to-green-400 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-green-500/20 transition ease-in-out duration-300 hover:shadow-lg hover:shadow-green-500/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none animate-bounce hover:animate-none"
            onClick={() => dispatch(setVendorOrderModalOpen(false))}
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorBookingDetailModal;
