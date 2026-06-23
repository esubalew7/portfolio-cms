import mongoose from "mongoose";

const mediaUsageSchema = new mongoose.Schema({
  section: { type: String, default: "" },
  field: { type: String, default: "" },
}, { _id: false });

const mediaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  format: { type: String, default: "" },
  width: { type: Number, default: 0 },
  height: { type: Number, default: 0 },
  fileSize: { type: Number, default: 0 },
  folder: { type: String, default: "portfolio-media" },
  usedBy: [mediaUsageSchema],
}, { timestamps: true });

mediaSchema.index({ name: "text", publicId: "text" });

const Media = mongoose.model("Media", mediaSchema);

export default Media;
