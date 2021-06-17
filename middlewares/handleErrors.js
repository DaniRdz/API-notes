module.exports = (err, req, res, next) => {
  console.error(err);
  if (err.name === "CastError") {
    res.status(400).end();
  } else {
    res.status(500).end();
  }
};
