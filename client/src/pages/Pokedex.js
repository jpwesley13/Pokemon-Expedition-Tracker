import { useEffect } from "react";
import { useAuth } from "../context and hooks/AuthContext";

function Pokedex() {

    const { user } = useAuth();

    console.log("Fish")

    return (
        <h1>Good job, {user.username}</h1>
    );
};

export default Pokedex;