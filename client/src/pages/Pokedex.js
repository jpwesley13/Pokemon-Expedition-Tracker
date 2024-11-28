import { useEffect, React } from "react";
import { useAuth } from "../context and utility/AuthContext";
import { useNavigate } from "react-router-dom";

function Pokedex() {

    const { user } = useAuth();
    const navigate = useNavigate();
    
    useEffect(() => {
        if(!user) {
            navigate("/login");
        }
    }, [user, navigate])
    const { username, catches } = user || {}

    const speciesInfo = {};

    catches.forEach(capture => {
        const speciesName = capture.species.name;
        const types = capture.species.types;
        const dexNumber = capture.species.dex_number;

        if (!speciesInfo[speciesName]) {
            speciesInfo[speciesName] = { 
                types, 
                dexNumber, 
                count: 1
            };
        } else {
            speciesInfo[speciesName].count += 1; 
        }
    })

    const dexEntries = Object.entries(speciesInfo).map(([species, info]) => ({
        species, ...info
    }));

    const orderedEntries = dexEntries.sort((poke1, poke2) => poke1.dexNumber - poke2.dexNumber)

    console.log(orderedEntries)

    return (
        <h1>Good job, {username}</h1>
    );
};

export default Pokedex;

// Make sure only accessible by correct user just like profile page. Also acknowledge it could just be a part of their page, but you know, routes for project and all