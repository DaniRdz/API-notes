const loginRouter = require("express").Router();
const bcrypt = require("bcrypt");

const User = require("../models/User");

loginRouter.post("/", (req, res) => {
  const { password, username } = req.body;

  User.findOne({ username }).then((user) => {
    const passwordCorrect =
      user === null ? false : bcrypt.compareSync(password, user.passwordHash);
    if (!(user && passwordCorrect)) {
      res.status(400).json({
        error: "invalid password or username",
      });
    } else {
      res.send({
        name: user.name,
        username: user.username,
      });
    }
  });
});

module.exports = loginRouter;
