const mongoose = require("mongoose");

const mongoDB = process.env.DB_URL;

mongoose
  .connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((db) => console.log("DB Connected"))
  .catch((err) => {
    console.error(err);
  });
