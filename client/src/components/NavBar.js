import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context and hooks/AuthContext";

function NavBar() {

    const navigate = useNavigate();
    const { user, setUser } = useAuth();

    function handleLogout() {
        fetch('/logout', {
            method: 'DELETE'
        })
        .then(() => {
            setUser(null);
            navigate('/');
        })
    }

    return (
        <nav className="navbar">
            <div className="navbutton">
                <NavLink
                to="/"
                >
                    Home
                </NavLink>
                <NavLink
                to="/expeditions"
                >
                    Expeditions
                </NavLink>
                <NavLink
                to="/goals"
                >
                    Goals
                </NavLink>
                <NavLink
                to="/locales"
                >
                    Locales
                </NavLink>
            </div>
            <div className="navlogin">
            {user ? (
                <button onClick={handleLogout}>
                    Logout
                </button>
                ) : (
                <>
                    <NavLink to="/signup">Signup</NavLink>
                    <NavLink to="/login">Login</NavLink>
                </>
            )}
        </div>
    </nav>
);
};

export default NavBar;