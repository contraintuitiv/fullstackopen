const mongoose = require('mongoose')

if(process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://contra:${password}@cluster0.4x6uj.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length===3){
  console.log('all')
  Person.find({}).then(result => {
    result.map(person => {
      console.log(person)
    })
    mongoose.connection.close()
    process.exit(0)
  })
}


if(process.argv.length===5){
  console.log('create')
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
    process.exit(0)
  })

}