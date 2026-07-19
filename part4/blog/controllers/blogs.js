const blogsRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user");
const { tokenExtractor } = require("../utils/middleware");
const config = require("../utils/config");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", tokenExtractor, async (request, response) => {
  const decodedToken = jwt.verify(request.token, config.SECRET);

  const user = await User.findById(decodedToken.id);

  if (!user) {
    return response.status(400).json({ error: "UserId missing or invalid" });
  }

  const blog = new Blog({
    ...request.body,
    likes: request.body.likes || 0,
    user: user._id,
  });

  const savedBlog = await blog.save();

  user.blogs = User.blogs.concat(savedBlog._id);

  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.put("/:id", async (request, response) => {
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

blogsRouter.delete("/:id", async (request, response) => {
  const id = request.params.id;
  await Blog.findByIdAndDelete(id);
  response.status(204).end();
});

module.exports = blogsRouter;
