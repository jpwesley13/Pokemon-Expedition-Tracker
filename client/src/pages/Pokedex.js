import React, { useState, useEffect } from "react";
import { useAuth } from "../context and utility/AuthContext";
import { useNavigate } from "react-router-dom";

function apiURL(string) {
    return string.toLowerCase()
    .split(" ")
    .join("-");
};

function Pokedex() {

    const { user } = useAuth();
    const navigate = useNavigate();
    const [variantThumbs, setVariantThumbs] = useState({});
    
    useEffect(() => {
        if(!user) {
            navigate("/login");
        }
    }, [user, navigate])
    const { username, catches } = user || {}

    const speciesInfo = {};

    catches.forEach(capture => {
        const speciesName = capture.species.name;
        const types = capture.species.types;
        const dexNumber = capture.species.dex_number;

        if (!speciesInfo[speciesName]) {
            speciesInfo[speciesName] = { 
                types, 
                dexNumber, 
                count: 1
            };
        } else {
            speciesInfo[speciesName].count += 1; 
        }
    })

    const variantCheck = {}
    Object.values(speciesInfo).forEach(pokemon => {
        if(!variantCheck[pokemon.dexNumber]) {
            variantCheck[pokemon.dexNumber] = 0;
        }
        variantCheck[pokemon.dexNumber] += 1;
    });

    const dexEntries = Object.entries(speciesInfo).map(([species, info]) => ({
        species, ...info
    }));

    const orderedEntries = dexEntries.sort((poke1, poke2) => poke1.dexNumber - poke2.dexNumber)

    useEffect(() => {
        const fetchVariantImages = async () => {
            const variants = orderedEntries.map(async ({ species, dexNumber }) => {
                if (variantCheck[dexNumber] > 1 && !variantThumbs[species]) {
                    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${apiURL(species)}`);
                    const pokemon = await res.json();
                    return { species, imageUrl: pokemon.sprites.other['official-artwork'].front_default };
                }
                return null;
            });

            const allVariants = await Promise.all(variants);
            const loadedVariantThumbs = allVariants.reduce((acc, variant) => {
                if (variant) {
                    acc[variant.species] = variant.imageUrl;
                }
                return acc;
            }, {});

            setVariantThumbs(prev => ({ ...prev, ...loadedVariantThumbs }));
        };

        fetchVariantImages();
    }, [orderedEntries, variantThumbs, variantCheck]);

    const displayedDex = orderedEntries
    .map(({ species, types, dexNumber, count }) => {
        const pokemonTypes = types.map(typeObj => typeObj.name);
        const isVariant = variantCheck[dexNumber] > 1;

        const imageUrl = isVariant ? variantThumbs[species] : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${dexNumber}.png`;

        return (<div 
                    key={species} 
                    className={`pokemon-entry ${isVariant ? 'variant-entry' : ''}`} 
                    style={{ 
                        marginLeft: isVariant ? '20px' : '0', 
                        color: isVariant ? 'blue' : 'black' 
                    }}
                >
                    <img src={imageUrl}
                    alt={species}
                    className="dex-thumbnail" />
                    <span>#{dexNumber} {species} -</span>
                    {pokemonTypes.map((type, i) => (
                    <React.Fragment key={type}>
                        <span 
                        style={{ marginLeft: i === 0 ? '0.5em' : '0' }}
                        className={`type-${type.toLowerCase()}`}>
                        {type}
                        </span>
                        {i < pokemonTypes.length - 1 && <strong> / </strong>}
                    </React.Fragment>))} <span className="capture-count">{count} caught</span>
                </div>
            )});

    return (
        <>
        <h1>{username}'s Pokedex</h1>
        <div>{displayedDex}</div>
        </>
    );
};

export default Pokedex;

// Make sure only accessible by correct user just like profile page. Also acknowledge it could just be a part of their page, but you know, routes for project and all