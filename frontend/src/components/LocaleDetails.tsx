import React from "react";
import { Type } from "../interfaces";

function LocaleDetails({ catches = [], locale, handleClick }) {
    const speciesTypes = {};

    catches.forEach(capture => {
        const speciesName = capture.species.name;
        const types = capture.species.types;

        if (!speciesTypes[speciesName]) {
            speciesTypes[speciesName] = types
        }
    });
    const uniqueSpecies = Object.entries(speciesTypes).map(([species, types]) => ({ species, types }));
    const uniqueSpecies2 = Object.entries(speciesTypes).map((spec) => {
        console.log(spec);
        const species = spec[0];
        const types = spec[1];
        return { species, types }
    });

    console.log(uniqueSpecies2);
    // These data structures need to be pared down to be simpler instead of directly nesting all this data down
    // You can use a serializer to make the data simpler
    // Or on initial fetch, you can strip the data down there.

    const localePokemon = uniqueSpecies2.map(({ species, types }) => {
        const pokemonTypes = types.map((typeObj) => typeObj.name);

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