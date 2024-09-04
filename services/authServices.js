const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");

const { sendEmail } = require("./emailServices");

const generatePassword = (length = 10) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

const userRequestAccess = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const { name, email } = req.body;
    const existing = await userModel.findOne({ email: email });
    if (existing) {
      return res.status(409).json({ message: "already requested" });
    }

    const password = generatePassword();
    console.log(password);

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await userModel.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    if (newUser) {
      await sendEmail(
        email,
        "Your Access Request Approved",
        `
    Dear ${name},
    
    Your access request has been approved and an account has been created for you.
    
    Account Details:
    Email: ${email}
    Temporary Password: ${password}
    
    IMPORTANT: This temporary password will expire in 24 hours. Please log in to the dashboard and change your password from the settings section immediately.
    
    If you didn't request this account, please contact our support team immediately.
    
    Best regards,
    Transloom Support Team
        `
      );
      res.status(200).json({
        message: "request submitted successfully",
        password: password,
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "server under maintenance please try again later" });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const existingUser = await userModel.findOne({ email: email });
    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }
    // Verify password
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate an access token
    const token = jwt.sign(
      { userId: existingUser._id, email: existingUser.email },
      process.env.SECRET_KEY,
      { expiresIn: "30d" }
    );

    return res
      .status(200)
      .json({ message: "Login successful", name: existingUser.name, token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = userLogin;

// const userLogin = async (req, res) => {
//   try {
//     console.log(req.body);
//     const {email } = req.body;
//     const exiting = await userModel.findOne({ email: email });
//     if (exiting) {
//       if(exiting.status==true){
//         const accessToken = await JWT.sign(
//           { email: exiting.email,  },
//           process.env.ACCESS_TOKEN_SECRET,
//           {
//             expiresIn: "30d",
//           }
//         );
//         return res.status(200).json({ message: "Login successFull",accessToken,name:exiting.name });
//       }else{
//         res.status(409).json({message:"Access pending"})
//       }
//     }else{
//       res.status(404).json({message:"user not found"})
//     }

//   } catch (error) {
//     console.log(error);
//     res
//       .status(500)
//       .json({ message: "server under maintenance please try again later" });
//   }
// };

const changePasswordServices = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    currentPassword: Joi.string().required(),
    newPassword: Joi.string()
      .min(8)
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
      .required()
      .messages({
        "string.pattern.base":
          "Password must contain at least one uppercase letter, one number, and one special character.",
      }),
  });

  // Validate the request body against the schema
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { email, currentPassword, newPassword } = req.body;

    // Find the user
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the user's password
    user.password = hashedNewPassword;
    await user.save();

    // Send confirmation email
    await sendEmail(
      email,
      "Password Changed Successfully",
      `
Dear ${user.name},

Your password has been successfully changed.

If you did not make this change, please contact our support team immediately.

Best regards,
Transloom Support Team
      `
    );

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

module.exports = {
  userRequestAccess,
  userLogin,
  changePasswordServices,
};
