const testingRouter = require("express").Router();

const User = require("../models/User");
const Note = require("../models/Note");

testingRouter.post("/reset", async (req, res) => {
  await Note.deleteMany({});
  await User.deleteMany({});

  res.status(204).end();
});

module.exports = testingRouter;
