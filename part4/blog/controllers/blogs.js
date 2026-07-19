const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const blog = new Blog({
    ...request.body,
    likes: request.body.likes || 0,
  });
  const users = await User.find({});
  const idx = Math.floor(Math.random() * (users.length - 1));
  const randomUser = users[idx];

  blog.user = randomUser._id;

  const savedBlog = await blog.save();

  randomUser.blogs = randomUser.blogs.concat(savedBlog._id);

  await randomUser.save();

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
