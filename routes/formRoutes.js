const express = require("express");
const formSubmitController = require("../controllers/formController");
const formRoute = express();

formRoute.post("/submit-form", formSubmitController);

module.exports = formRoute;
