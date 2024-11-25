import React from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context and utility/AuthContext";
import getMostCommon from "../context and utility/getMostCommon";

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

    const typeCount = catches.reduce((acc, capture) => {
        capture.species.types.forEach((typeObj) => {
            const speciesType = typeObj.name;
            acc[speciesType] = (acc[speciesType] || 0) + 1;
        });
        return acc;
    }, {});
    
    const mostCommon = getMostCommon(typeCount)

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
            <h2>
                {catches.length > 0 ? `You've caught ${catches.length} Pokemon across ${expeditions.length} expeditions!` : `Your Pokemon adventure is just getting started! Get out there and start catchin'!`}
            </h2>
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
            <br />
            <h3>
                {mostCommon.length > 0 ? `Most Common Type(s) You've Caught:` : null}
            </h3>
            <div>
                    {
                        mostCommon.map((type, i) => (
                            <React.Fragment key={type}>
                                <span 
                                style={{ marginLeft: i === 0 ? '0.5em' : '0' }}
                                className={`type-${type.toLowerCase()}`}>
                                {type}
                                </span>
                                {i < mostCommon.length - 1 && <strong> / </strong>}
                            </React.Fragment>
                        ))
                    }
            </div>
                <br />
            <NavLink to={`/users/${id}/pokedex`}>Pokedex</NavLink>
        </>
    );
};

export default Profile;