const usersRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

usersRouter.post("/", async (request, response) => {
  const { username, password, name } = request.body;
  if (!(username && password && name)) {
    return response
      .status(400)
      .json({ error: "missing username or password or name" });
  }
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({ username, passwordHash, name });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

module.exports = usersRouter;
