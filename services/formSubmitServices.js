const { sendFormSubmissionNotification } = require("./emailServices");

const formSubmitServices = async (req, res) => {
  try {
    // Extract form data from request body
    const { name, email, subject, phoneNumber, message } = req.body;

    // Create new form document
    const newForm = new Form({
      name,
      email,
      subject,
      phoneNumber,
      message,
    });

    // Save form data to database
    await newForm.save();

    // Send email notification
    await sendFormSubmissionNotification({
      name,
      email,
      subject,
      phoneNumber,
      message,
    });

    res.status(200).json({ message: "Form submitted successfully" });
  } catch (error) {
    console.error("Error submitting form:", error);
    res
      .status(500)
      .json({ message: "An error occurred while submitting the form" });
  }
};

module.exports = formSubmitServices;
