const notesRouter = require("express").Router();
const Note = require("../models/Note");

notesRouter.get("/", (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  });
});

notesRouter.get("/:id", (req, res, next) => {
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

notesRouter.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  Note.findByIdAndRemove(id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((err) => {
      next(err);
    });
});

notesRouter.put("/:id", (req, res, next) => {
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

notesRouter.post("/", (req, res) => {
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

module.exports = notesRouter;
