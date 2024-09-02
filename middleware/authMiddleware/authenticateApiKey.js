// /middlewares/authenticateApiKey.js
const ApiKey = require("../../models/apiKeyModel");
const bcrypt = require("bcrypt");

async function authenticateApiKey(req, res, next) {
  try {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      return res.status(401).json({ message: "API key is missing" });
    }

    const keyRecord = await ApiKey.findOne({});

    if (!keyRecord) {
      return res.status(401).json({ message: "Invalid API key" });
    }

    const isMatch = await bcrypt.compare(apiKey, keyRecord.hashedKey);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid API key" });
    }

    req.user = keyRecord.userId;
    keyRecord.lastUsed = new Date();
    await keyRecord.save();
    next();
  } catch (error) {
    console.log("Error while authenticating APIs");
  }
}

module.exports = authenticateApiKey;
