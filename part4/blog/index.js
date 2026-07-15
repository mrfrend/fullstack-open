const express = require('express')
const mongoose = require('mongoose')
const { errorHandler, requestLogger, unknownEndpoint } = require('./utils/middleware')
const config = require('./utils/config')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')

const app = express()

logger.info('connecting to', config.MONGODB_URI)


mongoose.connect(config.MONGODB_URI, { family: 4 }).then(() => {
	logger.info('connected to mongodb')
}).catch(err => {
	logger.error('error connecting to database', err)
})

app.use(express.json())
app.use(requestLogger)

app.use('/api/blogs', blogsRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})

module.exports = app