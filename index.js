require("dotenv").config();
require("./config/database");

const express = require("express");
const cors = require("cors");
const app = express();

const Note = require("./models/Note");

const notFound = require("./middlewares/notFound");
const handleErrors = require("./middlewares/handleErrors");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Welcome to Note API</h1");
});

app.get("/api/notes/", (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  });
});

app.get("/api/notes/:id", (req, res, next) => {
  const id = req.params.id;
  Note.findById(id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => {
      next(err);
    });
});

app.delete("/api/notes/:id", (req, res, next) => {
  const id = req.params.id;
  Note.findByIdAndRemove(id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((err) => {
      next(err);
    });
});
app.put("/api/notes/:id", (req, res, next) => {
  const id = req.params.id;
  const note = req.body;

  const newNoteinfo = {
    content: note.content,
    important: note.important,
  };
  Note.findByIdAndUpdate(id, newNoteinfo, { new: true })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      next(err);
    });
});

app.post("/api/notes/", (req, res) => {
  const note = req.body;

  if (!note || !note.content) {
    return res.status(400).json({
      error: "note or note content is missing",
    });
  }

  const newNote = new Note({
    content: note.content,
    important: note.important || false,
    date: new Date().toISOString(),
  });

  newNote.save().then((savedNote) => {
    res.status(201).json(savedNote);
  });
});

app.use(notFound);

app.use(handleErrors);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server runnig on port ${PORT}`);
});
