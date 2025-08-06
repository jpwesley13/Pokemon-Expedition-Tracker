function getMostCommon(count: Record<string, number>) {
    const maxCount = Math.max(...Object.values(count));
    return Object.keys(count).filter(type => count[type] === maxCount);
}

export default getMostCommon;