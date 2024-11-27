import { useState, useEffect } from "react";

function capitalizeFirstLetters(string) {
    return string.toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

function RandomPokemon() {

    const [pokemons, setPokemons] = useState([])
    const urlBar = 'https://pokeapi.co/api/v2/pokemon/'
    function randomDex(gen1, gen9){
        return Math.floor(Math.random() * (gen9 - gen1 + 1) + gen1)
    };

    useEffect(() => {
        const fetchPokemons = async () => {
            const promises = Array.from({ length: 5 }, () => {
                const pokeDex = randomDex(1, 1025);
                return fetch(urlBar + pokeDex)
                .then(res => res.json());
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