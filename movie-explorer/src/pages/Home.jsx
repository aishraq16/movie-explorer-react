import MovieCard from "../components/MovieCard"
import { useState, useEffect } from "react"
import "../styles/Home.css"
import { getAllMovies, getMovieDetails, searchMovies } from "../services/api" // getMovieDetails is used to load richer modal data.
import MovieDetailsModal from "../components/MovieDetailsModal" // Modal component rendered when a movie is selected.

const MOVIE_GENRES = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" },
]

function Home(){
    const [searchQuery, setSearchQuery] = useState("")
    const [movies, setMovies] = useState([]) //when we update movies array react will automatically render the component
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedGenre, setSelectedGenre] = useState("")
    const [releaseYear, setReleaseYear] = useState("")
    const [filteredMovies, setFilteredMovies] = useState([])
    const [selectedMovie, setSelectedMovie] = useState(null) // Holds current movie shown in modal; null means modal is closed.
    const [isModalLoading, setIsModalLoading] = useState(false) // Tracks whether detailed modal data is still loading.

    // Initial page load now pulls from discover pages instead of only popular movies.
    useEffect( () => {
        const loadMovies = async () => {
            try {
                const allMovies = await getAllMovies()
                setMovies(allMovies)
            } catch (err) {
                setError("Failed to load movies...")
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
        loadMovies()
    }, []) //useEffect will run when the dependency array changes

    useEffect(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase() //remove whitespaces and make lowercase
        const genreId = selectedGenre ? Number(selectedGenre) : null
        const normalizedYear = releaseYear.trim() //remove whitespaces

        // Apply all active filters together so search, genre, and year work in combination.
        const nextMovies = movies.filter((movie) => {
            const matchesSearch = !normalizedQuery || movie.title.toLowerCase().includes(normalizedQuery)
            const matchesGenre = !genreId || movie.genre_ids?.includes(genreId)
            const matchesYear = !normalizedYear || movie.release_date?.startsWith(normalizedYear)
            return matchesSearch && matchesGenre && matchesYear
        })

        setFilteredMovies(nextMovies)
    }, [movies, searchQuery, selectedGenre, releaseYear])

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
    } 

    const handleChange = (e) => {
        e.preventDefault() //so the search string does not disappear from the search box
        setSearchQuery(e.target.value) //changes searchQuery
    }

    const handleGenreChange = (e) => {
        setSelectedGenre(e.target.value)
    }

    const handleReleaseYearChange = (e) => {
        const value = e.target.value

        // Release year filter accepts YYYY format only.
        if (value.length > 4) return
        setReleaseYear(value)
    }

    /* const movies = [
        {id: 1, title: "The Godfather", release_date: "1972"},
        {id: 2, title: "The Shawshank Redemption", release_date: "1994"},
        {id: 3, title: "Inglourious Basterds", release_date: "2009"}
    ] */

    const handleMovieSelect = async (movie) => {
        setSelectedMovie(movie) // Open modal immediately with basic card/list data.
        setIsModalLoading(true) // Show loading state while we fetch full movie details.

        try {
            const movieDetails = await getMovieDetails(movie.id) // Request richer movie data (runtime, full genres, etc.).
            setSelectedMovie(movieDetails) // Replace basic movie with detailed response once loaded.
        } catch (err) {
            console.log("Failed to load selected movie details", err) // Keep modal open with fallback/basic info if request fails.
        } finally {
            setIsModalLoading(false) // End loading state whether request succeeds or fails.
        }
    }

    const handleCloseModal = () => {
        setSelectedMovie(null) // Clear selected movie and close modal.
        setIsModalLoading(false) // Reset loading state to avoid stale spinner text.
    }
    
    return ( //based on the state change, the part below will update and re-render
        <div className="home">
            <form className="search-form" onSubmit={handleSearch}>
                <input type="text" 
                className="search-input" 
                value={searchQuery} //this locks the component to useState
                onChange={handleChange} //
                placeholder="Search For A Movie..." />
                <div className="filters-row">
                    <div className="form-control-group">
                        <label className="filter-label" htmlFor="genre">Genre</label>
                        <select className="filter-select" name="genre" id="genre" value={selectedGenre} onChange={handleGenreChange}>
                            <option value="">All Genres</option>
                            {MOVIE_GENRES.map((genre) => (
                                <option key={genre.id} value={genre.id}>
                                    {genre.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-control-group">
                        <label className="filter-label" htmlFor="release-year">Release Year</label>
                        <input
                            className="year-input"
                            id="release-year"
                            name="release-year"
                            type="number"
                            min="1900"
                            max="2099"
                            inputMode="numeric"
                            placeholder="e.g. 2024"
                            value={releaseYear}
                            onChange={handleReleaseYearChange}
                        />
                    </div>
                </div>
                <button type="submit" className="search-button">Search</button>
            </form>
            {error && <div className="error-message">{error}</div>}
            {loading ? ( 
                <div className="loading">Loading ... </div>
                ) : (
            <div className="movie-grid">
                {filteredMovies.map((movie) => <MovieCard movie={movie} key={movie.id} onSelect={handleMovieSelect}/>)} {/* Pass select handler so each card can request modal open. */}
            </div> )}
            {selectedMovie && <MovieDetailsModal movie={selectedMovie} onClose={handleCloseModal} isLoading={isModalLoading}/>} {/* Render modal only when a movie is selected. */}
        </div>
    )
}

export default Home; 