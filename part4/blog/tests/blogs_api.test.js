const app = require("../app");
const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const Blog = require("../models/blog");
const helper = require("./test_helper");
const mongoose = require("mongoose");

const api = supertest(app);

describe("when there is initially some blogs saved", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialDb);
  });

  test("blogs are returned", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("blogs are returned with correct length", async () => {
    const response = await api.get("/api/blogs").expect(200);
    assert.strictEqual(response.body.length, helper.initialDb.length);
  });

  test("blogs have the unique property id", async () => {
    const response = await api.get("/api/blogs").expect(200);
    const firstBlog = response.body[0];
    const firstBlogAtDb = (await helper.blogsInDb())[0];

    assert(firstBlog.id);
    assert(firstBlogAtDb.id);
    assert.strictEqual(firstBlog.id, firstBlogAtDb.id);
  });

  describe("creating a new blog", () => {
    test("succeeds with correct data", async () => {
      const blog = {
        title: "Dummy post",
        author: "post post",
        url: "dummy-post",
        likes: 7,
      };

      await api
        .post("/api/blogs")
        .send(blog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const response = await api.get("/api/blogs");

      const titles = response.body.map((blog) => blog.title);
      assert.strictEqual(response.body.length, helper.initialDb.length + 1);
      assert(titles.includes("Dummy post"));
    });
    test("makes likes property equals to zero if it is not found in body", async () => {
      const blog = {
        title: "Dummy post",
        author: "post post",
        url: "dummy-post",
      };

      await api.post("/api/blogs").send(blog).expect(201);

      const response = await api.get("/api/blogs").expect(200);
      assert.strictEqual(response.body.length, helper.initialDb.length + 1);
      const createdBlog = response.body[helper.initialDb.length];
      assert(createdBlog.likes === 0);
    });

    test("returns 400 if url property is missing", async () => {
      const blog = {
        title: "Dummy post",
        author: "post post",
        likes: 7,
      };
      await api.post("/api/blogs").send(blog).expect(400);
    });

    test("returns 400 if title property is missing", async () => {
      const blog = {
        author: "post post",
        url: "dummy-post",
        likes: 7,
      };
      await api.post("/api/blogs").send(blog).expect(400);
    });

    test("returns 400 if url and title properties are missing", async () => {
      const blog = {
        author: "post post",
        likes: 7,
      };
      await api.post("/api/blogs").send(blog).expect(400);
    });
  });

  describe("deleting the blog)", () => {
    test("succeeds and returns 204 if the blog is found", async () => {
      const blogsBefore = await helper.blogsInDb();
      const blogId = blogsBefore[1].id;
      await api.delete(`/api/blogs/${blogId}`).expect(204);
      const blogsAfter = await helper.blogsInDb();
      const blogIds = blogsAfter.map((blog) => blog.id);
      assert.strictEqual(blogsBefore.length - 1, blogsAfter.length);
      assert(!blogIds.includes(blogId));
    });
    test("returns 204 even if there is no blog with the corresponding id", async () => {
      const noExistId = await helper.nonExistingId();
      await api.delete(`/api/blogs/${noExistId}`).expect(204);
    });

    test("returns 400 if id is malformatted", async () => {
      await api.delete("/api/blogs/random-bullshit").expect(400);
    });
  });

  describe("updating the blog", () => {
    test("succeeds when the blog is found and there is a full body of blog", async () => {
      const blogs = await helper.blogsInDb();
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
      const blogsAfter = await helper.blogsInDb();
      const blogUpdated = blogsAfter.find((blog) => blog.id === id);
      assert(blogUpdated);
      assert.strictEqual(blogUpdated.title, "updated title");
    });

    test("returns 404 if id is not found", async () => {
      const falseId = await helper.nonExistingId();

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
      const blogs = await helper.blogsInDb();
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
