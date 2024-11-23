import Booking from "../../models/BookingModel.js";
import Vehicle from "../../models/vehicleModel.js";
import { errorHandler } from "../../utils/error.js";

export const allBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.aggregate([
      {
        $lookup: {
          from: "vehicles",
          localField: "vehicleId",
          foreignField: "_id",
          as: "vehicleDetails",
        },
      },
      {
        $unwind: {
          path: "$vehicleDetails",
        },
      },
    ]);

    // If bookings is falsy (e.g., null or undefined), treat as not found
    if (!bookings) {
      return next(errorHandler(404, "No bookings found"));
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.log(error);
    return next(errorHandler(500, "Error in allBookings"));
  }
};

// Change booking status
export const changeStatus = async (req, res, next) => {
  try {
    // Validate required fields
    const { id, status } = req.body;
    if (!id || !status) {
      return next(
        errorHandler(
          409,
          "Bad request: vehicle id and new status are required",
        ),
      );
    }

    const statusChanged = await Booking.findByIdAndUpdate(id, {
      status: status,
    });

    if (!statusChanged) {
      return next(errorHandler(404, "Status not changed or wrong id"));
    }

    res.status(200).json({ message: "Status changed" });
  } catch (error) {
    console.log(error);
    return next(errorHandler(500, "Error in changeStatus"));
  }
};
