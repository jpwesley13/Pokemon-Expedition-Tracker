import { useEffect, useState } from "react";
import { Modal, Box } from "@mui/material";
import { useAuth } from "../context and utility/AuthContext";
import ModalButton from "../components/ModalButton";
import { Link, useNavigate } from "react-router-dom";
import ExpeditionForm from "../components/ExpeditionForm";
import ExpeditionCard from "../components/ExpeditionCard";

function Expeditions() {

    const navigate = useNavigate();
    const { user } = useAuth();
    const [expeditions, setExpeditions] = useState([]);
    const [expeditionModal, setExpeditionModal] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentExpedition, setCurrentExpedition] = useState(null);
    const [catches, setCatches] = useState([]);

    useEffect(() => {
        if(!user) {
            navigate("/login");
        }
    }, [user, navigate])
    const { username, id } = user || {}

    function onAddExpedition(newExpedition){
        setExpeditions([...expeditions, newExpedition]);
    }

    function onAddCatch(newCatch){
        setCatches([...catches, ...newCatch]);
    }

    // function handleEditExpeditionClick(expedition){
    //     setCurrentExpedition(expedition);
    //     setExpeditionModal(true)
    // };
    async function handleDeleteExpeditionClick(expedition){
        setCurrentExpedition(expedition)
        const confirmDelete = window.confirm("Are you sure you want to delete this expedition?")
        if(confirmDelete){
            const res = await fetch(`/expeditions/${expedition.id}`, {
                method: "DELETE"
            });
            if(res.ok) {
                setExpeditions(expeditions.filter(g => g.id !== expedition.id));
            } else {
                console.error("Error in deleting expedition.");
            };
        };
    };

    useEffect(() => {
        fetch(`/expeditions`)
        .then(res => res.json())
        .then(data => setExpeditions(data.filter(expedition => expedition.user_id === parseInt(id))))
        .catch(error => console.error(error));
        fetch('/catches')
        .then((res) => res.json())
        .then((data) => setCatches(data))
        .catch((error) => console.error(error));
    }, [id])


    const expeditionsList = expeditions.map(expedition => {
        const expeditionCatches = catches.filter(capture => 
            capture.user_id === expedition.user_id && 
            capture.caught_at === expedition.date
        );
    
        return (
            <ExpeditionCard
                key={expedition.id}
                expedition={expedition}
                catches={expeditionCatches}
                handleDeleteExpeditionClick={handleDeleteExpeditionClick}
            />
        );
    });

    return (
        <>
        <main>
            <hr/>
            <h1>Expeditions</h1>
            <hr/>
            <br />
            {user && (<><ModalButton variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
                        Add new expedition
                    </ModalButton>
            <br />
            </>)}
            <div className="profile-contributions">
                {expeditions.length > 0 && (<>
                {expeditionsList}
                <br/>
                </>)}
            </div>
            </main>
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
        <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                aria-labelledby="edit-profile-modal-title"
                aria-describedby="edit-profile-modal-description"
            >
                <Box className="modal-box">
                    <h2>Add new expedition</h2>
                    <ModalButton className="close-button" onClick={() => setIsModalOpen(false)} sx={{ mb: 2 }}>Close</ModalButton>
                    <ExpeditionForm
                        handleClick={() => setIsModalOpen(false)}
                        onAddExpedition={onAddExpedition}
                        onAddCatch={onAddCatch}
                    />
                </Box>
            </Modal>
        </>
    )
};

export default Expeditions;