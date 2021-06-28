const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");

const User = require("../models/User");

usersRouter.post("/", (req, res) => {
  const user = req.body;
  const { username, name, password } = user;
  const saltRounds = 10;

  bcrypt.hash(password, saltRounds).then(function (hash) {
    const passwordHash = hash;

    const newUser = new User({
      username,
      name,
      passwordHash,
    });

    newUser.save().then((newUser) => {
      res.status(201).json(newUser);
    });
  });
});

module.exports = usersRouter;
