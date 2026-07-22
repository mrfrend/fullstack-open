const dummy = (blogs) => {
	return 1;
}

const totalLikes = (blogs) => {
	let total = 0;
	for (let blog of blogs) {
		total += blog.likes
	}
	return total
}

const favoriteBlog = (blogs) => {
	let mostLikedBlog = blogs[0] || null;

	for (let blog of blogs) {
		if (blog.likes > mostLikedBlog?.likes) {
			mostLikedBlog = blog
		}
	}

	return mostLikedBlog
}

const mostBlogs = (blogs) => {
	if (!blogs || blogs.length === 0) {
		return null
	}

	const counts = blogs.reduce((acc, { author }) => {
		acc[author] = (acc[author] || 0) + 1
		return acc
	}, {})

	let maxAuthor = null
	let maxBlogs = 0
	for (const [author, count] of Object.entries(counts)) {
		if (count > maxBlogs) {
			maxAuthor = author
			maxBlogs = count
		}
	}

	return {
		author: maxAuthor,
		blogs: maxBlogs
	}
}

const mostLikes = (blogs) => {
	if (!blogs || blogs.length === 0) {
		return null
	}

	const counts = blogs.reduce((acc, { author, likes }) => {
		acc[author] = (acc[author] || 0) + likes
		return acc
	}, {})

	let maxAuthor = null
	let maxLikes = 0
	for (const [author, count] of Object.entries(counts)) {
		if (count > maxLikes) {
			maxAuthor = author
			maxLikes = count
		}
	}

	return {
		author: maxAuthor,
		likes: maxLikes
	}
}

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes
}