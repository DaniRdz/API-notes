const supertest = require("supertest");
const { app, server } = require("../index");

const mongoose = require("mongoose");
const Note = require("../models/Note");

const api = supertest(app);

const initialNotes = [
  {
    content: "Hello bro :D",
    important: true,
    date: new Date(),
  },
  {
    content: "This is a simul D:",
    important: false,
    date: new Date(),
  },
  {
    content: "other note",
    important: false,
    date: new Date(),
  },
];

beforeEach(async () => {
  await Note.deleteMany({});

  for (const note of initialNotes) {
    const noteObject = new Note(note);
    await noteObject.save();
  }
}, 11000);

describe("Test GET endpoint API", () => {
  test("notes are returned as json", async () => {
    await api
      .get("/api/notes")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("there are two notes", async () => {
    const response = await api.get("/api/notes");
    expect(response.body).toHaveLength(initialNotes.length);
  });

  test("The some note contain simul message", async () => {
    const response = await api.get("/api/notes");

    const contents = response.body.map((note) => note.content);
    expect(contents).toContain("This is a simul D:");
  });
});

describe("Test POST endpoint API", () => {
  test("a valid note can be added", async () => {
    const newNote = {
      content: "this is a New note",
      important: "true",
    };
    await api
      .post("/api/notes/")
      .send(newNote)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/notes");

    const contents = response.body.map((note) => note.content);
    expect(contents).toContain(newNote.content);
    expect(response.body).toHaveLength(initialNotes.length + 1);
  });

  test("test without is not added", async () => {
    const newNote = {
      important: "true",
    };
    await api
      .post("/api/notes/")
      .send(newNote)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/notes");

    expect(response.body).toHaveLength(initialNotes.length);
  });
});

describe("Test DELETE endpoint API", () => {
  test("Delete a note succesfully", async () => {
    const response = await api.get("/api/notes");
    const noteToDelete = response.body[0];

    await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

    const secondResponse = await api.get("/api/notes");

    expect(secondResponse.body).toHaveLength(initialNotes.length - 1);
  });
});

afterAll(() => {
  server.close();
  mongoose.connection.close();
});
