import { useAuth } from "../context and utility/AuthContext";

function Home() {

    const { user } = useAuth()
    const catches = user?.catches || []
    const allTypes = [
        "Normal", "Fire", "Water", "Electric", "Grass", "Ice", "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy"
      ];

    const typeCount = catches.reduce((acc, capture) => {
        capture.species.types.forEach((typeObj) => {
            const speciesType = typeObj.name;
            acc[speciesType] = (acc[speciesType] || 0) + 1;
        });
        return acc;
    }, {});

    const allTypeCount = allTypes.reduce((acc, type) => {
        acc[type] = 0;
        return acc;
    }, {});

    Object.keys(typeCount).forEach(type => {
        allTypeCount[type] = typeCount[type]
    })

    const bottomSix = Object.entries(allTypeCount)
    .sort((type1, type2) => type1[1] - type2[1])
    .map(orderedType => orderedType[0])
    .slice(0, 6)

    const randomSix = Math.floor(Math.random() * bottomSix.length)
    const recommendation = bottomSix[randomSix]

    console.log(bottomSix)

    return (
        <>
        <h1>
            {user ? (
                <>Hello {user.username}, here's a recommended Pokemon Type to catch today! <span style={{ fontSize: '2rem' }}
                className={`type-${recommendation.toLowerCase()}`}>{recommendation}</span>
                </>) : `Log in for personalized recommendations!`}
        </h1>
        </>
    )
}

export default Home;