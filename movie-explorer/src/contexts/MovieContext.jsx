import { createContext, useContext, useEffect, useState } from "react";

const MovieContext = createContext()

export const useMovieContext = () => useContext(MovieContext)

export const MovieProvider = ({children}) => {

    const [favorites, setFavorites] = useState([])

    useEffect(
        () => {
            const storedFavorites = localStorage.getItem("favorites")

            if(storedFavorites) setFavorites(JSON.parse(storedFavorites))
        }, []
    )

    useEffect(
        () => {
            localStorage.setItem("favorites", JSON.stringify(favorites))
        }, [favorites]
    )

    const addToFavorites = (movie) => {
        setFavorites(prev => [...prev, movie])
    }

    const removeFromFavorites = (movie_id) => {
        setFavorites(prev => prev.filter(movie => movie.id !== movie_id))
    }

    const isFavorited = (movie_id) => favorites.some(movie => movie.id === movie_id)

    const value = {
        favorites, addToFavorites, removeFromFavorites, isFavorited
    }

    return (
        <MovieContext.Provider value={value}>
            {children}
        </MovieContext.Provider>
    )

}