const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		minLength: 2
	},
	author: {
		type: String,
		required: true,
		minLength: 1
	},
	url: {
		type: String,
		required: true,
		minLength: 5
	},
	likes: {
		type: Number,
		required: true,
		min: 0
	},
})

blogSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	}
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog;