import { useDispatch, useSelector } from "react-redux";
import { addVehicleClicked } from "../../../redux/adminSlices/actions";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { MenuItem } from "@mui/material";
import { fetchModelData } from "../../admin/components/AddProductModal";
import { useEffect } from "react";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { IoMdClose } from "react-icons/io";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const VendorAddProductModal = () => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      company: "",
      model: "",
      fuelType: "",
      carType: "",
      Seats: "",
      transmitionType: "",
      vehicleLocation: "",
      vehicleDistrict: "",
      insurance_end_date: null,
      Registeration_end_date: null,
      polution_end_date: null,
    },
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAddVehicleClicked } = useSelector((state) => state.addVehicle);
  const { modelData, companyData, locationData, districtData } = useSelector(
    (state) => state.modelDataSlice,
  );
  const { _id } = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    fetchModelData(dispatch);
  }, [dispatch]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // Required fields – already validated by react-hook-form + required prop
      formData.append(
        "registeration_number",
        data.registeration_number?.trim() || "",
      );
      formData.append("company", data.company);
      formData.append("name", data.name?.trim() || "");
      formData.append("model", data.model);
      formData.append("title", data.title?.trim() || "");
      formData.append("base_package", data.base_package?.trim() || "");
      formData.append("price", data.price || "");
      formData.append("description", data.description?.trim() || "");
      formData.append("year_made", data.year_made || "");
      formData.append("fuel_type", data.fuelType);
      formData.append("seat", data.Seats);
      formData.append("transmition_type", data.transmitionType);
      formData.append("car_type", data.carType);
      formData.append("location", data.vehicleLocation);
      formData.append("district", data.vehicleDistrict);
      formData.append("addedBy", _id);

      // Dates – safe access
      if (data.insurance_end_date?.$d) {
        formData.append(
          "insurance_end_date",
          data.insurance_end_date.$d.toISOString(),
        );
      }
      if (data.Registeration_end_date?.$d) {
        formData.append(
          "registeration_end_date",
          data.Registeration_end_date.$d.toISOString(),
        );
      }
      if (data.polution_end_date?.$d) {
        formData.append(
          "polution_end_date",
          data.polution_end_date.$d.toISOString(),
        );
      }

      // Images – safe handling
      if (data.image?.length > 0) {
        Array.from(data.image).forEach((file) => {
          formData.append("images", file); // ← changed key to "images[]" friendly name
        });
      }

      // Optional document images
      if (data.insurance_image?.length > 0) {
        Array.from(data.insurance_image).forEach((file) =>
          formData.append("insurance_images", file),
        );
      }
      if (data.rc_book_image?.length > 0) {
        Array.from(data.rc_book_image).forEach((file) =>
          formData.append("rc_book_images", file),
        );
      }
      if (data.polution_image?.length > 0) {
        Array.from(data.polution_image).forEach((file) =>
          formData.append("polution_images", file),
        );
      }

      const toastId = toast.loading("Saving vehicle...", {
        position: "bottom-center",
      });

      const res = await fetch("/api/vendor/vendorAddVehicle", {
        method: "POST",
        body: formData,
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(result.message || "Failed to submit vehicle", {
          id: toastId,
        });
        return;
      }

      toast.success("Request sent to admin", { id: toastId });
      reset();
      navigate("/vendorDashboard/vendorAllVeihcles");
      dispatch(addVehicleClicked(false));
    } catch (err) {
      console.error("Vehicle submission error:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleClose = () => {
    reset();
    navigate("/vendorDashboard/vendorAllVeihcles");
    dispatch(addVehicleClicked(false));
  };

  if (!isAddVehicleClicked) return null;

  return (
    <>
      <Toaster />
      <div>
        <button
          onClick={handleClose}
          className="relative left-10 top-5"
          type="button"
        >
          <div className="p-2 rounded-full bg-slate-100 drop-shadow-md hover:shadow-lg hover:bg-blue-200 hover:translate-y-1 hover:translate-x-1 transition-transform">
            <IoMdClose style={{ fontSize: 30 }} />
          </div>
        </button>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="bg-white -z-10 max-w-[1000px] mx-auto">
            <Box
              sx={{
                "& .MuiTextField-root": {
                  m: 4,
                  width: "25ch",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "black",
                  },
                  "@media (max-width: 640px)": { width: "30ch" },
                },
              }}
            >
              <div>
                <TextField
                  required
                  id="registeration_number"
                  label="Registration Number"
                  {...register("registeration_number", { required: true })}
                />

                <Controller
                  control={control}
                  name="company"
                  rules={{ required: "Company is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      required
                      select
                      label="Company"
                      error={!!error}
                      helperText={error?.message}
                    >
                      <MenuItem value="" disabled>
                        Select company
                      </MenuItem>
                      {companyData.map((cur, idx) => (
                        <MenuItem value={cur} key={idx}>
                          {cur}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />

                <TextField
                  required
                  id="name"
                  label="Name"
                  {...register("name", { required: true })}
                />

                <Controller
                  control={control}
                  name="model"
                  rules={{ required: "Model is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      required
                      select
                      label="Model"
                      error={!!error}
                      helperText={error?.message}
                    >
                      <MenuItem value="" disabled>
                        Select model
                      </MenuItem>
                      {modelData.map((cur, idx) => (
                        <MenuItem value={cur} key={idx}>
                          {cur}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />

                <TextField id="title" label="Title" {...register("title")} />

                <TextField
                  id="base_package"
                  label="Base Package"
                  {...register("base_package")}
                />

                <TextField
                  id="price"
                  type="number"
                  label="Price"
                  {...register("price", { valueAsNumber: true })}
                />

                <TextField
                  required
                  id="year_made"
                  type="number"
                  label="Year Made"
                  {...register("year_made", {
                    required: true,
                    min: { value: 1900, message: "Year too old" },
                    max: { value: 2100, message: "Invalid year" },
                  })}
                />

                <Controller
                  control={control}
                  name="fuelType"
                  rules={{ required: "Fuel type is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      required
                      select
                      label="Fuel Type"
                      error={!!error}
                      helperText={error?.message}
                    >
                      <MenuItem value="" disabled>
                        Select fuel type
                      </MenuItem>
                      <MenuItem value="petrol">Petrol</MenuItem>
                      <MenuItem value="diesel">Diesel</MenuItem>
                      <MenuItem value="electric">Electric</MenuItem>
                      <MenuItem value="hybrid">Hybrid</MenuItem>
                    </TextField>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="carType"
                  control={control}
                  rules={{ required: "Car type is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      required
                      select
                      label="Car Type"
                      error={!!error}
                      helperText={error?.message}
                    >
                      <MenuItem value="" disabled>
                        Select car type
                      </MenuItem>
                      <MenuItem value="sedan">Sedan</MenuItem>
                      <MenuItem value="suv">SUV</MenuItem>
                      <MenuItem value="hatchback">Hatchback</MenuItem>
                    </TextField>
                  )}
                />

                <Controller
                  control={control}
                  name="Seats"
                  rules={{ required: "Number of seats is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      required
                      select
                      label="Seats"
                      error={!!error}
                      helperText={error?.message}
                    >
                      <MenuItem value="" disabled>
                        Select seats
                      </MenuItem>
                      <MenuItem value="5">5</MenuItem>
                      <MenuItem value="7">7</MenuItem>
                      <MenuItem value="8">8</MenuItem>
                    </TextField>
                  )}
                />

                <Controller
                  control={control}
                  name="transmitionType"
                  rules={{ required: "Transmission type is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      required
                      select
                      label="Transmission Type"
                      error={!!error}
                      helperText={error?.message}
                    >
                      <MenuItem value="" disabled>
                        Select transmission
                      </MenuItem>
                      <MenuItem value="automatic">Automatic</MenuItem>
                      <MenuItem value="manual">Manual</MenuItem>
                    </TextField>
                  )}
                />

                <Controller
                  control={control}
                  name="vehicleLocation"
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      required
                      select
                      label="Location"
                      error={!!error}
                    >
                      <MenuItem value="" disabled>
                        Select location
                      </MenuItem>
                      {locationData.map((cur, idx) => (
                        <MenuItem value={cur} key={idx}>
                          {cur}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />

                <Controller
                  control={control}
                  name="vehicleDistrict"
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      required
                      select
                      label="District"
                      error={!!error}
                    >
                      <MenuItem value="" disabled>
                        Select district
                      </MenuItem>
                      {districtData.map((cur, idx) => (
                        <MenuItem value={cur} key={idx}>
                          {cur}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />

                <TextField
                  id="description"
                  label="Description"
                  multiline
                  rows={4}
                  sx={{
                    width: "100%",
                    "@media (min-width: 1280px)": { minWidth: 565 },
                  }}
                  {...register("description")}
                />
              </div>

              <div>
                <Controller
                  name="insurance_end_date"
                  control={control}
                  rules={{ required: "Insurance expiry is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        {...field}
                        label="Insurance End Date"
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                        slotProps={{
                          textField: {
                            error: !!error,
                            helperText: error?.message,
                            required: true,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  )}
                />

                <Controller
                  name="Registeration_end_date"
                  control={control}
                  rules={{ required: "Registration expiry is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        {...field}
                        label="Registration End Date"
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                        slotProps={{
                          textField: {
                            error: !!error,
                            helperText: error?.message,
                            required: true,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  )}
                />

                <Controller
                  name="polution_end_date"
                  control={control}
                  rules={{ required: "Pollution expiry is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        {...field}
                        label="Pollution End Date"
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                        slotProps={{
                          textField: {
                            error: !!error,
                            helperText: error?.message,
                            required: true,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  )}
                />

                {/* File uploads */}
                <div className="flex flex-col items-start justify-center lg:flex-row gap-10 lg:justify-between lg:items-start ml-7 mt-10">
                  <div className="max-w-[300px] sm:max-w-[600px]">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="insurance_image"
                    >
                      Upload Insurance Image
                    </label>
                    <input
                      className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                      id="insurance_image"
                      type="file"
                      multiple
                      {...register("insurance_image")}
                    />
                  </div>

                  <div className="max-w-[300px] sm:max-w-[600px]">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="rc_book_image"
                    >
                      Upload RC Book Image
                    </label>
                    <input
                      className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                      id="rc_book_image"
                      type="file"
                      multiple
                      {...register("rc_book_image")}
                    />
                  </div>

                  <div className="max-w-[300px] sm:max-w-[600px]">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="polution_image"
                    >
                      Upload Pollution Image
                    </label>
                    <input
                      className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                      id="polution_image"
                      type="file"
                      multiple
                      {...register("polution_image")}
                    />
                  </div>

                  <div className="max-w-[300px] sm:max-w-[600px]">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="image"
                    >
                      Upload Vehicle Images
                    </label>
                    <input
                      className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                      id="image"
                      type="file"
                      multiple
                      {...register("image")}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-start items-center ml-7 mb-10">
                <Button
                  variant="contained"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </Box>
          </div>
        </form>
      </div>
    </>
  );
};

export default VendorAddProductModal;
