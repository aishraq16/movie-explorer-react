import "../styles/Favorites.css"
import { useState } from "react"
import { useMovieContext } from "../contexts/MovieContext"
import MovieCard from "../components/MovieCard"
import MovieDetailsModal from "../components/MovieDetailsModal"
import { getMovieDetails } from "../services/api"

function Favourites(){

    const {favorites} = useMovieContext()
    const [selectedMovie, setSelectedMovie] = useState(null)
    const [isModalLoading, setIsModalLoading] = useState(false)

    const handleMovieSelect = async (movie) => {
        setSelectedMovie(movie)
        setIsModalLoading(true)

        try {
            const movieDetails = await getMovieDetails(movie.id)
            setSelectedMovie(movieDetails)
        } catch (err) {
            console.log("Failed to load selected movie details", err)
        } finally {
            setIsModalLoading(false)
        }
    }

    const handleCloseModal = () => {
        setSelectedMovie(null)
        setIsModalLoading(false)
    }

    if (favorites.length > 0) {
        return(
            <div className="favorites">
                <h3>Your Favourites</h3>
                <div className="movie-grid">
                    {favorites.map((movie) => <MovieCard movie={movie} key={movie.id} onSelect={handleMovieSelect}/>)}
                </div> 
                {selectedMovie && <MovieDetailsModal movie={selectedMovie} onClose={handleCloseModal} isLoading={isModalLoading}/>}
            </div>
        )
    }
    else {
        return <div className="favorites-empty">
            <h2>Favourite Movies</h2>
            <p>Start adding movies in your favourites and they will appear here</p>
        </div>
    }

}

export default Favourites