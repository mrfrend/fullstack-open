const usersRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const config = require("../utils/config");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

usersRouter.post("/", async (request, response) => {
  const { username, password, name } = request.body;
  if (!(username && password)) {
    return response.status(400).json({ error: "missing username or password" });
  } else if (username.length < 3 || password.length < 3) {
    return response
      .status(400)
      .json({ error: "password and name must be at least 3 characters long" });
  }
  const passwordHash = await bcrypt.hash(password, config.SALT_ROUNDS);

  const user = new User({ username, passwordHash, name });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

module.exports = usersRouter;
