require("dotenv").config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);

module.exports = { PORT, MONGODB_URI, SALT_ROUNDS };
