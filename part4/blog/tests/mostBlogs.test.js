const { test, describe } = require('node:test')
const assert = require('node:assert')
const { mostBlogs } = require('../utils/list_helper')

describe('most blogs', () => {
	test("of one author equals the array's length", () => {
		const blogs = [{
			title: "My first post",
			author: "Ivan Deshchenko",
			url: "my-first-post",
			likes: 4
		},
		{
			title: "My daily life",
			author: "Ivan Deshchenko",
			url: "my-daily-life",
			likes: 2
		}
		]
		const result = mostBlogs(blogs)
		assert.deepStrictEqual(result, { author: 'Ivan Deshchenko', blogs: blogs.length })
	})

	test("of empty list equals null", () => {
		const blogs = []
		const result = mostBlogs(blogs)
		assert.strictEqual(result, null)
	})

	test("of different authors calculated right", () => {
		const blogs = [{
			title: "My first post",
			author: "Ivan Deshchenko",
			url: "my-first-post",
			likes: 4
		},
		{
			title: "My daily life",
			author: "Ivan Deshchenko",
			url: "my-daily-life",
			likes: 2
		},
		{
			title: "Music and cash",
			author: "Peter Deshchenko",
			url: "music-and-cash",
			likes: 25
		},
		{
			title: "I got bitches - here's how",
			author: "Peter Deshchenko",
			url: "i-got-bitches-heres-how",
			likes: 15
		},
		{
			title: "My first post",
			author: "Peter Deshchenko",
			url: "my-first-post",
			likes: 4
		},
		{
			title: "Basketball and how to become stronger and taller",
			author: "Peter Deshchenko",
			url: "my-daily-life",
			likes: 2
		}]

		const result = mostBlogs(blogs)
		assert.deepStrictEqual(result, { author: 'Peter Deshchenko', blogs: 4 })
	})
})