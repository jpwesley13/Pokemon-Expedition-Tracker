import { useEffect, useState } from "react";
import { Modal, Box } from "@mui/material";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../context and utility/AuthContext";
import ModalButton from "../components/ModalButton";
import { useNavigate } from "react-router-dom";
import ExpeditionForm from "../components/ExpeditionForm";
import ExpeditionCard from "../components/ExpeditionCard";

function Expeditions() {

    const navigate = useNavigate();
    const { user } = useAuth();
    const [expeditions, setExpeditions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [catches, setCatches] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date());

    function globalTime(dateString) {
        const date = new Date(dateString);
        return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    };

    useEffect(() => {
        if(!user) {
            navigate("/login");
        }
    }, [user, navigate])
    const { id } = user || {}

    function validDate(date) {
        return date instanceof Date && !isNaN(date);
    }

    function onAddExpedition(newExpedition){
        setExpeditions([...expeditions, newExpedition]);
        setCatches([...catches, ...newExpedition.catches]);
    }

    async function handleDeleteExpeditionClick(expedition){
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
        .then(data => {
            const userExpeditions = data.filter(expedition => expedition.user_id === parseInt(id));
            setExpeditions(userExpeditions);
            const userCatches = userExpeditions.flatMap(expedition => expedition.catches);
            setCatches(userCatches);
        })
        .catch(error => console.error(error));
    }, [id])

    const sortedExpeditions = expeditions.sort((expedition1, expedition2) => {
        const date1 = new Date(expedition1.date)
        const date2 = new Date(expedition2.date)
        return date1 - date2
    })

    const monthlyExpeditions = sortedExpeditions.filter(expedition => {
        const expeditionDate = globalTime(expedition.date);
        if (validDate(selectedMonth)) {
            const globalMonth = globalTime(selectedMonth)
            return expeditionDate.getUTCFullYear() === globalMonth.getUTCFullYear() &&
                   expeditionDate.getUTCMonth() === globalMonth.getUTCMonth();
        }
        return false;
    });

    const expeditionsList = monthlyExpeditions.map(expedition => {
        const expeditionCatches = catches.filter(capture => 
            capture.expedition_id === expedition.id
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
            <strong>Select Expedition Month (YYYY/MM)</strong>
            <br />
            <DatePicker
                selected={selectedMonth}
                onChange={(date) => setSelectedMonth(date)}
                dateFormat={"yyyy/MM"}
                showMonthYearPicker
                />
            <br />
            </>)}
            <div className="profile-contributions">
                {monthlyExpeditions.length > 0 ? expeditionsList : <p>No expeditions for this month.</p>}
                <br/>
            </div>
            </main>
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