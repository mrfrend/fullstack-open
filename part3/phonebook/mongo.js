const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('password required')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@phonebook.qiqlhra.mongodb.net/phonebooks_db?retryWrites=true&w=majority&appName=phonebook`

mongoose.set('strictQuery', true)
mongoose.connect(url, { family: 4 })

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Phonebook = mongoose.model('Phonebook', phonebookSchema)

if (process.argv.length === 3) {
  Phonebook.find({}).then(result => {
    result.forEach(phonebook => {
      console.log(phonebook)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  console.log('process args', process.argv)
  const name = process.argv[3]
  const number = process.argv[4]

  const newPhonebook = new Phonebook({ name: name, number: number })
  newPhonebook.save().then(() => {
    console.log(`added ${name} ${number} to phonebook`)
    mongoose.connection.close()
  }).catch(err => {
    console.log('could not save new entry, error:', err)
    mongoose.connection.close()
  })
}