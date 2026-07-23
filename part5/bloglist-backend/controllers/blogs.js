const blogsRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user");
const { userExtractor } = require("../utils/middleware");
const config = require("../utils/config");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", userExtractor, async (request, response) => {
  const user = request.user;

  const blog = new Blog({
    ...request.body,
    likes: request.body.likes || 0,
    user: user._id,
  });

  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);

  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.put("/:id", userExtractor, async (request, response) => {
  const id = request.params.id;
  const blog = await Blog.findById(id);
  const body = request.body;
  if (!blog) {
    return response.status(404).end();
  }

  blog.title = body.title;
  blog.url = body.url;
  blog.likes = body.likes;
  blog.author = body.author;

  const updatedBlog = await blog.save();
  response.json(updatedBlog);
});

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
  const id = request.params.id;
  const user = request.user;
  const blog = await Blog.findById(id);

  if (!blog) {
    return response.status(204).end();
  }

  if (blog.user.toString() !== user._id.toString()) {
    return response
      .status(403)
      .json({ error: "UserId not the same for blog's user" });
  }
  await blog.deleteOne();
  response.status(204).end();
});

module.exports = blogsRouter;
