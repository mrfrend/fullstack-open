require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Phonebook = require('./models/phonebook')

const app = express()

morgan.token('body', (req) => { return JSON.stringify(req.body) })

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(morgan('tiny', {
  skip: (req) => req.method === 'POST'
}))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {
  skip: (req) => req.method !== 'POST'
}))

const errorMiddleware = (error, request, response, next) => {
  console.log(error.message)
  if (error.name === 'CastError') {
    response.status(400).json({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    response.status(400).json({ error: error.message })
  }
  next(error)
}

const PORT = process.env.PORT || 3001

let persons = [
  {
    'id': '1',
    'name': 'Arto Hellas',
    'number': '040-123456'
  },
  {
    'id': '2',
    'name': 'Ada Lovelace',
    'number': '39-44-5323523'
  },
  {
    'id': '3',
    'name': 'Dan Abramov',
    'number': '12-43-234345'
  },
  {
    'id': '4',
    'name': 'Mary Poppendieck',
    'number': '39-23-6423122'
  }
]

app.get('/api/persons', (req, res) => {
  Phonebook.find({}).then(phonebooks => {
    res.json(phonebooks)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id

  Phonebook.findById(id).then(phonebook => {
    if (phonebook) {
      res.json(phonebook)
    } else {
      res.status(404).end()
    }
  }).catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const { name, number } = req.body

  Phonebook.findById(id).then(phonebook => {
    if (!phonebook) {
      return res.status(404).end()
    }
    phonebook.name = name
    phonebook.number = number

    return phonebook.save().then(updatedPhonebook => {
      res.json(updatedPhonebook)
    })
  }).catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  const person = new Phonebook({ name: body.name, number: body.number })

  person.save().then(() => {
    res.json(person)
  }).catch(err => next(err))

})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Phonebook.findByIdAndDelete(id).then(() => {
    res.status(204).end()
  }).catch(err => next(err))
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
app.use(errorMiddleware)


app.listen(3001, () => {
  console.log('Server listening on port:', PORT)
})