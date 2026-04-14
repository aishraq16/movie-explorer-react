import "../styles/MovieCard.css"
import { useMovieContext } from "../contexts/MovieContext"

function MovieCard({movie, onSelect}) {

    const {addToFavorites, removeFromFavorites, isFavorited} = useMovieContext()

    const favorite = isFavorited(movie.id)

    const onFavoriteClick = (e) => {
        e.preventDefault() // Prevent any default click behavior on the button element.
        e.stopPropagation() // Stop this click from bubbling up to the card and opening the modal.
        if (favorite) removeFromFavorites(movie.id) // If already favorited, remove this movie.
        else addToFavorites(movie) // Otherwise, add this movie to favorites.
    }

    const handleSelectedMovie = () => {
        onSelect?.(movie) // Call parent callback (if provided) and pass the clicked movie.
    }

    return (
        <div className="movie-card" onClick={handleSelectedMovie}> {/* Make the whole card clickable to select/open details. */}
            <div className="movie-poster">
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title}/>
                <div className="movie-overlay">
                    <button type="button" className={`favorite-btn ${favorite? "active" : ""}`} onClick={onFavoriteClick}> {/* Explicit button type prevents accidental form submission. */}
                        ♡
                    </button>
                </div>
            </div>
            <div className="movie-info">
                    <h3>{movie.title}</h3>
                    <p>{movie.release_date?.substring(0, 4) || "Unknown"}</p> {/* Safely show release year with fallback when date is missing. */}
            </div>
        </div>
    )
}

export default MovieCard;