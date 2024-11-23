

function ExpeditionDetails({ handleClick, pokemons, catchCount, typeCount }) {


    return (
        <>
            <p>You caught {catchCount} Pokemon</p>
            <button onClick={() => handleClick()}>Close</button>
        </>
    )
};

export default ExpeditionDetails;