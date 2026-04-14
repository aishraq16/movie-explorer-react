const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = "https://api.themoviedb.org/3"

// Builds a TMDB URL with the API key and any optional query parameters.
const buildUrl = (path, queryParams = {}) => {
    if (!API_KEY) {
        throw new Error("Missing VITE_TMDB_API_KEY. Add it to your .env file.")
    }

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

// Fetches multiple popular-movie pages and combines them into one list.
export const getAllMovies = async (pageCount = 10) => {
    // Keep requests in a reasonable range so initial load stays responsive.
    const safePageCount = Math.min(Math.max(pageCount, 1), 20)

    const pageRequests = Array.from({ length: safePageCount }, (_, index) => {
        const page = index + 1
        return requestJson("/movie/popular", { language: "en-US", page })
    })

    const pages = await Promise.all(pageRequests)
    // Merge page results into one movie array for Home.
    const merged = pages.flatMap((pageData) => pageData.results ?? [])

    // Removes duplicate IDs in case the API returns overlap across pages.
    return merged.filter((movie, index, list) => index === list.findIndex((item) => item.id === movie.id))
}

// Searches TMDB for movies that match the user's query.
export const searchMovies = async (query) => {
    // Search is still server-side from TMDB; filters are applied client-side in Home.
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