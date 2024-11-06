import { Link } from "react-router-dom";

function LocaleCard({locale}) {

    const {name, id} = locale

    return (
        <div className="card">
            <h2>{name}</h2>
            <Link to={`/locales/${id}`}>Details</Link>
        </div>
    );
};

export default LocaleCard;