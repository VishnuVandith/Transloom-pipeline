const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ProjectSchema = new Schema({
  projectName: {
    type: String,
    required: true,
  },
  websiteTechnology: {
    type: String,
    required: true,
  },
  originalLanguage: {
    type: String,
    required: true,
  },
  targetLanguages: {
    type: [String],
    required: true,
  },
  domainUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Project", ProjectSchema);
