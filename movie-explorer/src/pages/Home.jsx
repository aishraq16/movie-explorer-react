import MovieCard from "../components/MovieCard"
import { useState } from "react"
import "../styles/Home.css"

function Home(){
    const [searchQuery, setSearchQuery] = useState("")
    
    const handleSearch = () => {
        alert(searchQuery)
    } 

    const handleChange = (e) => {
        e.preventDefault() //so the search string does not disappear from the searc box
        setSearchQuery(e.target.value)
    }

    const movies = [
        {id: 1, title: "The Godfather", release_date: "1972"},
        {id: 2, title: "The Shawshank Redemption", release_date: "1994"},
        {id: 3, title: "Inglourious Basterds", release_date: "2009"}
    ]

    return (
        <div className="home">
            <form className="search-form" onSubmit={handleSearch}>
                <input type="text" className="input-search" value={searchQuery} onChange={handleChange} placeholder="Search For A Movie..." />
                <button type="submit" className="search-button">Search</button>
            </form>
            <div className="movie-grid">
                {movies.map( (movie) => (movie.title.toLowerCase().startsWith(searchQuery) && <MovieCard movie={movie} key={movie.id}/>))}
            </div>
        </div>
    )
}

export default Home;