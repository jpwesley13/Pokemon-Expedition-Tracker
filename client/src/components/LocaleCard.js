import { Link } from "react-router-dom";

function LocaleCard({locale}) {

    const {name, region, expeditions, id} = locale

    const expeditionCount = expeditions.length

    return (
        <div className="card">
            <h2>{name}</h2>
            <span>{region.name} Region</span>
            <span>{expeditionCount} recorded expeditions</span>
            <br />
            <Link to={`/locales/${id}`}>Details</Link>
        </div>
    );
};

export default LocaleCard;