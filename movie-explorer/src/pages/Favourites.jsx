import "../styles/Favorites.css"
import { useMovieContext } from "../contexts/MovieContext"
import MovieCard from "../components/MovieCard"

function Favourites(){

    const {favorites} = useMovieContext()

    if (favorites.length > 0) {
        return(
            <div className="favorites">
                <h3>Your Favourites</h3>
                <div className="movie-grid">
                    {favorites.map( (movie) => <MovieCard movie={movie} key={movie.id}/>)}
                </div> 
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