import { Link } from "react-router-dom";
import ModalButton from "./ModalButton";
import getMostCommon from "../context and utility/getMostCommon";

function ExpeditionCard({ expedition, catches = [], handleDeleteExpeditionClick}) {

    const { date, locale, id} = expedition

    const catchCount = catches.length

    const pokes = catches.map(capture => capture.species.name)

    const typeCount = catches.reduce((acc, capture) => {
        const speciesType = capture.species.types[0].name;
        acc[speciesType] = (acc[speciesType] || 0) + 1;
        return acc;
    }, {});

    console.log(catches)

    const mostCommon = getMostCommon(typeCount)

    return (
        <>
        <p className="profile-list-item">
            <div className="profile-content">
                <strong>Date: {date} at {locale.name} ({locale.region.name})</strong>
                <hr />
                <span>Captured {catchCount} Pokemon</span>
                <br />
                <span>Most Common Type Caught on Expedition: <span className={`type-${mostCommon.toLowerCase()}`}>{mostCommon}</span></span>
                <br />
                <span>{pokes}</span>
                <Link to={`/expeditions/${id}`}>Details</Link>
                {/* <ModalButton variant="contained" color="primary" onClick={() => handleDeleteExpeditionClick(expedition)}>
                        Delete
                        </ModalButton>  */}
                {/* {user && user.id === parseInt(id) && (
                    <>
                        <ModalButton variant="contained" color="primary" onClick={() => handleEditExpeditionClick(expedition)}>
                        Edit
                        </ModalButton>
                    </>
                )} */}
            </div>
        </p>
        </>
    );
};

export default ExpeditionCard;