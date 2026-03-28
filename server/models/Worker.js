const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: String,
  platform: { type: String, enum: ["zomato", "swiggy", "zepto", "blinkit", "dunzo"], required: true },
  city: { type: String, required: true },
  zone: { type: String, required: true },
  vehicleType: { type: String, enum: ["bicycle", "motorcycle", "scooter", "ev_scooter"], required: true },
  avgWeeklyEarnings: { type: Number, required: true },
  avgWeeklyHours: { type: Number, required: true },
  avgDeliveriesPerDay: { type: Number, default: 20 },
  riskScore: { type: Number, default: 35 },
  riskLevel: { type: String, enum: ["low", "medium", "high", "very_high"], default: "low" },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Worker", workerSchema);
