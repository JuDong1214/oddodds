import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NBA.css';

const NBA = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/products/');
            const processedData = processData(response.data.products);
            setData(processedData);
            console.log(processedData); // For debugging
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const processData = (rawData) => {
        const groupedData = {};

        rawData.forEach(item => {
            if (!groupedData[item.gameID]) {
                groupedData[item.gameID] = {
                    matchup: `${item.away} @ ${item.home}`,
                    books: {}
                };
            }
            groupedData[item.gameID].books[item.book] = {
                homeSpreadPrice: item.homeSpreadPrice,
                awaySpreadPrice: item.awaySpreadPrice
            };
        });

        return Object.values(groupedData);
    };

    return (
        <div className="nba">
            <h1>NBA Odds Today</h1>
            <div className="grid">
                {data.map((game, index) => (
                    <div key={index} className="gameRow">
                        <div className="matchup">{game.matchup}</div>
                        {Object.entries(game.books).map(([book, odds]) => (
                            <div key={book} className="odds">
                                <span>{book}: Home {odds.homeSpreadPrice} / Away {odds.awaySpreadPrice}</span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NBA;
