const { server } = require("../index");

const mongoose = require("mongoose");

const User = require("../models/User");

const { api } = require("./helpers");

beforeEach(async () => {
  await User.deleteMany({});

  const user = new User({
    username: "Testing",
    password: "1235Pw",
  });

  await user.save();
}, 11000);

describe("create a new user", () => {
  test("test create a new user successfully", async () => {
    const newUser = {
      username: "Testing",
      name: "Damian",
      password: "3333LMD",
    };
    await api
      .post("/api/users/")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);
  });
});

afterAll(() => {
  server.close();
  mongoose.connection.close();
});
