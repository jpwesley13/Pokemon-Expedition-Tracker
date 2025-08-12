import React from "react";
import { useAuth } from "../context and utility/AuthContext";
import { useState, useEffect, useMemo } from "react";
import getMonthlyExpeditions from "../context and utility/getMonthlyExpeditions";
import getMostCommon from "../context and utility/getMostCommon";
import RandomPokemon from "../components/RandomPokemon";
import { Paper } from "@mui/material";

function Home() {
    const { user } = useAuth()
    const catches = user?.catches || []
    const allTypes = [
        "Normal", "Fire", "Water", "Electric", "Grass", "Ice", "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy"
      ];
    const [globalExpeditions, setGlobalExpeditions] = useState([])
    const [globalCatches, setGlobalCatches] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
    fetch(`/expeditions`)
    .then(res => res.json())
    .then(data => {
        setGlobalExpeditions(data);
        setGlobalCatches(data.flatMap(expedition => expedition.catches));
        setLoading(false)
    })
    .catch(error => console.error(error));
    }, [])

    const catchCount = globalCatches.reduce((acc, capture) => {
        const speciesName = capture.species.name;
        acc[speciesName] = (acc[speciesName] || 0) + 1;
        return acc
    }, {})

    const mostCommonPokemon = getMostCommon(catchCount)

    const monthlyExpeditions = getMonthlyExpeditions(globalExpeditions)

    const monthlyLocales = monthlyExpeditions.map(expedition => {
        return `${expedition.locale.name} in ${expedition.locale.region.name}`
    })
    
    const monthlyLocaleCount = monthlyLocales.reduce((acc, locale) => {
        acc[locale] = (acc[locale] || 0 ) + 1
        return acc;
    }, {})

    const mostCommonMonthlyLocale = getMostCommon(monthlyLocaleCount)

    const randomLocale = mostCommonMonthlyLocale[Math.floor(Math.random() * mostCommonMonthlyLocale.length)]

    const monthlyCatches = monthlyExpeditions.flatMap(expedition => expedition.catches);

    const monthlyCatchCount = monthlyCatches.reduce((acc, capture) => {
        acc[capture.user_id] = (acc[capture.user_id] || 0 ) + 1
        return acc
    }, {})

    const topMonthlyCatch = Math.max(...Object.values(monthlyCatchCount))

    const monthlyTypeCount = monthlyCatches.reduce((acc, capture) => {
        capture.species.types.forEach((typeObj) => {
            const speciesType = typeObj.name;
            acc[speciesType] = (acc[speciesType] || 0) + 1;
        });
        return acc;
    }, {});

    const mostCommonMonthlyType = getMostCommon(monthlyTypeCount)

    function userTypeCount(catches) {
        return catches.reduce((acc, capture) => {
          capture.species.types.forEach((typeObj) => {
            const speciesType = typeObj.name;
            acc[speciesType] = (acc[speciesType] || 0) + 1;
          });
          return acc;
        }, {});
      };

    const typeCount = useMemo(() => userTypeCount(catches), [catches]);

    const userAllTypeCount = useMemo(() => {
        const initialTypeCount = allTypes.reduce((acc, type) => {
            acc[type] = 0;
            return acc;
        }, {});

        Object.keys(typeCount).forEach(type => {
            initialTypeCount[type] = typeCount[type];
        });

        return initialTypeCount;
    }, [typeCount]);

    const recommendation = useMemo(() => {
        const bottomSix = Object.entries(userAllTypeCount)
            .sort((type1, type2) => type1[1] - type2[1])
            .map(orderedType => orderedType[0])
            .slice(0, 6);

        const randomSix = Math.floor(Math.random() * bottomSix.length);
        return bottomSix[randomSix];
    }, [userAllTypeCount]);

    if (loading) {
        return (
            <main className="home-page">
                <Paper elevation={3} className="loading-section">
                    <h2>Loading...</h2>
                </Paper>
            </main>
        );
    }

    return (
        <main className="profile-page">
            <RandomPokemon />
            
            <div className="profile-section">
                <Paper elevation={3} className="section-content">
                    <h1 className="home-header">
                        {user ? `Recommendations for you, ${user.username}!` : `Log in for personalized recommendations!`}
                    </h1>

                    {user && (
                        <Paper elevation={2} className="profile-stat-card">
                            <h2>
                                A recommended Pokémon Type to catch today is{" "}
                                <span className={`type-${recommendation.toLowerCase()}`}>
                                    {recommendation}
                                </span>
                            </h2>
                        </Paper>
                    )}

                    <h1 className="home-header">Global PokET Stats</h1>
                    
                    <div className="profile-stats-grid">
                        <Paper elevation={2} className="profile-stat-card">
                            <h2>Most Common Type(s) Caught This Month</h2>
                            {mostCommonMonthlyType.length > 0 ? (
                                <div className="types-container">
                                    {mostCommonMonthlyType.map((type, i) => (
                                        <React.Fragment key={type}>
                                            <span className={`type-${type.toLowerCase()}`}>
                                                {type}
                                            </span>
                                            {i < mostCommonMonthlyType.length - 1 && <strong> / </strong>}
                                        </React.Fragment>
                                    ))}
                                </div>
                            ) : (
                                <p>No one has caught anything this month yet!</p>
                            )}
                        </Paper>

                        <Paper elevation={2} className="profile-stat-card">
                            <h2>A Popular Locale This Month Is</h2>
                            <p>
                                {mostCommonMonthlyLocale.length > 0 
                                    ? `${randomLocale}` 
                                    : `No one has gone anywhere this month yet!`
                                }
                            </p>
                        </Paper>

                        <Paper elevation={2} className="profile-stat-card">
                            <h2>Most Caught Pokémon on PokET</h2>
                            <p>
                                {mostCommonPokemon[Math.floor(Math.random() * mostCommonPokemon.length)]}
                            </p>
                        </Paper>

                        <Paper elevation={2} className="profile-stat-card">
                            <h2>Highest Catch Count This Month</h2>
                            <p>
                                {monthlyCatches.length > 0 
                                    ? `${topMonthlyCatch} Pokémon!` 
                                    : `No recordbreaking catch counts this month yet!`
                                }
                            </p>
                        </Paper>
                    </div>
                </Paper>
            </div>
            
            <RandomPokemon />
        </main>
    );
}

export default Home;