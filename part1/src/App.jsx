const Header = (props) => {
  return <h1>{props.course}</h1>
}

const Content = (props) => {
  return (
    <div>
      {props.parts.map((part, idx) => <Part key={idx} part={part.name} exercises={part.exercises} />)}
    </div>
  )
}

const Part = (props) => {
  return <p>
    {props.part} {props.exercises}
  </p>
}

const Total = (props) => {
  const total = props.parts.reduce((acc, part) => acc + part.exercises, 0);
  return <p>
    Number of exercises {total}
  </p>
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default App