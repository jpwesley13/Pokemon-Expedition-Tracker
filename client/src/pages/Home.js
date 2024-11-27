import React from "react";
import { useAuth } from "../context and utility/AuthContext";
import { useState, useEffect, useMemo } from "react";
import getMonthlyExpeditions from "../context and utility/getMonthlyExpeditions";
import getMostCommon from "../context and utility/getMostCommon";

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
        return `${expedition.locale.name} in ${expedition.locale.region.name}`})
    
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
        return <h2>Loading...</h2>
      }

    return (
        <>
        <h1>
            {user ? (
                <>Hello {user.username}, here's a recommended Pokemon Type to catch today! <span style={{ fontSize: '2rem' }}
                className={`type-${recommendation.toLowerCase()}`}>{recommendation}</span>
                </>) : `Log in for personalized recommendations!`}
        </h1>
        <h2>
            {mostCommonMonthlyType.length > 0 ? (
                <>
                The most common Type(s) caught by users this month: {mostCommonMonthlyType.map((type, i) => (
                            <React.Fragment key={type}>
                                <span 
                                style={{ fontSize: '1.4rem' }}
                                className={`type-${type.toLowerCase()}`}>
                                {type} Type
                                </span>
                                {i < mostCommonMonthlyType.length - 1 && <strong> / </strong>}
                            </React.Fragment>
                        ))}
                </>) : `No one has caught anything this month yet!`
            }
        </h2>
        <h2>{mostCommonMonthlyLocale.length > 0 ? 
            `A popular locale this month is ${randomLocale}!`: null
        }</h2>
        <h2>
            A Pokemon users have caught more of than any other on PokET is {mostCommonPokemon[Math.floor(Math.random() * mostCommonPokemon.length)]}! 
        </h2>
        <h3>
            {monthlyCatchCount ? `The most Pokemon a user has caught this month on PokET is ${topMonthlyCatch} Pokemon!` : null}
        </h3>
        </>
    )
}

export default Home;