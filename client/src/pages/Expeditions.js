import { useEffect, useState } from "react";
import { Modal, Box } from "@mui/material";
import { useAuth } from "../context and hooks/AuthContext";
import ModalButton from "../components/ModalButton";
import { Link, useNavigate } from "react-router-dom";
import ExpeditionForm from "../components/ExpeditionForm";
// import EditExpedition from "../components/EditExpedition";

function Expeditions() {

    const navigate = useNavigate();
    const { user } = useAuth();
    const [expeditions, setExpeditions] = useState([]);
    const [expeditionModal, setExpeditionModal] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentExpedition, setCurrentExpedition] = useState(null);

    useEffect(() => {
        if(!user) {
            navigate("/login");
        }
    }, [user, navigate])
    const { username, id } = user || {}

    function onAddExpedition(newExpedition){
        setExpeditions([...expeditions, newExpedition])
    }

    // function handleEditExpeditionClick(expedition){
    //     setCurrentExpedition(expedition);
    //     setExpeditionModal(true)
    // };
    // async function handleDeleteExpeditionClick(expedition){
    //     setCurrentExpedition(expedition)
    //     const confirmDelete = window.confirm("Are you sure you want to delete this expedition?")
    //     if(confirmDelete){
    //         const res = await fetch(`/expeditions/${expedition.id}`, {
    //             method: "DELETE"
    //         });
    //         if(res.ok) {
    //             setExpeditions(expeditions.filter(g => g.id !== expedition.id));
    //         } else {
    //             console.error("Error in deleting expedition.");
    //         };
    //     };
    // };

    useEffect(() => {
        fetch(`/expeditions`)
        .then(res => res.json())
        .then(data => setExpeditions(data.filter(expedition => expedition.user_id === parseInt(id))))
        .catch(error => console.error(error));
    }, [id])


    const expeditionsList = expeditions.map(expedition => {
        console.log("Render", expedition)
        return (
        <p key={expedition.id} className="profile-list-item">
            <div className="profile-content">
                <span>{`${username}'s expedition on ${expedition.date}: ${expedition.locale.name} (${expedition.locale.region.name}):`} </span>
                <Link to={`/`}>View</Link> 
                {/* {user && user.id === parseInt(id) && (
                    <>
                        <ModalButton variant="contained" color="primary" onClick={() => handleEditExpeditionClick(expedition)}>
                        Edit
                        </ModalButton>
                        <ModalButton variant="contained" color="primary" onClick={() => handleDeleteExpeditionClick(expedition)}>
                        Delete
                        </ModalButton>
                    </>
                )} */}
            </div>
        </p>
    )});

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
                    />
                </Box>
            </Modal>
        </>
    )
};

export default Expeditions;