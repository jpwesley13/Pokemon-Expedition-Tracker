import React from "react";

function ExpeditionDetails({ handleClick, pokemons = [], catchCount, typeCount }) {

    const expeditionTypes = Object.entries(typeCount).map(([type, count]) => (
        <span key={type}
        className={`type-${type.toLowerCase()}`}>
            {type}: {Number(count)}
        </span>
    ))

    const expeditionPokemon = pokemons.map(pokemon => {

        const types = pokemon.types.map((typeObj) =>  typeObj.name);
        const shinyClass = pokemon.shiny ? 'shiny' : 'not-shiny'

        return (
            <div key={pokemon.id} className="pokemon-entry">
                <span className={shinyClass}>{pokemon.name}</span>: {types.map((type, i) => (
                    <React.Fragment key={type}>
                        <span 
                        style={{ marginLeft: i === 0 ? '0.5em' : '0' }}
                        className={`type-${type.toLowerCase()}`}>
                        {type}
                        </span>
                        {i < types.length - 1 && <strong> / </strong>}
                    </React.Fragment>
                ))}
            </div>
        )
    })

    return (
        <>
            <h2>{catchCount > 0 ? `You caught ${catchCount} Pokémon on this expedition!` : `You didn't catch any Pokémon on this expedition...`}</h2>
            <h3>
                {expeditionTypes.length > 0 && `Number of each Type caught:`}
            </h3>
            <div className="types-container">
                {expeditionTypes}
            </div>
            <hr />
            <h3>
                {expeditionPokemon.length > 0 && (
                    <>
                        Pokemon caught on expedition (Shiny Pokémon <span style={{ color: 'red' }}>in red</span>):
                </>)}
            </h3>
            <div className="pokemon-container">
                {expeditionPokemon}
            </div>
            <button onClick={() => handleClick()}>Close</button>
        </>
    )
};

export default ExpeditionDetails;