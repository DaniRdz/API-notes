const { server } = require("../index");

const mongoose = require("mongoose");
const Note = require("../models/Note");

const { api, initialNotes, getAllNotes, getUsers } = require("./helpers");

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
    const { response } = await getAllNotes();
    expect(response.body).toHaveLength(initialNotes.length);
  });

  test("The some note contain simul message", async () => {
    const { contents } = await getAllNotes();

    expect(contents).toContain("This is a simul D:");
  });

  test("Get a single exist note", async () => {
    const { response } = await getAllNotes();
    const noteToFind = response.body[0];

    const secondResponse = await api
      .get(`/api/notes/${noteToFind.id}`)
      .expect(200);

    expect(secondResponse.body.content).toBe("Hello bro :D");
  });

  test("recive 404 if note doesnt exist", async () => {
    await api.get("/api/notes/60caab89a41eb81258e8ea2a").expect(404);
  });
});

describe("Test POST endpoint API", () => {
  test("a valid note can be added", async () => {
    const users = await getUsers();
    const usersId = users.map((user) => user.id);
    const newNote = {
      content: "this is a New note",
      important: "true",
      userId: usersId[0],
    };
    await api
      .post("/api/notes/")
      .send(newNote)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const { response, contents } = await getAllNotes();
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

    const { response } = await getAllNotes();

    expect(response.body).toHaveLength(initialNotes.length);
  });
});

describe("Test PUT endpoint API", () => {
  test("Update a note successfully", async () => {
    const { response } = await getAllNotes();
    const noteToUpdate = response.body[1];
    const noteUpdated = {
      content: "Note was Update",
      important: true,
    };

    await api
      .put(`/api/notes/${noteToUpdate.id}`)
      .send(noteUpdated)
      .expect(200);

    const { contents } = await getAllNotes();
    expect(contents).toContain(noteUpdated.content);
  });
});

describe("Test DELETE endpoint API", () => {
  test("Delete a note succesfully", async () => {
    const { response } = await getAllNotes();
    const noteToDelete = response.body[0];

    await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

    const { response: secondResponse, contents } = await getAllNotes();

    expect(secondResponse.body).toHaveLength(initialNotes.length - 1);
    expect(contents).not.toContain(noteToDelete.content);
  });
});

afterAll(() => {
  server.close();
  mongoose.connection.close();
});
