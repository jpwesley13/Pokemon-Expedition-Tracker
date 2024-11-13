import { useEffect } from "react";
import { useAuth } from "../context and hooks/AuthContext";
import { useNavigate } from "react-router-dom";

function Pokedex() {

    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if(!user) {
            navigate("/login");
        }
    }, [user, navigate])
    const { username } = user || {}

    console.log("Fish")

    return (
        <h1>Good job, {username}</h1>
    );
};

export default Pokedex;

// Make sure only accessible by correct user just like profile page. Also acknowledge it could just be a part of their page, but you know, routes for project and all