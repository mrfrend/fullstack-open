const Notification = ({ message, isError }) => {
  const styles = {
    backgroundColor: 'grey',
    border: `8px solid ${isError ? 'red' : 'green'}`,
    borderRadius: '10px',
    padding: '15px',
    fontSize: '16px'
  }
  return (
    <div style={styles}>
      <p>{message}</p>
    </div>
  )
}

export default Notification
