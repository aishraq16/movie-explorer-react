import "../styles/MovieDetailsModal.css" // Import styles dedicated to modal layout and appearance.
import { createPortal } from "react-dom"

const formatRuntime = (runtime) => {
    if (!runtime || runtime <= 0) return "Unknown" // Fallback when API does not provide runtime.

    const hours = Math.floor(runtime / 60) // Convert total minutes into whole hours.
    const minutes = runtime % 60 // Get remaining minutes after full hours are removed.
    return `${hours}h ${minutes}m` // Return human-readable duration text.
}

function MovieDetailsModal({ movie, onClose, isLoading = false }) {
    if (!movie) return null

    const genreNames = (movie.genres ?? []).map((genre) => genre.name).filter(Boolean) // Build genre name list and remove empty values.
    const voteAverage = typeof movie.vote_average === "number" ? movie.vote_average.toFixed(1) : "N/A" // Show one decimal place when rating exists.

    return createPortal(
        <div className="movie-modal" onClick={onClose}> {/* Clicking backdrop closes modal. */}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}> {/* Prevent backdrop close when clicking inside panel. */}
                <button type="button" className="close" onClick={onClose} aria-label="Close details modal"> {/* Accessible close button. */}
                    &times;
                </button>

                <div className="modal-header">
                    <h2>{movie.title}</h2> {/* Display selected movie title. */}
                    <p>{movie.release_date?.substring(0, 4) || "Unknown release year"}</p> {/* Show release year with fallback. */}
                </div>

                <div className="modal-stats">
                    <span><strong>Runtime:</strong> {formatRuntime(movie.runtime)}</span> {/* Runtime is formatted from minutes to hours/minutes. */}
                    <span><strong>Rating:</strong> {voteAverage}</span> {/* vote_average from TMDB detail response. */}
                </div>

                <div className="modal-genres">
                    <strong>Genres:</strong> {/* Genre section heading. */}
                    {genreNames.length ? (
                        <ul>
                            {genreNames.map((genre) => (
                                <li key={genre}>{genre}</li> // Render each genre as a chip.
                            ))}
                        </ul>
                    ) : (
                        <p>{isLoading ? "Loading genres..." : "Genres unavailable"}</p> // Loading/fallback message when genres are missing.
                    )}
                </div>

                <div className="modal-overview">
                    <strong>Overview:</strong> {/* Overview section heading. */}
                    <p>{movie.overview || "No overview available."}</p> {/* Plot summary with fallback text. */}
                </div>
            </div>
        </div>,
        document.body
    )
}

export default MovieDetailsModal