import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MovieCard from './components/MovieCard'
import Home from '../pages/Home'
import { Routes, Route } from 'react-router-dom'
import Favourites from '../pages/Favourites'
import NavBar from "./components/NavBar"

function App() {
  return (
    <>
    <NavBar/>
    <main className='main-contect'>
      <Routes>
        <Route path="/" element = {<Home/>}/>
        <Route path="/favourites" element={<Favourites/>}/>
      </Routes>
    </main>
    </>
  )
}


export default App
