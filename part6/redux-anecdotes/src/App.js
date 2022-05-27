import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter'
import Notification from './components/Notification'

const App = () => {

  return (
    <div>
      <h5>
        <Notification />
      </h5>
      <h2>Anecdotes</h2>

      <Filter />
      <AnecdoteForm /><br />
      <AnecdoteList />

    </div>
  )
}

export default App