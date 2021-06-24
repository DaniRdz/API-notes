const mongoose = require("mongoose");

const { DB_URL, DB_URL_TEST, NODE_ENV } = process.env;
const mongoDB = NODE_ENV === "test" ? DB_URL_TEST : DB_URL;

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
