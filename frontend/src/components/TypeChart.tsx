import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import globalTime from "../context and utility/globalTime";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function TypeChart({ monthlyExpeditions, catches }): any {
    const [selectedType, setSelectedType] = useState('Normal');
    
    const pokemonTypes = [
        "Normal", "Fire", "Water", "Electric", "Grass", "Ice", 
        "Fighting", "Poison", "Ground", "Flying", "Psychic", 
        "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy"
    ];

    const getTypeProgressData = () => {
        if (!monthlyExpeditions.length) return { labels: [], data: [], total: 0 };

        const sortedExpeditions = monthlyExpeditions.sort((a, b) => 
            new Date(a.date) - new Date(b.date)
        );

        let cumulativeCount = 0;
        const chartData = sortedExpeditions.map(expedition => {
            const expeditionCatches = catches.filter(c => 
                c.expedition_id === expedition.id
            );
            
            const typeCount = expeditionCatches.reduce((count, capture) => {
                const hasType = capture.species.types.some(
                    type => type.name === selectedType
                );
                return count + (hasType ? 1 : 0);
            }, 0);

            cumulativeCount += typeCount;
            
            return {
                date: globalTime(expedition.date).toLocaleDateString(),
                count: typeCount,
                cumulative: cumulativeCount
            };
        });

        return {
            labels: chartData.map(d => d.date),
            data: chartData.map(d => d.count),
            total: cumulativeCount
        };
    };

    function getTypeColor(type) {
        const typeColors = {
            Bug: '#94BC4A',
            Dark: '#736c75',
            Dragon: '#6a7baf',
            Electric: '#e5c531',
            Fairy: '#e397d1',
            Fighting: '#cb5f48',
            Fire: '#ea7a3c',
            Flying: '#7da6de',
            Ghost: '#846ab6',
            Grass: '#71c558',
            Ground: '#cc9f4f',
            Ice: '#70cbd4',
            Normal: '#A8A878',
            Poison: '#b468b7',
            Psychic: '#e5709b',
            Rock: '#b2a061',
            Steel: '#89a1b0',
            Water: '#539ae2'
        };
        return typeColors[type] || '#000000';
    }

    const chartData = getTypeProgressData();
    const chartConfig = {
        labels: chartData.labels,
        datasets: [
            {
                label: `${selectedType}-type Pokémon Caught Per Expedition`,
                data: chartData.data,
                backgroundColor: getTypeColor(selectedType),
                borderColor: getTypeColor(selectedType),
                borderWidth: 1
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `${selectedType}-type Pokémon Catches by Expedition`
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        }
    };

    return (
        <div>
            <div style={{ marginTop: '20px', marginBottom: '20px' }}
            >
                <strong>Select Pokémon Type to Track:</strong>
                <select 
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    style={{ marginLeft: '10px', maxWidth: '300px' }}
                >
                    {pokemonTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
                <div style={{ marginTop: '10px' }}>
                    <strong>Total {selectedType}-type Pokémon Caught This Month: </strong>
                    <span>{chartData.total}</span>
                </div>
            </div>
            
            {monthlyExpeditions.length > 0 && (
                <div style={{ maxHeight: '400px', marginBottom: '20px' }}>
                    <Bar data={chartConfig} options={chartOptions} />
                </div>
            )}
        </div>
    );
}

export default TypeChart;