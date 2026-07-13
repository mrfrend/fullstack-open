const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
morgan.token('body', (req, res) => { return JSON.stringify(req.body) })

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(morgan('tiny', {
	skip: (req, res) => req.method === 'POST'
}))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {
	skip: (req, res) => req.method !== 'POST'
}))

const generateId = () => {
	return String(Math.floor(Math.random() * 100_000_000))
}

const PORT = process.env.PORT || 3001;

let persons = [
	{
		"id": "1",
		"name": "Arto Hellas",
		"number": "040-123456"
	},
	{
		"id": "2",
		"name": "Ada Lovelace",
		"number": "39-44-5323523"
	},
	{
		"id": "3",
		"name": "Dan Abramov",
		"number": "12-43-234345"
	},
	{
		"id": "4",
		"name": "Mary Poppendieck",
		"number": "39-23-6423122"
	}
]

app.get('/api/persons', (req, res) => {
	res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
	const id = req.params.id;
	const person = persons.find(person => person.id === id);

	if (person) {
		res.json(person)
	} else {
		res.status(404).end()
	}
})

app.post('/api/persons', (req, res) => {
	const body = req.body;

	if (!body.name) {
		return res.status(400).json({ error: 'name required' })
	}

	if (!body.number) {
		return res.status(400).json({ error: 'number required' })
	}

	const person = {
		number: body.number,
		name: body.name,
		id: generateId()
	}

	persons = persons.concat(person)

	res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
	const id = req.params.id
	persons = persons.filter(person => person.id !== id);
	res.status(204).end()
})

app.get('/info', (req, res) => {
	const peopleAmount = persons.length
	const now = new Date().toString()
	res.send(`<p>Phonebook has info for ${peopleAmount} people</p> <p>${now}</p>`)
})

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


app.listen(3001, () => {
	console.log("Server listening on port:", PORT)
})