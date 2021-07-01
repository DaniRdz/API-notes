const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authorization = req.get("authorization");

  let token = "";

  if (authorization && authorization.toLocaleLowerCase().startsWith("bearer")) {
    token = authorization.substring(7);
  }
  const decodeToken = jwt.verify(token, process.env.SECRET_KEY);

  if (!token || !decodeToken.id) {
    return res.status(401).json({
      error: "token missing or invalid",
    });
  }
  const { id: userId } = decodeToken;
  req.userId = userId;

  next();
};
