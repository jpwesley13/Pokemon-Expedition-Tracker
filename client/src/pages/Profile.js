import { useParams, useNavigate, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context and utility/AuthContext";

function Profile() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { userId } = useParams();
    const { id } = user || {}
    const { expeditions, catches } = user

    const userLocales = [...new Set(expeditions.map(expedition => 
            `${expedition.locale.name} (${expedition.locale.region.name})`
        ))]

    console.log(userLocales)

    useEffect(() => {
        if(id !== userId){
            navigate(`/users/${id}`)
        } else if(!user) {
            navigate("/login");
        }
    }, [userId, navigate, id])
    

    return (
        <>
            <h1>Hey how's it growin'?</h1>
            <h3>
                {userLocales.length > 0 ? `Locales you've visited on your expeditions:` : null}
            </h3>
            <div>
                {userLocales.map(locale => 
                    <div>
                        {locale}
                    </div>
                )}
            </div>
            <NavLink to={`/users/${id}/pokedex`}>Pokedex</NavLink>
        </>
    );
};

export default Profile;