require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(express.static('build'))


// Middleware
app.use(express.json())

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons/', (request, response) => {
  Person.find({})
    .then( persons => response.json(persons) )
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then ( person => { response.json(person) } )
    .catch(error => next(error))
})

app.post('/api/persons/', (request, response, next) => {
  const body = request.body

  Person.findOne({ name: body.name })
    .then ( person => {
      if(person){
        console.log('name already exists')
        response.status(422).end()

      }else{

        const newPerson = new Person ({
          name : body.name,
          number : body.number
        })

        newPerson.save().then(() => {
          console.log('newPerson', newPerson)
          response.json(newPerson)
        })
          .catch (error => next(error))

      }
    })



})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = ({
    name : body.name,
    number : body.number
  })

  Person.findByIdAndUpdate(request.params.id, person, { new:true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch ( error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then( () => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if(error.name === 'CastError'){
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`))