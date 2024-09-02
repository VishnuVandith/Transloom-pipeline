const JWT = require("jsonwebtoken");

const isLogin = async (req, res, next) => {
  try {
    console.log("We are in login middleware");
    // Extract the token from the request headers
    const token = req.headers.authorization; // Assuming the token is sent as "Bearer <token>"

    if (!token) {
      return res.status(401).json({ message: "Please provide a token" });
    }

    // Verify the token
    const decoded = JWT.verify(
      token.replace("Bearer ", ""),
      process.env.SECRET_KEY
    ); // remove "Bearer " from token
    req.users = decoded; // set decoded token to req.user
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = isLogin;
