const FilterComponent = (props) => {
  // const { filterText } = props
  return (
    <>
      <input
        type='text'
        name='fullName'
        value={props.filterText}
        placeholder='Search By Name'
        onChange={(e) => props.onFilter(e)}
      />
      <button type='button' className='btn btn-primary' onClick={props.onClear}>
        X
      </button>
    </>
  )
}

export default FilterComponent
