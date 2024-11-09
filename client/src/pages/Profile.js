import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context and hooks/AuthContext";

function Profile() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { id } = useParams();

    useEffect(() => {
        if(user.id != id){
            // return (
            //     <h1>Nope, not your profile. Begone.</h1>
            // )
            navigate(`/users/${user.id}`)
        }
    }, [id])

    return (
        <h1>Hey how's it growin'?</h1>
    );
};

export default Profile;