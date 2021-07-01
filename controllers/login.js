const loginRouter = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

loginRouter.post("/", (req, res) => {
  const { password, username } = req.body;

  User.findOne({ username }).then((user) => {
    const passwordCorrect =
      user === null ? false : bcrypt.compareSync(password, user.passwordHash);
    if (!(user && passwordCorrect)) {
      res.status(401).json({
        error: "invalid password or username",
      });
    } else {
      const userForToken = {
        id: user._id,
        username: user.name,
      };

      const token = jwt.sign(userForToken, process.env.SECRET_KEY, {
        expiresIn: "7d",
      });

      res.json({
        name: user.name,
        username: user.username,
        token,
      });
    }
  });
});

module.exports = loginRouter;
