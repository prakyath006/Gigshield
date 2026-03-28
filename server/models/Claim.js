const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema({
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: "Worker", required: true },
  policyId: { type: mongoose.Schema.Types.ObjectId, ref: "Policy", required: true },
  workerName: String,
  type: { type: String, enum: ["weather", "environmental", "social", "platform"], required: true },
  status: {
    type: String,
    enum: ["auto_approved", "approved", "paid", "under_review", "flagged", "rejected"],
    default: "auto_approved",
  },
  disruptionEvent: { type: String, required: true },
  description: String,
  amount: { type: Number, required: true },
  lostHours: { type: Number, required: true },
  location: { city: String, zone: String, lat: Number, lng: Number },
  autoTriggered: { type: Boolean, default: true },
  fraudScore: { type: Number, default: 0 },
  fraudFlags: [String],
  evidenceData: {
    weatherData: {
      temperature: Number,
      rainfall: Number,
      windSpeed: Number,
      humidity: Number,
      aqi: Number,
      condition: String,
      source: String,
    },
    locationVerification: { verified: Boolean, distance: Number },
  },
  eventDate: { type: Date, default: Date.now },
  processedDate: Date,
  paidDate: Date,
}, { timestamps: true });

module.exports = mongoose.model("Claim", claimSchema);
