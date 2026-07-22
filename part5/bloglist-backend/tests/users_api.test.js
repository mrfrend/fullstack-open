const { test, describe, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const helper = require("./test_helper_user");
const supertest = require("supertest");
const app = require("../app");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const mongoose = require("mongoose");

const api = supertest(app);

describe("when there is an initial database with two users", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await User.insertMany(helper.initialDb);
  });

  test("all users are returned", async () => {
    const response = await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.length, helper.initialDb.length);
  });

  describe("creating a user", () => {
    test("succeeds with correct user data", async () => {
      const user = {
        username: "no-such-name",
        password: "12345",
        name: "DJ",
      };

      const savedUser = await api
        .post("/api/users")
        .send(user)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const usersAfter = await helper.usersInDb();

      assert.strictEqual(usersAfter.length, helper.initialDb.length + 1);
      assert(await bcrypt.compare(user.password, savedUser.body.passwordHash));
    });

    test("returns 400 if username is missing", async () => {
      const user = {
        password: "12345",
        name: "DJ",
      };

      await api.post("/api/users").send(user).expect(400);
    });

    test("returns 400 if password is missing", async () => {
      const user = {
        username: "no-such-name",
        name: "DJ",
      };

      await api.post("/api/users").send(user).expect(400);
    });

    test("returns 400 if username is less than 3 characters", async () => {
      const user = {
        username: "ab",
        password: "12345",
        name: "DJ",
      };

      await api.post("/api/users").send(user).expect(400);
    });

    test("returns 400 if password is less than 3 characters", async () => {
      const user = {
        username: "abcd",
        password: "12",
        name: "DJ",
      };

      await api.post("/api/users").send(user).expect(400);
    });

    test("returns 400 if username is not unique", async () => {
      const user = {
        username: "Dummy 1",
        password: "12345",
        name: "DJ",
      };

      const response = await api.post("/api/users").send(user).expect(400);
      assert.strictEqual(
        response.body.error,
        "expected `username` to be unique",
      );
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
