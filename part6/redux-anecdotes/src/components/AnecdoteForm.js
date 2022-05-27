import { useDispatch } from "react-redux";
import { createAnecdote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const addAnecdote = (event) => {
        event.preventDefault();
    
        dispatch(createAnecdote(event.target.anecdote.value))

        dispatch(setNotification(`new anecdote created`))
        window.setTimeout(() => dispatch(setNotification('')), 5000)
 
        event.target.anecdote.value=""
      }
    

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={addAnecdote}>
            <div><input name="anecdote" /></div>
            <button type="submit">create</button>
            </form>
        </div>
    )
}

export default AnecdoteForm