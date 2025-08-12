import globalTime from "./globalTime";
import { Expedition } from "../interfaces"

function getMonthlyExpeditions(expeditions: Expedition[]): Expedition[] {
    const currentMonth = new Date()

    const monthlyExpeditions = expeditions.filter(expedition => {
        const expeditionDate = globalTime(expedition.date);
        const globalMonth = globalTime(currentMonth)
        return expeditionDate.getUTCFullYear() === globalMonth.getUTCFullYear() &&
                expeditionDate.getUTCMonth() === globalMonth.getUTCMonth();
    });

    return monthlyExpeditions;
}

export default getMonthlyExpeditions;