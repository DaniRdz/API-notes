const express = require("express");
const app = express();

app.use(express.json());

let notes = [
  {
    id: 1,
    content: "Hello my litle frinds",
    date: "09/06/2021",
    important: true,
  },
  { id: 2, content: "Hola mis amigos", date: "09/06/2021", important: true },
  {
    id: 3,
    content: "Hello my litle frinds",
    date: "09/06/2021",
    important: true,
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Welcome to Note API</h1");
});

app.get("/api/notes/", (req, res) => {
  res.json(notes);
});

app.get("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find((note) => note.id === id);
  if (note) {
    res.json(note);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter((note) => note.id != id);
  res.status(204).end();
});

app.post("/api/notes/", (req, res) => {
  const note = req.body;

  if (!note || !note.content) {
    return res.status(400).json({
      error: "note or note content is missing",
    });
  }

  const ids = notes.map((note) => note.id);
  const maxId = Math.max(...ids);

  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: typeof note.important !== "undefined" ? note.important : false,
    date: new Date().toISOString(),
  };

  notes = [...notes, newNote];
  res.status(201).json(newNote);
});

const PORT = 3000;
app.listen(3000, () => {
  console.log(`Server runnig on port ${PORT}`);
});
