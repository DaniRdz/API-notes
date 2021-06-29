const supertest = require("supertest");

const User = require("../models/User");

const { app } = require("../index");
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

const getAllNotes = async () => {
  const response = await api.get("/api/notes");
  const contents = response.body.map((note) => note.content);

  return { response, contents };
};

const getUsers = async () => {
  const usersDB = await User.find({});
  return usersDB.map((user) => user.toJSON());
};

module.exports = { api, initialNotes, getAllNotes, getUsers };
