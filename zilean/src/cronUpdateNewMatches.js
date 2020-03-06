const RIOT_URL = "https://na1.api.riotgames.com/lol/";

export function handler(event, context, callback) {
    console.log(RIOT_URL);
    return callback(null);
};
