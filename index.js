const express = require("express");
const app = express();
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/mongo");
const cors = require("cors");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ["http://localhost:3000", "https://translate.transloom.com"],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  })
);

dotenv.config();
const authRoute = require("./routes/authRoutes");
const projectRoute = require("./routes/projectRoutes");
const formRoute = require("./routes/formRoutes");
const crawlerRoute =  require("./routes/crawlerRoute");
app.use("/api/auth", authRoute);
app.use("/api/project", projectRoute);
app.use("/api/form/", formRoute);
app.use('/api', crawlerRoute);

const PORT = process.env.PORT;
console.log(PORT, "port");

connectDB();
app.use(morgan("dev"));
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
