const Blog = require("../models/blog");

const initialDb = [
  {
    title: "My first post",
    author: "Ivan Deshchenko",
    url: "my-first-post",
    likes: 7,
  },
  {
    title: "My second post",
    author: "Ivan Deshchenko",
    url: "my-second-post",
    likes: 12,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const nonExistingId = async () => {
  const blog = new Blog({
    title: "testsss",
    url: "testssss",
    likes: 5,
    author: "testssss",
  });
  await blog.save();
  await blog.deleteOne();
  return blog._id.toString();
};

module.exports = { initialDb, blogsInDb, nonExistingId };
