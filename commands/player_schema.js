var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const player_data = new Schema({
    discord_id: String,
    nickname: String,
    player_id: String,
    membership: String,
    locale: String,
    auth_id: String,
    token_auth: String,
    player_elo : String,
    skill_level : String,
    steam_64 : String
});

module.exports = mongoose.model('player-data', player_data);