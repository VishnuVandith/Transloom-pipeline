// /controllers/apiKeyController.js
// test
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const ApiKey = require("../models/apiKeyModel");

exports.generateApiKey = async (req, res) => {
  try {
    console.log(req.user);
    console.log("We are in generate API keys");
    const userId = req.users.userId;

    // Check if an API key already exists for the user
    const existingApiKey = await ApiKey.findOne({ userId });
    if (existingApiKey) {
      // Decrypt the existing hashed key if necessary
      return res.status(200).json({ apiKey: existingApiKey.hashedKey });
    }

    // Generate new API key
    const apiKey = crypto.randomBytes(32).toString("hex");
    const hashedKey = await bcrypt.hash(apiKey, 10);
    const newApiKey = new ApiKey({ hashedKey, userId });
    await newApiKey.save();

    res.status(200).json({ apiKey });
  } catch (error) {
    res.status(500).json({ message: "Error generating API key", error });
  }
};

exports.getApiKeys = async (req, res) => {
  try {
    const userId = req.users.userId;
    const apiKeys = await ApiKey.find({ userId });
    res.status(200).json(apiKeys);
  } catch (error) {
    res.status(500).json({ message: "Error fetching API keys", error });
  }
};
