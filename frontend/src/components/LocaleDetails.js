import React from "react";

function LocaleDetails({ catches = [], locale, handleClick }) {

    const speciesTypes = {}

    catches.forEach(capture => {
        const speciesName = capture.species.name;
        const types = capture.species.types;

        if(!speciesTypes[speciesName]) {
            speciesTypes[speciesName] = types
        }
    });

    const uniqueSpecies = Object.entries(speciesTypes).map(([species, types]) => ({
        species, types
    }));

    const localePokemon = uniqueSpecies.map(({species, types}) => {

        const pokemonTypes = types.map((typeObj) =>  typeObj.name);

        return (
            <div key={species} className="pokemon-entry">
                <span>{species}</span>: {pokemonTypes.map((type, i) => (
                    <React.Fragment key={type}>
                        <span 
                        style={{ marginLeft: i === 0 ? '0.5em' : '0' }}
                        className={`type-${type.toLowerCase()}`}>
                        {type}
                        </span>
                        {i < pokemonTypes.length - 1 && <strong> / </strong>}
                    </React.Fragment>
                ))}
            </div>
        )
    });

    return (
        <>
            <h3>
                {catches.length > 0 ? `Confirmed Pokémon found at ${locale}:` : `No confirmed Pokémon captures at ${locale}.`}
            </h3>
                <div className="pokemon-container">
                    {localePokemon}
                </div>
            <button onClick={() => handleClick()}>Close</button>
        </>
    )
}

export default LocaleDetails;