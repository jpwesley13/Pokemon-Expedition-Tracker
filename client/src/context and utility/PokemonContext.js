import React, { createContext, useContext, useState, useEffect } from 'react';

const PokemonContext = createContext();

function PokemonProvider({ children }) {
    const [pokemonData, setPokemonData] = useState([]);

    useEffect(() => {
        const fetchPokemonData = async () => {
            try {
                const res = await fetch('/data/pokemon_data.json');
                if (!res.ok) {
                    throw new Error('Pokémon data fetch failed');
                }
                const data = await res.json();
                setPokemonData(data);
            } catch (error) {
                console.error(error);
            setPokemonData([]);
            }
        };

        fetchPokemonData();
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