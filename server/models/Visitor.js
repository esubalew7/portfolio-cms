import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
      trim: true,
    },
    ip: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      default: "Unknown",
      trim: true,
    },
    city: {
      type: String,
      default: "Unknown",
      trim: true,
    },
    device: {
      type: String,
      default: "Desktop",
      trim: true,
    },
    browser: {
      type: String,
      default: "Unknown",
      trim: true,
    },
    userAgent: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

visitorSchema.index({ ip: 1, page: 1, createdAt: -1 });

const Visitor = mongoose.model("Visitor", visitorSchema);

export default Visitor;
