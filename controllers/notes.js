const notesRouter = require("express").Router();

const userExtractor = require("../middlewares/userExtractor");

const Note = require("../models/Note");
const User = require("../models/User");

notesRouter.get("/", (req, res) => {
  Note.find({})
    .populate("user", { name: 1, username: 1 })
    .then((notes) => {
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

notesRouter.delete("/:id", userExtractor, (req, res, next) => {
  const id = req.params.id;
  Note.findByIdAndRemove(id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((err) => {
      next(err);
    });
});

notesRouter.put("/:id", userExtractor, (req, res, next) => {
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

notesRouter.post("/", userExtractor, (req, res, next) => {
  const { content, important = false } = req.body;
  const { userId } = req;

  if (!content) {
    return res.status(400).json({
      error: "note or note content is missing",
    });
  }

  User.findById(userId).then((user) => {
    const newNote = new Note({
      content: content,
      important,
      user: user._id,
      date: new Date().toISOString(),
    });

    newNote
      .save()
      .then((savedNote) => {
        user.notes = user.notes.concat(savedNote._id);
        user.save();
        res.status(201).json(savedNote);
      })
      .catch((error) => {
        next(error);
      });
  });
});

module.exports = notesRouter;
