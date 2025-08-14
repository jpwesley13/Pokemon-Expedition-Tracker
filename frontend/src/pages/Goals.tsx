import { useEffect, useState } from "react";
import { Modal, Box, Paper } from "@mui/material";
import { useAuth } from "../context and utility/AuthContext";
import ModalButton from "../components/ModalButton";
import { useNavigate } from "react-router-dom";
import GoalForm from "../components/GoalForm";
import EditGoal from "../components/EditGoal";

function Goals() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [goals, setGoals] = useState([]);
    const [goalModal, setGoalModal] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentGoal, setCurrentGoal] = useState(null);
    const [fullGoals, setFullGoals] = useState({});

    useEffect(() => {
        if(!user) {
            navigate("/login");
        }
    }, [user, navigate])

    const { id } = user || {}

    function onAddGoal(newGoal){
        return setGoals([...goals, newGoal])
    }

    function toggleFullGoal(goal) {
        setFullGoals(previousState => ({
            ...previousState, [goal]: !previousState[goal]
        }));
    };

    function handleEditGoalClick(goal){
        setCurrentGoal(goal);
        setGoalModal(true)
    };

    async function handleDeleteGoalClick(goal){
        setCurrentGoal(goal)
        const confirmDelete = window.confirm("Are you sure you want to delete this goal?")
        if(confirmDelete){
            const res = await fetch(`/goals/${goal.id}`, {
                method: "DELETE"
            });
            if(res.ok) {
                setGoals(goals.filter(g => g.id !== goal.id));
            } else {
                console.error("Error in deleting goal.");
            };
        };
    };

    useEffect(() => {
        fetch(`/goals`)
        .then(res => res.json())
        .then(data => setGoals(data.filter(goal => goal.user_id === parseInt(id))))
        .catch(error => console.error(error));
    }, [id])

    const goalsList = goals.map(goal => {
        const expanded = fullGoals[goal.id] || false;
        const trimmedContent = goal.content.length > 50 ? `${goal.content.substring(0, 50)}...` : goal.content;

        return (
            <Paper elevation={2} key={goal.id} className="goal-card">
                <div className="goal-header">
                    <h3>Target Date: {goal.target_date}</h3>
                </div>
                <div className="goal-content">
                    <p>{expanded ? goal.content : trimmedContent}</p>
                    <div className="goal-actions">
                        {goal.content.length > 50 ? (<ModalButton 
                            variant="contained" 
                            color="primary" 
                            onClick={() => toggleFullGoal(goal.id)}
                        >
                            {expanded ? "Show Less" : "Show More"}
                        </ModalButton>) : null}
                        {user && user.id === parseInt(id) && (
                            <>
                                <ModalButton variant="contained" color="primary" onClick={() => handleEditGoalClick(goal)}>
                                    Edit
                                </ModalButton>
                                <ModalButton variant="contained" color="primary" onClick={() => handleDeleteGoalClick(goal)}>
                                    Delete
                                </ModalButton>
                            </>
                        )}
                    </div>
                </div>
            </Paper>
        );
    });

    return (
        <main className="goals-page">
            <h1>Goals</h1>
            <hr/>
            
            <div className="goals-controls">
                <Paper elevation={3} className="controls-section">
                    <div className="controls-content">
                        {user && (
                            <div className="add-goal-section">
                                <ModalButton 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Add new goal
                                </ModalButton>
                            </div>
                        )}
                    </div>
                </Paper>
            </div>

            <div className="goals-content">
                <Paper elevation={3} className="goals-list-section">
                    <h2>Your Goals</h2>
                    <div className="goals-grid">
                        {goals.length > 0 ? goalsList : (
                            <Paper elevation={2} className="no-goals">
                                <p>No goals set yet. Add some goals to stay motivated!</p>
                            </Paper>
                        )}
                    </div>
                </Paper>
            </div>

            <Modal
                open={goalModal}
                onClose={() => setGoalModal(false)}
                aria-labelledby="edit-goal-modal-title"
                aria-describedby="edit-goal-modal-description"
            >
                <Box className="modal-box">
                    <h2>Edit Goal</h2>
                    <ModalButton className="close-button" onClick={() => setGoalModal(false)} sx={{ mb: 2 }}>Close</ModalButton>
                    <EditGoal
                        handleClick={() => setGoalModal(false)}
                        setGoals={setGoals}
                        goal={currentGoal}
                    />
                </Box>
            </Modal>

            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                aria-labelledby="add-goal-modal-title"
                aria-describedby="add-goal-modal-description"
            >
                <Box className="modal-box">
                    <h2>Add new goal</h2>
                    <ModalButton className="close-button" onClick={() => setIsModalOpen(false)} sx={{ mb: 2 }}>Close</ModalButton>
                    <GoalForm
                        handleClick={() => setIsModalOpen(false)}
                        onAddGoal={onAddGoal}
                    />
                </Box>
            </Modal>
        </main>
    )
};

export default Goals;