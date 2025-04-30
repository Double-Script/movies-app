import React from 'react'

const Search = ({ searchTerm, setSearchTerm}) => {
  return (
    <div>
      <div className= "search">
        <div>
            <img src="./search.svg" alt="search" />
            <input type="text"
                placeholder='Search Through thousand of movies'
                value={searchTerm}
                onChange={(event)=>setSearchTerm(event.target.value)}
             />
        </div>
      </div>
    </div>
  )
}

export default Search
