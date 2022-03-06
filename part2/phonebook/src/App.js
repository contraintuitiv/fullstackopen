import { useState } from 'react'

const initialpersons = [
  { name: 'Arto Hellas' }
]

const Filter = ({handleChange}) => <div>filter by: <input onChange={handleChange} /></div>
const Person = ({person}) => <li>{person.name}<br /><i>{person.number}</i></li>

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

const Persons = ({persons}) => {
  return(
  <ul>
    {persons.map((person) => <Person key={person.name} person={person} />)}
  </ul>)
}

const App = () => {
  const [persons, setPersons] = useState(initialpersons) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    if(persons.find((person) => person.name==newName)){
      alert (`${newName} is already in the list`)
    }else{
      setPersons(persons.concat({name: newName, number: newNumber}))
      setNewName('')
      setNewNumber('')
    }
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)

  const handleFilterChange = (event) => {    
    setFilter(event.target.value)
  }

  const shownPersons = persons.filter(
      (person) => person.name.toLowerCase().includes(filter.toLocaleLowerCase())
    )

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter handleChange={handleFilterChange} />
      
      <h3>add new person</h3>
      <PersonForm 
        newName={newName} 
        newNumber={newNumber} 
        handleNameChange={handleNameChange} 
        handleNumberChange={handleNumberChange} 
        addPerson={addPerson}
      />

      <h2>Numbers</h2>
      <Persons persons={shownPersons} />
    </div>
  )
}

export default App