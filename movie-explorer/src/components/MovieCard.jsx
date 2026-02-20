import "../styles/MovieCard.css"

function MovieCard({movie}) {

    const onFavouriteClick = () => {
        alert("clicked!")
    }

    return (
        <div className="movie-poster">
            <img src={movie.url} alt={movie.title}/>
            <div className="movie-overlay">
                <button className="favorite-btn" onClick={onFavouriteClick}>
                    ♡
                </button>
            </div>
            <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>{movie.release_date}</p>
            </div>
        </div>
    )
}

export default MovieCard;