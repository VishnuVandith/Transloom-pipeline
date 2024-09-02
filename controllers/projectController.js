const { createProjectServices } = require("../services/projectServices");

const createProjectController = async (req, res) => {
  createProjectServices(req, res);
};

module.exports = { createProjectController };
