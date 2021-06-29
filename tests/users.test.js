const { server } = require("../index");

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/User");

const { api, getUsers } = require("./helpers");

beforeEach(async () => {
  await User.deleteMany({});

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash("1235", saltRounds);

  const user = new User({
    username: "Mariano1234",
    name: "Mariano",
    passwordHash,
  });

  await user.save();
}, 12000);

describe("create a new user", () => {
  test("test create a new user successfully", async () => {
    const userAtStart = await getUsers();
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

    const userAtEnd = await getUsers();

    expect(userAtEnd).toHaveLength(userAtStart.length + 1);

    const usersnames = userAtEnd.map((user) => user.username);
    expect(usersnames).toContain(newUser.username);
  });

  test("check fails statuscode and message if username is alredy token", async () => {
    const userAtStart = await getUsers();
    const newUser = {
      username: "Mariano1234",
      name: "Pedro",
      password: "3333LMD",
    };
    const result = await api
      .post("/api/users/")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error.errors.username.message).toContain(
      "`username` to be unique"
    );

    const userAtEnd = await getUsers();

    expect(userAtEnd).toHaveLength(userAtStart.length);
  }, 10000);
});

afterAll(() => {
  server.close();
  mongoose.connection.close();
});
