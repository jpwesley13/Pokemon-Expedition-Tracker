import { Link } from "react-router-dom";
import ModalButton from "./ModalButton";
import getMostCommon from "../context and utility/getMostCommon";

function ExpeditionCard({ expedition, catches = []}) {

    const { date, locale, id} = expedition

    const catchCount = catches.length

    const pokes = catches.map(capture => capture.species.name)

    const typeCount = catches.reduce((acc, capture) => {
        const speciesType = capture.species.types[0].name;
        acc[speciesType] = (acc[speciesType] || 0) + 1;
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
                <span>Most Common Type Caught on Expedition: <span className={`type-${mostCommon.toLowerCase()}`}>{mostCommon}</span></span>
                <br />
                <span>{pokes}</span>
                <Link to={`/expeditions/${id}`}>Details</Link>
                {/* <Modal
                    open={expeditionModal}
                    onClose={() => setExpeditionModal(false)}
                    aria-labelledby="edit-profile-modal-title"
                    aria-describedby="edit-profile-modal-description"
                >
                    <Box className="modal-box">
                        <h2>Edit Expedition</h2>
                        <ModalButton className="close-button" onClick={() => setExpeditionModal(false)} sx={{ mb: 2 }}>Close</ModalButton>
                        <EditExpedition
                            handleClick={() => setExpeditionModal(false)}
                            setExpeditions={setExpeditions}
                            expedition={currentExpedition}
                        />
                    </Box>
                </Modal> */}
            </div>
        </p>
        </>
    );
};

export default ExpeditionCard;