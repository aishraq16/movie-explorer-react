import MovieCard from "../components/MovieCard"
import { useState, useEffect } from "react"
import "../styles/Home.css"
import { getPopularMovies, searchMovies } from "../services/api"
function Home(){
    const [searchQuery, setSearchQuery] = useState("")
    const [movies, setMovies] = useState([]) //when we update movies array react will automatically render the component
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect( () => {
        const loadPopularMovies = async () => {
            try {
                const popularMovies = await getPopularMovies()
                setMovies(popularMovies)
            } catch (err) {
                setError("Failed to load movies...")
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
        loadPopularMovies()
    }, []) //useEffect will run when the dependency array changes

    const handleSearch = async (e) => {
        e.preventDefault()

        if (!searchQuery.trim()) return

        setLoading(true)
        if (loading) return

        try {
            const searchResults = await searchMovies(searchQuery)   
            setMovies(searchResults)
            setError(null)
        } catch (err) {
            setError("Failed to load error...")
        } finally {
            setLoading(false)
        }
        alert(searchQuery)
    } 

    const handleChange = (e) => {
        e.preventDefault() //so the search string does not disappear from the search box
        setSearchQuery(e.target.value)
    }

    /* const movies = [
        {id: 1, title: "The Godfather", release_date: "1972"},
        {id: 2, title: "The Shawshank Redemption", release_date: "1994"},
        {id: 3, title: "Inglourious Basterds", release_date: "2009"}
    ] */

    return (
        <div className="home">
            <form className="search-form" onSubmit={handleSearch}>
                <input type="text" className="search-input" value={searchQuery} onChange={handleChange} placeholder="Search For A Movie..." />
                <button type="submit" className="search-button">Search</button>
            </form>
            {error && <div className="error-message">{error}</div>}
            {loading ? ( 
                <div className="loading">Loading ... </div>
                ) : (
            <div className="movie-grid">
                {movies.map( (movie) => (movie.title.toLowerCase().startsWith(searchQuery) && <MovieCard movie={movie} key={movie.id}/>))}
            </div> )}
        </div>
    )
}

export default Home;