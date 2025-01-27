import React, { createContext, useContext, useState, useEffect } from 'react';

const PokemonContext = createContext();

function PokemonProvider({ children }) {
    const [pokemonData, setPokemonData] = useState([]);

    useEffect(() => {
        fetch('/data/pokemon_data.json')
        .then((res) => {
            if (res.ok) {
                return res.json();
              }
              throw new Error('Pokémon data fetch failed');
        })
        .then((data) => setPokemonData(data))
        .catch((error) => {
            console.error(error);
            setPokemonData([]);
        })
    }, []);

    return (
        <PokemonContext.Provider value={{ pokemonData }}>
            {children}
        </PokemonContext.Provider>
    );
};

export default PokemonProvider;

export const usePokemon = () => {
    return useContext(PokemonContext);
};