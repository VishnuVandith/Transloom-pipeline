const formSubmitServices = require("../services/formSubmitServices");

const formSubmitController = async (req, res) => {
  formSubmitServices(req, res);
};

module.exports = formSubmitController;
