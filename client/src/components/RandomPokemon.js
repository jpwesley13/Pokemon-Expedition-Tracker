import { useState, useEffect } from "react";

function RandomPokemon() {

    const [pokemons, setPokemons] = useState([])
    const urlBar = 'https://pokeapi.co/api/v2/pokemon/'
    function randomDex(first, last){
        return Math.floor(Math.random() * (last - first + 1) + first)
    };

    useEffect(() => {
        const fetchPokemons = async () => {
            const promises = Array.from({ length: 5 }, async () => {
                const pokeDex = randomDex(1, 1025);
                const res = await fetch(urlBar + pokeDex);
                return await res.json();
            });
            try {
                const data = await Promise.all(promises);
                setPokemons(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchPokemons();
    }, []);

    return (
        <div className="thumbnail-container">
            {pokemons.map((pokemon, index) => (
                <img
                    key={index}
                    src={pokemon.sprites.other['official-artwork'].front_default}
                    alt={pokemon.name}
                    className="pokemon-thumbnail"
                />
            ))}
        </div>
    )
}

export default RandomPokemon;