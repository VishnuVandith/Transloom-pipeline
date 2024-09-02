const express = require("express");
const { createProjectController } = require("../controllers/projectController");
const projectRoute = express();
projectRoute.post("/create-project", createProjectController);
module.exports = projectRoute;
