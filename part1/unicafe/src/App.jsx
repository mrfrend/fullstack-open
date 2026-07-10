import { useState } from 'react'

const Button = ({ text, onClick }) => <button onClick={onClick}>{text}</button>;
const StatisticLine = ({ text, value }) => <tr><td>{text}</td><td>{value}</td></tr>;

const Statistics = ({ good, bad, neutral }) => {
  const all = good + bad + neutral;
  let positivePercent = 0;
  let average = 0;
  if (all === 0) {
    return <p>No feedback given</p>
  }
  average = (good - bad) / all;
  positivePercent = good / all * 100;
  return <table>
    <StatisticLine text='good' value={good} />
    <StatisticLine text='neutral' value={neutral} />
    <StatisticLine text='bad' value={bad} />
    <StatisticLine text='all' value={all} />
    <StatisticLine text='average' value={average} />
    <StatisticLine text='positive' value={positivePercent + '%'} />
  </table>
}
const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => setGood(good + 1);
  const handleNeutralClick = () => setNeutral(neutral + 1);
  const handleBadClick = () => setBad(bad + 1);

  return (
    <div>
      <h2>give feedback</h2>
      <Button text='good' onClick={handleGoodClick} />
      <Button text='neutral' onClick={handleNeutralClick} />
      <Button text='bad' onClick={handleBadClick} />
      <h2>
        statistics
      </h2>
      <Statistics good={good} bad={bad} neutral={neutral} />
    </div>
  )
}

export default App