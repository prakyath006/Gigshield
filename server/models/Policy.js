const mongoose = require("mongoose");

const policySchema = new mongoose.Schema({
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: "Worker", required: true },
  workerName: String,
  plan: { type: String, enum: ["basic", "standard", "premium"], required: true },
  platform: String,
  status: { type: String, enum: ["active", "paused", "expired", "cancelled"], default: "active" },
  weeklyPremium: { type: Number, required: true },
  coverageAmount: Number,
  maxPayoutPerEvent: Number,
  coverageHoursPerWeek: Number,
  autoRenew: { type: Boolean, default: true },
  triggers: [{
    name: String,
    type: { type: String, enum: ["weather", "environmental", "social", "platform"] },
    threshold: String,
    isActive: { type: Boolean, default: true },
  }],
  // Industry-Standard Exclusions (war, pandemic, nuclear, fraud)
  exclusions: {
    type: [String],
    default: [
      "Acts of War & Terrorism",
      "Global Pandemics / Macro-Lockdowns",
      "Nuclear / Chemical Contamination",
      "Intentional GPS Spoofing / Fraud"
    ]
  },
  startDate: { type: Date, default: Date.now },
  endDate: Date,
}, { timestamps: true });

module.exports = mongoose.model("Policy", policySchema);
