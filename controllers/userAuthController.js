const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const {
  userRequestAccess,
  userLogin,
  changePasswordServices,
} = require("../services/authServices");
const { generateApiKey, getApiKeys } = require("../services/apiKeyServices");

const requestAccessController = async (req, res) => {
  userRequestAccess(req, res);
};
const userLoginController = async (req, res) => {
  userLogin(req, res);
};
const generateApiKeyController = async (req, res) => {
  generateApiKey(req, res);
};

const getApiKeyController = async (req, res) => {
  getApiKeys(req, res);
};
const changePasswordController = async (req, res) => {
  changePasswordServices(req, res);
};

module.exports = {
  requestAccessController,
  userLoginController,
  generateApiKeyController,
  getApiKeyController,
  changePasswordController,
};
