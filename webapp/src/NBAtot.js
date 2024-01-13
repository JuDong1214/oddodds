import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NBAtot.css';

const formatOdds = (odds) => {
    return `o${odds}`;
};

const formatOdds2 = (odds) => {
    return `u${odds}`;
};

const formatOdds3 = (odds) => {
    if (odds > 0) {
        return `+${odds}`;
    }
    return odds; // Negative numbers already have a '-' sign
};


const NBAtot = () => {
    const [games, setGames] = useState([]);
    const [sportsbooks, setSportsbooks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/products/');
                const formattedGames = groupDataByGameID(response.data.products);
                setGames(formattedGames);
                setSportsbooks(extractSportsbooks(response.data.products));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const groupDataByGameID = (products) => {
        const gamesMap = new Map();

        products.forEach(product => {
            if (!gamesMap.has(product.gameID)) {
                gamesMap.set(product.gameID, {
                    gameID: product.gameID,
                    home: product.home,
                    away: product.away,
                    odds: {}
                });
            }

            const game = gamesMap.get(product.gameID);
            game.odds[product.book] = {
                OverTotal: product.OverTotal,
                UnderTotal: product.UnderTotal,
                OverTotalPrice: product.OverTotalPrice,
                UnderTotalPrice: product.UnderTotalPrice
            };
        });

        return Array.from(gamesMap.values());
    };

    const extractSportsbooks = (products) => {
        const bookSet = new Set(products.map(p => p.book));
        return Array.from(bookSet).sort();
    };

    return (
        <div className="nba-spreads2">
            <h1>NBA O/U Odds Today</h1>
            <table>
                <thead>
                    <tr>
                        <th>Matchup</th>
                        {sportsbooks.map(book => <th key={book}>{book}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {games.map(game => (
                        <tr key={game.gameID}>
                            <td>
                                <div className="matchup-container2">
                                    <div>{game.home}</div>
                                    <div>vs</div>
                                    <div>{game.away}</div>
                                </div>
                            </td>
                            {sportsbooks.map(book => (
                                <td key={book}>
                                    {game.odds[book] ? (
                                        <div className="odds2">
                                            <div className="spread-box2">{formatOdds(game.odds[book].OverTotal)}</div>
                                            <div className="odds-box2">{formatOdds3(game.odds[book].OverTotalPrice)}</div>
                                            <div className="spread-box2">{formatOdds2(game.odds[book].UnderTotal)}</div>
                                            <div className="odds-box2">{formatOdds3(game.odds[book].UnderTotalPrice)}</div>
                                        </div>
                                    ) : 'N/A'}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
    
};

export default NBAtot;
