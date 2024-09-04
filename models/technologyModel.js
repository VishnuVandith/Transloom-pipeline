const mongoose = require("mongoose");
const technologySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("technology", technologySchema);
