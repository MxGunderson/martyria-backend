const express = require("express");
const posts = require("../routes/posts");
const users = require("../routes/users");
const auth = require("../routes/auth");
const error = require("../middleware/error");

module.exports = function(app) {
  app.use(express.json());
  app.use("/api/posts", posts);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use(error);
};
