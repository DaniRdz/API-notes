module.exports = (err, req, res, next) => {
  console.error(err.name);
  if (err.name === "CastError") {
    res.status(400).end();
  } else if (err.name == "JsonWebTokenError") {
    res.status(401).json({
      error: "token missing or invalid",
    });
  } else if (err.name == "TokenExpirerError") {
    res.status(401).json({
      error: "token expired",
    });
  } else {
    res.status(500).end();
  }
};
