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

const getUserwithHash = (user) => {
  const passwordHash = bcrypt.hashSync(user.password, config.SALT_ROUNDS);
  return {
    username: user.username,
    passwordHash,
    name: user.name,
  };
};

const getRandomUser = async () => {
  const users = await usersInDb();
  const idx = Math.floor(Math.random() * (users.length - 1));
  return users[idx];
};

const initialDb = initialData.map((user) => getUserwithHash(user));

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = { initialDb, usersInDb, getRandomUser, initialData };
