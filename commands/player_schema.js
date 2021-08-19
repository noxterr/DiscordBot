var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const player_data = new Schema({
    discord_id: String,
    nickname: String,
    player_id: String,
    membership: String,
    locale: String,
    auth_id: String,
    token_auth: String
});

module.exports = mongoose.model('player-data', player_data);     