import React from "react";

function ExpeditionDetails({ handleClick, pokemons = [], catchCount, typeCount }) {

    const expeditionTypes = Object.entries(typeCount).map(([type, count]) => (
        <span key={type}
        className={`type-${type.toLowerCase()}`}>
            {type}: {count}
        </span>
    ))

    return (
        <>
            <h2>{catchCount > 0 ? `You caught ${catchCount} Pokemon on this expedition!` : `You didn't catch any Pokemon on this expedition...`}</h2>
            <h3>{expeditionTypes.length > 0 ? `Number of each Type caught:` : null}</h3>
                <div className="types-container">
                {expeditionTypes}
                </div>
            <button onClick={() => handleClick()}>Close</button>
        </>
    )
};

export default ExpeditionDetails;