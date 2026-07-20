const app = require("../app");
const { test, after, beforeEach, describe, before } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const Blog = require("../models/blog");
const blog_helper = require("./test_helper_blog");
const user_helper = require("./test_helper_user");
const mongoose = require("mongoose");
const User = require("../models/user");

const api = supertest(app);

describe("when there is initially some blogs saved", () => {
  let tokenString = null;
  const getTokenString = async () => {
    await User.deleteMany({});
    await User.insertMany(user_helper.initialDb);

    const userInfo = user_helper.initialData[0];
    let tokenResponse = await api
      .post("/api/login")
      .send({ username: userInfo.username, password: userInfo.password });
    tokenString = "Bearer " + tokenResponse.body.token;
  };
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(blog_helper.initialDb);
  });

  test("blogs are returned", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("blogs are returned with correct length", async () => {
    const response = await api.get("/api/blogs").expect(200);
    assert.strictEqual(response.body.length, blog_helper.initialDb.length);
  });

  test("blogs have the unique property id", async () => {
    const response = await api.get("/api/blogs").expect(200);
    const firstBlog = response.body[0];
    const firstBlogAtDb = (await blog_helper.blogsInDb())[0];

    assert(firstBlog.id);
    assert(firstBlogAtDb.id);
    assert.strictEqual(firstBlog.id, firstBlogAtDb.id);
  });

  describe("creating a new blog", () => {
    before(getTokenString);
    test("succeeds with correct data", async () => {
      const blog = {
        title: "Dummy post",
        author: "post post",
        url: "dummy-post",
        likes: 7,
      };
      await api
        .post("/api/blogs")
        .set("Authorization", tokenString)
        .send(blog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const response = await api.get("/api/blogs");

      const titles = response.body.map((blog) => blog.title);
      assert.strictEqual(
        response.body.length,
        blog_helper.initialDb.length + 1,
      );
      assert(titles.includes("Dummy post"));
    });
    test("makes likes property equals to zero if it is not found in body", async () => {
      const blog = {
        title: "Dummy post",
        author: "post post",
        url: "dummy-post",
      };
      await api
        .post("/api/blogs")
        .set("Authorization", tokenString)
        .send(blog)
        .expect(201);

      const response = await api.get("/api/blogs").expect(200);
      assert.strictEqual(
        response.body.length,
        blog_helper.initialDb.length + 1,
      );
      const createdBlog = response.body[blog_helper.initialDb.length];
      assert(createdBlog.likes === 0);
    });

    test("assigns the authorized user as blog's author and adds new blog to his works", async () => {
      const blog = {
        title: "Dummy post",
        author: "post post",
        url: "dummy-post",
        likes: 7,
      };

      const response = await api
        .post("/api/blogs")
        .set("Authorization", tokenString)
        .send(blog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const createdBlog = response.body;
      const blogsAfter = await blog_helper.blogsInDb();
      assert.strictEqual(blogsAfter.length, blog_helper.initialDb.length + 1);

      const users = await user_helper.usersInDb();
      const usersId = users.map((user) => user.id);
      assert(usersId.includes(createdBlog.user));

      const assignedUser = users.find((user) => user.id === createdBlog.user);
      const assignedUserBlogs = assignedUser.blogs.map((blogId) =>
        blogId.toString(),
      );
      assert(assignedUserBlogs.includes(createdBlog.id));
    });

    test("returns 400 if url property is missing", async () => {
      const blog = {
        title: "Dummy post",
        author: "post post",
        likes: 7,
      };
      await api
        .post("/api/blogs")
        .set("Authorization", tokenString)
        .send(blog)
        .expect(400);
    });

    test("returns 400 if title property is missing", async () => {
      const blog = {
        author: "post post",
        url: "dummy-post",
        likes: 7,
      };
      await api
        .post("/api/blogs")
        .set("Authorization", tokenString)
        .send(blog)
        .expect(400);
    });

    test("returns 400 if url and title properties are missing", async () => {
      const blog = {
        author: "post post",
        likes: 7,
      };
      await api
        .post("/api/blogs")
        .set("Authorization", tokenString)
        .send(blog)
        .expect(400);
    });
  });

  describe.only("deleting the blog)", () => {
    let createdBlogId = null;
    before(getTokenString);
    beforeEach(async () => {
      const blog = {
        title: "Dummy post",
        author: "post post",
        url: "dummy-post",
        likes: 7,
      };
      const response = await api
        .post("/api/blogs")
        .set("Authorization", tokenString)
        .send(blog);
      const blogToBeDeleted = response.body;
      createdBlogId = blogToBeDeleted.id;
    });
    test("succeeds and returns 204 if the blog is found", async () => {
      const blogsBefore = await blog_helper.blogsInDb();
      const blogId = createdBlogId;
      await api
        .delete(`/api/blogs/${blogId}`)
        .set("Authorization", tokenString)
        .expect(204);
      const blogsAfter = await blog_helper.blogsInDb();
      const blogIds = blogsAfter.map((blog) => blog.id);
      assert.strictEqual(blogsBefore.length - 1, blogsAfter.length);
      assert(!blogIds.includes(blogId));
    });
    test("returns 204 even if there is no blog with the corresponding id", async () => {
      const noExistId = await blog_helper.nonExistingId();
      await api
        .delete(`/api/blogs/${noExistId}`)
        .set("Authorization", tokenString)
        .expect(204);
    });

    test("returns 400 if id is malformatted", async () => {
      await api
        .delete("/api/blogs/random-bullshit")
        .set("Authorization", tokenString)
        .expect(400);
    });
  });

  describe("updating the blog", () => {
    test("succeeds when the blog is found and there is a full body of blog", async () => {
      const blogs = await blog_helper.blogsInDb();
      const blogToUpdate = blogs[0];
      const id = blogToUpdate.id;

      await api
        .put(`/api/blogs/${id}`)
        .send({
          title: "updated title",
          url: "updated-title",
          author: "test-test",
          likes: 0,
        })
        .expect(200);
      const blogsAfter = await blog_helper.blogsInDb();
      const blogUpdated = blogsAfter.find((blog) => blog.id === id);
      assert(blogUpdated);
      assert.strictEqual(blogUpdated.title, "updated title");
    });

    test("returns 404 if id is not found", async () => {
      const falseId = await blog_helper.nonExistingId();

      await api
        .put(`/api/blogs/${falseId}`)
        .send({
          title: "updated title",
          url: "updated-title",
          author: "test-test",
          likes: 0,
        })
        .expect(404);
    });

    test("returns 400 if id is malformatted", async () => {
      await api
        .put("/api/blogs/random-bullshit")
        .send({
          title: "updated title",
          url: "updated-title",
          author: "test-test",
          likes: 0,
        })
        .expect(400);
    });

    test("returns 400 if blog does not contain url or title or author properties", async () => {
      const blogs = await blog_helper.blogsInDb();
      const blogToUpdate = blogs[0];
      const id = blogToUpdate.id;

      await api
        .put(`/api/blogs/${id}`)
        .send({
          title: "updated title",
          likes: 0,
        })
        .expect(400);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
