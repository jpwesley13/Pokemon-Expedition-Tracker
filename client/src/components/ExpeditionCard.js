import { Link } from "react-router-dom";
import getMostCommon from "../context and utility/getMostCommon";

function ExpeditionCard({ expedition, catches = []}) {

    const { date, locale, user_id, id} = expedition

    const catchCount = catches.length

    const typeCount = catches.reduce((acc, capture) => {
        const speciesType = capture.species.types[0];
        acc[speciesType] = (acc[speciesType] || 0) + 1;
        return acc;
    }, {});

    const mostCommon = getMostCommon(typeCount)
}