const { test, describe } = require('node:test')
const assert = require('node:assert')
const { totalLikes, dummy } = require('../utils/list_helper')
describe('total likes', () => {
	test('of empty list is zero', () => {
		const blogs = [];
		const result = totalLikes(blogs)
		assert.strictEqual(result, 0)
	})

	test('when list has only one blog equals the likes of that', () => {
		const blogs = [{
			title: "My first post",
			author: "Ivan Deshchenko",
			url: "my-first-post",
			likes: 4
		}]
		const result = totalLikes(blogs)
		assert.strictEqual(result, 4)
	})

	test('of a bigger list calculated right', () => {
		const blogs = [{
			title: "My first post",
			author: "Ivan Deshchenko",
			url: "my-first-post",
			likes: 4
		},
		{
			title: "My second post",
			author: "Ivan Deshchenko",
			url: "my-second-post",
			likes: 6
		}]
		const result = totalLikes(blogs)
		assert.strictEqual(result, 10)
	})
})