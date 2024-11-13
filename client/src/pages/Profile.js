import { useParams, useNavigate, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context and hooks/AuthContext";

function Profile() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { userId } = useParams();
    const { id } = user || {}

    useEffect(() => {
        if(id !== userId){
            // return (
            //     <h1>Nope, not your profile. Begone.</h1>
            // )
            navigate(`/users/${id}`)
        } else if(!user) {
            navigate("/login");
        }
    }, [userId, navigate, id])
    

    return (
        <>
            <h1>Hey how's it growin'?</h1>
            <NavLink to={`/users/${id}/pokedex`}>Pokedex</NavLink>
        </>
    );
};

export default Profile;