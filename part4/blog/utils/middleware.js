const logger = require("./logger");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const User = require("../models/user");

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const tokenExtractor = (request, response, next) => {
  const tokenHeader = request.get("authorization");
  const [type, token] = (tokenHeader ?? "bad value").split(" ");
  if (!(type === "Bearer" && token)) {
    request.token = null;
  } else {
    request.token = token;
  }
  next();
};

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, config.SECRET);
  const user = await User.findById(decodedToken.id);
  if (!user) {
    return response.status(401).json({ error: "UserId missing or invalid" });
  }
  request.user = user;
  next();
};

const unknownEndpoint = (request, response, next) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name == "CastError") {
    return response.status(400).json({ error: "malformatted id" });
  } else if (error.name == "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    return response
      .status(400)
      .json({ error: "expected `username` to be unique" });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "token invalid" });
  }
  next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
