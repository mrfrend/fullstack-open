const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const blog = new Blog({
    ...request.body,
    likes: request.body.likes || 0,
  });

  const result = await blog.save();
  response.status(201).json(result);
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
