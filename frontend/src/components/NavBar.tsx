import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context and utility/AuthContext";

function NavBar() {

    const auth = useAuth();
    if (!auth) return null
    const navigate = useNavigate();
    const { user, setUser } = auth;

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
                to="/locales"
                >
                    Locales
                </NavLink>
            </div>
            <div className="navlogin">
            {user ? (
                <>
                <NavLink to={`/users/${user.id}`}>Profile</NavLink>
                <NavLink
                to="/goals"
                >
                    Goals
                </NavLink>
                <button onClick={handleLogout}>
                    Logout
                </button>
                </>
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