import React from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context and utility/AuthContext";
import getMostCommon from "../context and utility/getMostCommon";
import getMonthlyExpeditions from "../context and utility/getMonthlyExpeditions";

function Profile() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { userId } = useParams();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        } else if (user.id !== userId) {
            navigate(`/users/${user.id}`);
        }
    }, [user, userId, navigate]);

    if (!user) {
        return null;
    }

    const { id, expeditions, catches } = user || {}

    const monthlyExpeditions = getMonthlyExpeditions(expeditions)

    const userLocales = [...new Set(expeditions.map(expedition => 
            `${expedition.locale.name} (${expedition.locale.region.name})`
        ))]

    const typeCount = catches.reduce((acc, capture) => {
        capture.species.types.forEach((typeObj) => {
            const speciesType = typeObj.name;
            acc[speciesType] = (acc[speciesType] || 0) + 1;
        });
        return acc;
    }, {});
    
    const mostCommon = getMostCommon(typeCount)

    const shinyPokemon = catches.filter(capture => capture.species.shiny)
    

    return (
        <>
            <h1>Welcome, {user.username}!</h1>
            <h2>
                {catches.length > 0 ? `You've caught ${catches.length} Pokemon across ${expeditions.length} expeditions!` : `Your Pokemon adventure is just getting started! Get out there and start catchin'!`}
            </h2>
            <div>
                {monthlyExpeditions.length > 0 ? (
                    <strong>{monthlyExpeditions.length} expeditions were this month!</strong>
                    ) : 
                    <strong>No expeditions so far this month.</strong>}
            </div>
            <br/>
            <h3>
                {userLocales.length > 0 ? `Locales you've visited on your expeditions:` : `The locales you visit on your expeditions will be displayed here!`}
            </h3>
            <div>
                {userLocales.map(locale => 
                    <div key={locale}>
                        {locale}
                    </div>
                )}
            </div>
            <br />
            <h3>
                {mostCommon.length > 0 ? `Most common Type(s) you've caught:` : `Your most common Type(s) caught will be displayed here!`}
            </h3>
            <div>
                    {
                        mostCommon.map((type, i) => (
                            <React.Fragment key={type}>
                                <span 
                                style={{ marginLeft: i === 0 ? '0.5em' : '0' }}
                                className={`type-${type.toLowerCase()}`}>
                                {type} Type
                                </span>
                                {i < mostCommon.length - 1 && <strong> / </strong>}
                            </React.Fragment>
                        ))
                    }
            </div>
            <br />
            <h3>
                {shinyPokemon.length > 0 ? (
                    <>
                    You've caught {shinyPokemon.length} <span style={{ color: 'red' }}>Shiny Pokemon!</span></>) : null}
            </h3>
                <br />
            {catches.length > 0 ? <NavLink to={`/users/${id}/pokedex`}>Pokedex</NavLink> : null}
        </>
    );
};

export default Profile;