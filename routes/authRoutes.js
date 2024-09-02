const express = require("express");
const authRoute = express();

const {
  requestAccessController,
  userLoginController,
  getApiKeyController,
  generateApiKeyController,
  changePasswordController,
} = require("../controllers/userAuthController");
const isLogin = require("../middleware/authMiddleware/isLogin");

authRoute.post("/request-access", requestAccessController);
authRoute.post("/user-login", userLoginController);
authRoute.post("/generate-api-key", isLogin, generateApiKeyController);
authRoute.get("/api-keys", isLogin, getApiKeyController);
authRoute.post("/change-password", changePasswordController);
module.exports = authRoute;
