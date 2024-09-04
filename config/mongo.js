const mongoose = require("mongoose");
//

const connectDB = async () => {
  try {
    // console.log("DB URL", process.env.DATABASE);
    const conn = await mongoose.connect(process.env.DATABASE);
    console.log("Connected Database succesfully");
  } catch (err) {
    console.error(`Error in Database ${err}`);
  }
};

module.exports = connectDB;
