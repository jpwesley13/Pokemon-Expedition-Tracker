import getMostCommon from "../context and utility/getMostCommon";
import LocaleDetails from "./LocaleDetails";
import { useState } from "react";
import ModalButton from "./ModalButton";
import { Modal, Box } from "@mui/material";

function LocaleCard({locale, catches = []}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {name, region, expeditions } = locale

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
            <span>{expeditionCount} recorded expedition(s)</span>
            <span>Most Common Pokémon Caught: 
                {mostCommon.length > 0 
                ? <span style={{ marginLeft:'0.5em' }}>{mostCommon[0]}</span> : <span style={{ marginLeft:'0.5em' }}>None</span>}
            </span>
            <ModalButton 
                className="confirm-pokemon-btn"
                variant="contained" 
                color="primary" 
                onClick={() => setIsModalOpen(true)}
            >
                Confirmed Pokémon
            </ModalButton>

            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                aria-labelledby="edit-profile-modal-title"
                aria-describedby="edit-profile-modal-description"
            >
                <Box className="modal-box">
                    <LocaleDetails
                        handleClick={() => setIsModalOpen(false)}
                        catches={catches}
                        locale={name}
                    />
                </Box>
            </Modal>
        </div>
    );
};

export default LocaleCard;