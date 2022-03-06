const Header = (props) => (
  <h1>{props.course}</h1>
)

const Part = (props) => (
  <p>{props.part} {props.exercisesAmount}</p>
)

const Content = ({course}) => {

  return (
    <div>
      { course.parts.map(part => <Part key={part.id} part={part.name} exercisesAmount={part.exercises} />) }
    </div>
  )
}
  

const Total = (props) => {
  return (
    <p>Anzahl von Aufgaben {props.sum}</p>
  )

}

const Course = ({course}) => {
  const total = course.parts.reduce((sum, part) => sum + part.exercises, 0)

  return (
    <div>
      <Header course={course.name} />
      <Content course={course} />
      <Total sum={total} />
    </div>)
}


const App = () => {
  const courses = [{
    id: 1,
    name: 'Half Stack application development',
    parts: [
    {
      name: 'Fundamentals of React',
      exercises: 10,
      id: 1,
    },
    {
      name: 'Using props to pass data',
      exercises: 21,
      id: 2,
    },
    {
      name: 'State of a component',
      exercises: 9,
      id: 3,
    },
    {
      name: 'Spaß',
      exercises: 2,
      id: 4,
    }
  ]
},

{
  id: 2,
  name: 'Funktionales Programmieren',
  parts: [
    {
      name: 'Lektion 1',
      exercises: 12,
      id:1
    },
    {
      name: 'Lektion 2',
      exercises: 9,
      id:2
    },
  ]
}

]

  return (
    <div>
      {courses.map(course => <Course course={course} />)}
    </div>
  )
}

export default App