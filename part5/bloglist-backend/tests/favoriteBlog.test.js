const { test, describe } = require('node:test')
const assert = require('node:assert')
const { favoriteBlog } = require('../utils/list_helper')

describe('favorite blog', () => {
	test('of an empty list equals null', () => {
		const blogs = []
		const result = favoriteBlog(blogs)
		assert.strictEqual(result, null)
	})

	test('of list with one blog equals itself', () => {
		const blog = {
			title: "My first post",
			author: "Ivan Deshchenko",
			url: "my-first-post",
			likes: 4
		}
		const blogs = [blog]
		const result = favoriteBlog(blogs)
		assert.deepStrictEqual(result, blog)
	})

	test('of a bigger list calculated right', () => {
		const mostPopularBlog = {
			title: "My first post",
			author: "Ivan Deshchenko",
			url: "my-first-post",
			likes: 7
		}
		const blogs = [mostPopularBlog, {
			title: "Another Post",
			author: "Ivan Deshchenko",
			url: "another-post",
			likes: 1
		}]
		const result = favoriteBlog(blogs)
		assert.deepStrictEqual(result, mostPopularBlog)
	})
})
