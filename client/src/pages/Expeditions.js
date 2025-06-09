import { useEffect, useState } from "react";
import { Modal, Box, Paper } from "@mui/material";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../context and utility/AuthContext";
import ModalButton from "../components/ModalButton";
import { useNavigate } from "react-router-dom";
import ExpeditionForm from "../components/ExpeditionForm";
import ExpeditionCard from "../components/ExpeditionCard";
import globalTime from "../context and utility/globalTime";
import TypeChart from "../components/TypeChart";

function Expeditions() {

    const navigate = useNavigate();
    const { user, setUser } = useAuth();
    const [expeditions, setExpeditions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [catches, setCatches] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date());

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
                const updatedExpeditions = expeditions.filter(g => g.id !== expedition.id);
                const updatedCatches = catches.filter(capture => capture.expedition_id !== expedition.id);

                setExpeditions(updatedExpeditions);
                setCatches(updatedCatches);

                const userRes = await fetch('/check_session');
                const data = await userRes.json();
                if(userRes.ok){
                    setUser(data)
                }
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

    if (!user) {
        return null;
    }

    return (
        <>
        <main className="expeditions-page">
            <h1>Expeditions</h1>
            <hr/>
            {user && (
                <div className="expeditions-controls">
                    <Paper elevation={3} className="controls-section">
                        <div className="controls-row">
                            <div className="date-picker-section">
                                <h3>Select Month</h3>
                                <DatePicker
                                    className="datepicker"
                                    showIcon
                                    selected={selectedMonth}
                                    onChange={(date) => setSelectedMonth(date)}
                                    dateFormat={"yyyy/MM"}
                                    popperPlacement="bottom-start"
                                    showMonthYearPicker
                                />
                            </div>
                            <div className="add-expedition-section">
                                <ModalButton 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Add new expedition
                                </ModalButton>
                            </div>
                        </div>
                    </Paper>
                </div>
            )}
            
            <div className="expeditions-content">
                {monthlyExpeditions.length > 0 && (
                    <Paper elevation={3} className="type-chart-section">
                        <h2>Monthly Type Distribution</h2>
                        <TypeChart 
                            monthlyExpeditions={monthlyExpeditions}
                            catches={catches}
                        />
                    </Paper>
                )}
                
                <div className="expeditions-list">
                    <h2>Your Expeditions</h2>
                    <div className="expeditions-grid">
                        {monthlyExpeditions.length > 0 ? expeditionsList : (
                            <Paper elevation={2} className="no-expeditions">
                                <p>No expeditions for this month.</p>
                            </Paper>
                        )}
                    </div>
                </div>
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