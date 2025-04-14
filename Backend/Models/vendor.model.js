// vendor.model.js
import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // Allows null values while maintaining uniqueness
    },
    avatar: {
      type: String,
      default: "https://cdn.pixabay.com/photo/2021/01/04/10/41/icon-5887126_1280.png",
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    areasCovered: {
      type: [String],
      required: true,
    },
    pricePerKg: {
      plastic: Number,
      metal: Number,
      paper: Number,
      glass: Number,
      ewaste: Number,
    },
    companyName: String,
    vehicleType: {
      type: String,
      enum: ["Truck", "Van", "Auto", "Cycle", "Other"],
    },
    serviceHours: {
      start: String,
      end: String,
    },
    certification: String,
    password: {
      type: String,
      required: true,
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    userType: {
      type: String,
      default: "vendor",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: false, // No default value
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: false,
      },
    },
  },
  { timestamps: true }
);

vendorSchema.index({ location: "2dsphere" });

const Vendor = mongoose.model("Vendor", vendorSchema);

export default Vendor;