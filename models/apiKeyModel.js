// /models/ApiKey.js
const mongoose = require("mongoose");

const apiKeySchema = new mongoose.Schema({
  hashedKey: { type: String, required: true, unique: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  lastUsed: { type: Date },
});

module.exports = mongoose.model("ApiKey", apiKeySchema);
