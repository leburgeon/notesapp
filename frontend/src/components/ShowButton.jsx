const ShowButton = ({ showAll, setShowAll }) => {
  return (
    <button onClick={() => setShowAll(!showAll)}>
          show {showAll? 'important' : 'all'}
    </button>
  )
}

export default ShowButton