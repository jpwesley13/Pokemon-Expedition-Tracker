import React from "react";
import { Link } from "react-router-dom";
import ModalButton from "./ModalButton";
import getMostCommon from "../context and utility/getMostCommon";

function ExpeditionCard({ expedition, catches = [], handleDeleteExpeditionClick}) {

    const { date, locale, id} = expedition

    const catchCount = catches.length

    const pokes = catches.map(capture => capture.species.name)

    const typeCount = catches.reduce((acc, capture) => {
    capture.species.types.forEach((typeObj) => {
        const speciesType = typeObj.name;
        acc[speciesType] = (acc[speciesType] || 0) + 1;
    });
    return acc;
}, {});

    const mostCommon = getMostCommon(typeCount)

    return (
        <>
        <p className="profile-list-item">
            <div className="profile-content">
                <strong>Date: {date} at {locale.name} ({locale.region.name})</strong>
                <hr />
                <span>Captured {catchCount} Pokemon</span>
                <br />
                <span>Most Common Type(s) Caught on Expedition: 
                    {
                        mostCommon.length > 0 
                        ? mostCommon.map((type, i) => (
                            <React.Fragment>
                                <span 
                                style={{ marginLeft: i === 0 ? '0.5em' : '0' }}
                                className={`type-${type.toLowerCase()}`}>
                                {type}
                                </span>
                                {i < mostCommon.length - 1 && <strong> / </strong>}
                            </React.Fragment>
                        ))
                        : <span 
                            style={{ marginLeft:'0.5em' }}
                            className="type-none">None</span>
                    }
                </span>
                <br />
                <span>{pokes}</span>
                <Link to={`/expeditions/${id}`}>Details</Link>
                <ModalButton variant="contained" color="primary" onClick={() => handleDeleteExpeditionClick(expedition)}>
                        Delete
                        </ModalButton> 
            </div>
        </p>
        </>
    );
};

export default ExpeditionCard;