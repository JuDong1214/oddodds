const axios = require('axios')

const mongoose = require('mongoose');

const apiKey = 'b6a06513e5fc4a6ae8a906076845ec09'

const sportKey = 'basketball_nba' // use the sport_key from the /sports endpoint below, or use 'upcoming' to see the next 8 games across all sports

const regions = 'us' // uk | us | eu | au. Multiple can be specified if comma delimited

const markets = 'h2h,spreads,totals' // h2h | spreads | totals. Multiple can be specified if comma delimited

const oddsFormat = 'american' // decimal | american

const dateFormat = 'iso' // iso | unix

mongoose.connect(
    'mongodb+srv://dongju:' + 
    process.env.MONGO_ATLAS_PW + 
    '@node-rest-proj.7a3ggsa.mongodb.net/?retryWrites=true&w=majority', 
    {}
).then(() => console.log('MongoDB Connected')).catch(err => console.error(err));
mongoose.Promise = global.Promise;

/*
    First get a list of in-season sports
        the sport 'key' from the response can be used to get odds in the next request


axios.get('https://api.the-odds-api.com/v4/sports', {
    params: {
        apiKey
    }
})
.then(response => {
    console.log(response.data)
})
.catch(error => {
    console.log('Error status', error.response.status)
    console.log(error.response.data)
})
*/

const deleteAllProducts = async () => {
    try {
        const response = await axios.delete('http://localhost:3000/products/');
        console.log(response.data.message);
    } catch (error) {
        console.error('Error in deleteAllProducts:', error.message);
    }
};


/*
    Now get a list of live & upcoming games for the sport you want, along with odds for different bookmakers
    This will deduct from the usage quota
    The usage quota cost = [number of markets specified] x [number of regions specified]
    For examples of usage quota costs, see https://the-odds-api.com/liveapi/guides/v4/#usage-quota-costs

*/

const getOdds = async () => {
    try {
        await deleteAllProducts();

        axios.get(`https://api.the-odds-api.com/v4/sports/basketball_nba/odds`, {
            params: {
                apiKey,
                regions,
                markets,
                oddsFormat,
                dateFormat,
            }
        })
        .then(response => {
            const gamesData = response.data;

            gamesData.forEach(game => {
                const gameID = game.id;
                const homeTeam = game.home_team;
                const awayTeam = game.away_team;
                const commenceTime = new Date(game.commence_time);
            
                game.bookmakers.forEach(bookmaker => {
                    const book = bookmaker.key;
            
                    let homePrice = 0, awayPrice = 0;
                    let homeSpread = 0, awaySpread = 0, homeSpreadPrice = 0, awaySpreadPrice = 0;
                    let overTotal = 0, underTotal = 0, overTotalPrice = 0, underTotalPrice = 0;
            
                    // Find h2h, spread, and totals markets
                    bookmaker.markets.forEach(market => {
                        if (market.key === 'h2h') {
                            market.outcomes.forEach(outcome => {
                                if (outcome.name === homeTeam) {
                                    homePrice = outcome.price;
                                } else if (outcome.name === awayTeam) {
                                    awayPrice = outcome.price;
                                }
                            });
                        } else if (market.key === 'spreads') {
                            market.outcomes.forEach(outcome => {
                                if (outcome.name === homeTeam) {
                                    homeSpread = outcome.point;
                                    homeSpreadPrice = outcome.price;
                                } else if (outcome.name === awayTeam) {
                                    awaySpread = outcome.point;
                                    awaySpreadPrice = outcome.price;
                                }
                            });
                        } else if (market.key === 'totals') {
                            market.outcomes.forEach(outcome => {
                                if (outcome.name === 'Over') {
                                    overTotal = outcome.point;
                                    overTotalPrice = outcome.price;
                                } else if (outcome.name === 'Under') {
                                    underTotal = outcome.point;
                                    underTotalPrice = outcome.price;
                                }
                            });
                        }
                    });
            
                    // Construct object for POST request
                    const postData = {
                        gameID: gameID,
                        home: homeTeam,
                        away: awayTeam,
                        book: book,
                        homePrice: homePrice,
                        awayPrice: awayPrice,
                        homeSpread: homeSpread,
                        awaySpread: awaySpread,
                        homeSpreadPrice: homeSpreadPrice,
                        awaySpreadPrice: awaySpreadPrice,
                        OverTotal: overTotal,
                        UnderTotal: underTotal,
                        OverTotalPrice: overTotalPrice,
                        UnderTotalPrice: underTotalPrice,
                        date: commenceTime
                    };
            
                    // Make POST request
                    axios.post('http://localhost:3000/products/', postData)
                    .then(postResponse => {
                        console.log("POST response:", postResponse.data);
                    })
                    .catch(postError => {
                        console.error("POST error:", postError);
                    });
                });
            });

            // Check your usage
            console.log('Remaining requests',response.headers['x-requests-remaining'])
            console.log('Used requests',response.headers['x-requests-used'])

        })
        .catch(error => {
            console.log('Error status', error.response.status)
            console.log(error.response.data)
        })

    } 
    catch (error) {
        console.error('Error in getOdds:', error.message);
    }
};

getOdds();


