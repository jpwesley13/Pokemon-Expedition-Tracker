import { useEffect, useState } from "react";
import { Modal, Box } from "@mui/material";
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
    const { username, id } = user || {}

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
            <p key={goal.id} className="profile-list-item">
                <div className="profile-content">
                    <span>{`${username}`}'s goal: {expanded ? goal.content : trimmedContent}</span>
                    <br />
                    <span>Achieve by: {goal.target_date}</span>
                    <button onClick={() => toggleFullGoal(goal.id)}>
                        {expanded ? "Hide" : "View"}
                    </button> 
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
            </p>
        );
    });

    return (
        <>
        <main>
            <hr/>
            <h1>Goals</h1>
            <hr/>
            <br />
            {user && (<><ModalButton variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
                        Add new goal
                    </ModalButton>
            <br />
            </>)}
            <div className="profile-contributions">
                {goals.length > 0 && (<>
                {goalsList}
                <br/>
                </>)}
            </div>
            </main>
            <Modal
            open={goalModal}
            onClose={() => setGoalModal(false)}
            aria-labelledby="edit-profile-modal-title"
            aria-describedby="edit-profile-modal-description"
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
                aria-labelledby="edit-profile-modal-title"
                aria-describedby="edit-profile-modal-description"
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
        </>
    )
};

export default Goals;