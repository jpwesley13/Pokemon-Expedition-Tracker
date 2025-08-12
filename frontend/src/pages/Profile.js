import React from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context and utility/AuthContext";
import getMostCommon from "../context and utility/getMostCommon";
import getMonthlyExpeditions from "../context and utility/getMonthlyExpeditions";
import { Paper } from "@mui/material";

function Profile() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { id: userId } = useParams();

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

    const { id, expeditions, catches, locales } = user || {}

    const monthlyExpeditions = getMonthlyExpeditions(expeditions)

    const sortedLocales = locales.sort((locale1, locale2) => locale1.name.localeCompare(locale2.name))

    const userLocales = sortedLocales
        .map(locale => 
            `${locale.name} (${locale.region.name})`
        )

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
        <main className="profile-page">
            <div className="profile-section">
                <Paper elevation={3} className="section-content">
                    <h1>Welcome, {user.username}!</h1>
                    
                    <div className="profile-stats-grid">
                        <Paper elevation={2} className="profile-stat-card">
                            <h2>Expedition Overview</h2>
                            {catches.length > 0 ? (
                                <>
                                    <p>You've caught {catches.length} Pokémon across {expeditions.length} expedition(s)!</p>
                                    <p>
                                        {monthlyExpeditions.length > 0 
                                            ? `${monthlyExpeditions.length} expedition(s) this month!`
                                            : "No expeditions yet this month."}
                                    </p>
                                </>
                            ) : (
                                <p>Your Pokémon adventure is just getting started! Get out there and start catchin'!</p>
                            )}
                        </Paper>

                        <Paper elevation={2} className="profile-stat-card">
                            <h2>Most common Type(s) you've 
                            caught:</h2>
                            {mostCommon.length > 0 ? (
                                <div className="types-container">
                                    {mostCommon.map((type, i) => (
                                        <React.Fragment key={type}>
                                            <span className={`type-${type.toLowerCase()}`}>
                                                {type}
                                            </span>
                                        </React.Fragment>
                                    ))}
                                </div>
                            ) : (
                                <p>Your most common Types will be displayed here!</p>
                            )}
                        </Paper>

                        {shinyPokemon.length > 0 && (
                            <Paper elevation={2} className="profile-stat-card shiny-card">
                                <h2>Shiny Collection</h2>
                                <p>You've caught <span className="shiny-text">{shinyPokemon.length} Shiny Pokémon!</span></p>
                            </Paper>
                        )}

                        <Paper elevation={2} className="profile-stat-card">
                            <h2>Visited Locales</h2>
                            {userLocales.length > 0 ? (
                                <div className="locales-list">
                                    {userLocales.map(locale => (
                                        <div key={locale} className="locale-item">
                                            {locale}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>The locales you visit will be displayed here!</p>
                            )}
                        </Paper>
                    </div>

                    {catches.length > 0 && (
                        <NavLink to={`/users/${id}/pokedex`} className="pokedex-button">
                            <Paper elevation={2} className="profile-stat-card">
                                <h2>View Your Pokédex</h2>
                                <p>Click to see your complete collection!</p>
                            </Paper>
                        </NavLink>
                    )}
                </Paper>
            </div>
        </main>
    );
}

export default Profile;