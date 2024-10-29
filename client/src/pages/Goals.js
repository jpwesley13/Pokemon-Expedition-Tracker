import { useEffect, useState } from "react";
import { Modal, Box } from "@mui/material";
import { useAuth } from "../context and hooks/AuthContext";
import ModalButton from "../components/ModalButton";
import { useNavigate } from "react-router-dom";

function Goals() {

    const navigate = useNavigate();
    const { user } = useAuth();
    const [goals, setGoals] = useState([]);
    const [goalModal, setGoalModal] = useState(false);
    const [currentGoal, setCurrentGoal] = useState(null);

    const { username, id } = user

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


    const goalsList = goals.map(goal => (
        <p key={goal.id} className="profile-list-item">
            <div className="profile-content">
                <span>{`${username}`}'s goal: {`${goal.content}`}: </span>
                <Link to={`/`}>View</Link> 
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
    ));

    return (
        <>
        <main>
            <hr/>
            <h1>Goals</h1>
            <hr/>
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
        </>
    )
};

export default Goals