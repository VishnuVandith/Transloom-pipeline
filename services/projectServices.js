const projectModel = require("../models/projectModel");

const createProjectServices = async (req, res) => {
  try {
    console.log(req.body);
    const {
      projectName,
      websiteTechnology,
      originalLanguage,
      targetLanguages,
      domainUrl,
    } = req.body;
    const newProject = await projectModel.create({
      projectName,
      websiteTechnology,
      originalLanguage,
      targetLanguages,
      domainUrl,
    });
    if (newProject) {
      res
        .status(200)
        .json({ message: "Project created successfully", project: newProject });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Server under maintenance, please try again later" });
  }
};

module.exports = { createProjectServices };
