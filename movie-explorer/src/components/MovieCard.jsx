import "../styles/MovieCard.css"
import { useMovieContext } from "../contexts/MovieContext"

function MovieCard({movie}) {

    const {favorites, addToFavorites, removeFromFavorites, isFavorited} = useMovieContext()

    const favorite = isFavorited(movie.id)

    // TODO: Add an onSelect prop if you want clicking the card to open a movie details modal.
    // Keep the favorite button separate so it does not trigger the modal.

    const onFavoriteClick = (e) => {
        e.preventDefault()
        if (favorite) removeFromFavorites(movie.id)
        else addToFavorites(movie)
    }

    return (
        <div className="movie-card">
            {/* TODO: Wrap the poster/info area in a card click handler when you add the details view. */}
            <div className="movie-poster">
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title}/>
                <div className="movie-overlay">
                    <button className={`favorite-btn ${favorite? "active" : ""}`} onClick={onFavoriteClick}>
                        ♡
                    </button>
                </div>
            </div>
            <div className="movie-info">
                    <h3>{movie.title}</h3>
                    <p>{movie.release_date.substring(0, 4)}</p>
                    {/* TODO: Add rating, genre, or runtime here only if you pass that data into the card. */}
            </div>
        </div>
    )
}

export default MovieCard;