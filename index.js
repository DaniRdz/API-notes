require("dotenv").config();
require("./config/database");

const express = require("express");
const cors = require("cors");
const app = express();

const Note = require("./models/Note");

const notesRouter = require("./controllers/notes");

const notFound = require("./middlewares/notFound");
const handleErrors = require("./middlewares/handleErrors");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Welcome to Note API</h1");
});

app.use("/api/notes/", notesRouter);

app.use(notFound);

app.use(handleErrors);

const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
  console.log(`Server runnig on port ${PORT}`);
});

module.exports = { app, server };
