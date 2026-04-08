// ============================================================
// Floor — User Auth Model
// Stores email + hashed password, links to Worker profile
// ============================================================
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  workerId:     { type: mongoose.Schema.Types.ObjectId, ref: "Worker", default: null },
  name:         { type: String },
  role:         { type: String, enum: ["worker", "admin"], default: "worker" },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
