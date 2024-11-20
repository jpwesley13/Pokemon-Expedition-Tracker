import { Link } from "react-router-dom";
import getMostCommon from "../context and utility/getMostCommon";

function LocaleCard({locale, catches = []}) {

    const {name, region, expeditions, id} = locale

    const expeditionCount = expeditions.length

    const speciesCount = catches.reduce((acc, capture) => {
        const speciesName = capture.species.name;
        acc[speciesName] = (acc[speciesName] || 0) + 1;
        return acc;
    }, {});

    const mostCommon = getMostCommon(speciesCount)

    return (
        <div className="card">
            <h2>{name}</h2>
            <span>{region.name} Region</span>
            <span>{expeditionCount} recorded expeditions</span>
            <span>Most Common Pokemon Caught: {mostCommon}</span>
            <br />
            <Link to={`/locales/${id}`}>Details</Link>
        </div>
    );
};

export default LocaleCard;