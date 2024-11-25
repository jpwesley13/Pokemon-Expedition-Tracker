import React from "react";
import { useState } from "react";
import ModalButton from "./ModalButton";
import { Modal, Box } from "@mui/material";
import getMostCommon from "../context and utility/getMostCommon";
import ExpeditionDetails from "./ExpeditionDetails";

function ExpeditionCard({ expedition, catches = [], handleDeleteExpeditionClick}) {

    const { date, locale } = expedition
    const [isModalOpen, setIsModalOpen] = useState(false);

    const catchCount = catches.length

    const pokemons = catches.map(capture => capture.species)

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
        <main className="profile-list-item">
            <div className="profile-content">
                <strong>Date: {date} at {locale.name} ({locale.region.name})</strong>
                <hr />
                <span>Captured {catchCount} Pokemon</span>
                <br />
                <span>Most Common Type(s) Caught on Expedition: 
                    {
                        mostCommon.length > 0 
                        ? mostCommon.map((type, i) => (
                            <React.Fragment key={type}>
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
                <ModalButton variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
                        Details
                    </ModalButton>
            </div>
        </main>
        <Modal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            aria-labelledby="edit-profile-modal-title"
            aria-describedby="edit-profile-modal-description"
            >
            <Box className="modal-box">
                <ModalButton className="close-button" onClick={() => setIsModalOpen(false)} sx={{ mb: 2 }}>Close</ModalButton>
                <ExpeditionDetails
                    handleClick={() => setIsModalOpen(false)}
                    pokemons={pokemons}
                    catchCount={catchCount}
                    typeCount={typeCount}
                />
            </Box>
        </Modal>
            <ModalButton variant="contained" color="primary" onClick={() => handleDeleteExpeditionClick(expedition)}>
                    Delete
            </ModalButton> 
        </>
    );
};

export default ExpeditionCard;