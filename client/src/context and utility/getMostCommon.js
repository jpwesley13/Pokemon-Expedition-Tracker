function getMostCommon(count) {
    return ( Object.keys(count).reduce((a, b) => count[a] > count[b] ? a : b, "None")
    );
};

export default getMostCommon;