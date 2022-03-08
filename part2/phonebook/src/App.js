import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'

const Filter = ({handleChange}) => <div>filter by: <input onChange={handleChange} /></div>
const Person = ({person, deletePerson}) => (
  <li className='person'>
    {person.name} &middot; <i>{person.number}</i> &middot; <button onClick={deletePerson}>delete</button>
  </li>)

const PersonForm = (props) => {
  return(<form>
    <div>
      name: <input value={props.newName} onChange={props.handleNameChange} /><br />
      number: <input value={props.newNumber} onChange={props.handleNumberChange} />
    </div>
    <div>
      <button type="submit" onClick={props.addPerson}>add</button>
    </div>
  </form>)
}

const Persons = ({persons, deletePerson}) => {
  return(
  <ul>
    {persons.map((person) => <Person key={person.id} person={person} deletePerson={() => deletePerson(person.id, person.name)} />)}
  </ul>)
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect( () => {
    personService
      .getAll()
      .then(allPersons => setPersons(allPersons))
  }, [])



  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find((person) => person.name===newName)
    if(existingPerson){
      if(window.confirm (`${newName} is already in the phonebook, replace old number with new one?`)){
        const updatePerson = { ...existingPerson, number: newNumber}
        personService
          .update(existingPerson.id, updatePerson)
          .then( (updatedPerson) =>
            setPersons(persons.map(person => person.id === existingPerson.id ? updatePerson : person ))
          )
          .catch ( error => {
            setErrorMessage(`Data of ${existingPerson.name} was already deleted from server`)
            setTimeout(() => setErrorMessage(null), 5000)
            setPersons(persons.filter(person => person.id!==existingPerson.id))
          })
      }
    }else{
      const newPerson = {name: newName, number: newNumber}

      personService
        .create(newPerson)
        .then( createdPerson => {
          console.log('created', createdPerson)
          setPersons(persons.concat(createdPerson))
          setNewName('')
          setNewNumber('')
          setSuccessMessage(`Added ${createdPerson.name}`)
          setTimeout(() => setSuccessMessage(null), 5000)
        })
    }
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)

  const handleFilterChange = (event) => {    
    setFilter(event.target.value)
  }

  const deletePerson = (id, name) => {
    if(window.confirm(`Do you really want to delete ${name}`)){
      personService
        .remove(id)
        .then( () =>
          setPersons(persons.filter(person => person.id!==id))
        )
    }
  }

  const shownPersons = persons.filter(
      (person) => person.name.toLowerCase().includes(filter.toLocaleLowerCase())
    )

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter handleChange={handleFilterChange} />
      
      <h3>add new person</h3>
      <Notification message={successMessage} type="success" />
      <Notification message={errorMessage} type="error" />

      <PersonForm 
        newName={newName} 
        newNumber={newNumber} 
        handleNameChange={handleNameChange} 
        handleNumberChange={handleNumberChange} 
        addPerson={addPerson}
      />

      <h2>Numbers</h2>
      <Persons persons={shownPersons} deletePerson={deletePerson} />
    </div>
  )
}

export default App