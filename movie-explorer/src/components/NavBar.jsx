import { Link } from "react-router-dom"
import "../styles/Navbar.css"

function NavBar(){
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/" className="nav-link brand-link" aria-label="Moviexplorer home">cinescope</Link>
            </div>
            <div className="navbar-links">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/favourites" className="nav-link">Favourites</Link>
            </div>
        </nav>
    )
}

export default NavBar