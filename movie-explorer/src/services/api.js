const API_KEY = "f030bdd9ebdfee8ee91697db05bac8ad"
const BASE_URL = "https://api.themoviedb.org/3"

// Builds a TMDB URL with the API key and any optional query parameters.
const buildUrl = (path, queryParams = {}) => {
    const url = new URL(`${BASE_URL}${path}`)
    url.searchParams.set("api_key", API_KEY)

    Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            url.searchParams.set(key, value)
        }
    })

    return url.toString()
}

// Sends a request to TMDB, checks for HTTP/API errors, and returns parsed JSON.
const requestJson = async (path, queryParams = {}) => {
    const response = await fetch(buildUrl(path, queryParams))

    if (!response.ok) {
        throw new Error(`TMDB request failed with status ${response.status}`)
    }

    const data = await response.json()

    if (data?.success === false) {
        throw new Error(data.status_message || "TMDB request failed")
    }

    return data
}

// Fetches the current popular movies list for the home page.
export const getPopularMovies = async () => {
    const data = await requestJson("/movie/popular")
    return data.results ?? []
}

// Searches TMDB for movies that match the user's query.
export const searchMovies = async (query) => {
    const data = await requestJson("/search/movie", { query })
    return data.results ?? []
}

// Fetches a single movie's details for the modal or detail view.
export const getMovieDetails = async (movieId) => {
    const data = await requestJson(`/movie/${movieId}`)

    return {
        id: data.id,
        title: data.title,
        overview: data.overview,
        poster_path: data.poster_path,
        release_date: data.release_date,
        runtime: data.runtime,
        vote_average: data.vote_average,
        genres: data.genres ?? [],
        homepage: data.homepage,
        tagline: data.tagline,
        status: data.status,
    }
}