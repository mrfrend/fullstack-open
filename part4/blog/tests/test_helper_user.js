const bcrypt = require("bcrypt");
const config = require("../utils/config");
const User = require("../models/user");
const initialData = [
  {
    username: "Dummy 1",
    password: "1234",
    name: "Ivan",
  },
  {
    username: "Dummy 2",
    password: "2345",
    name: "Peter",
  },
];

const getUserwithHash = async (user) => {
  const passwordHash = await bcrypt.hash(user.password, config.SALT_ROUNDS);
  return {
    username: user.username,
    passwordHash,
    name: user.name,
  };
};

const initialDb = await Promise.all(
  initialData.map((user) => getUserwithHash(user)),
);

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = { initialDb, usersInDb };
