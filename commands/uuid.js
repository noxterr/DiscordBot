const common = require('./../lib/common')

module.exports = {
    name : 'uuid',
    description : 'command that returns the UUID of a player',
    execute(message, args){
        const response = common.getGuidFromName(args[0])
        response.then(function(player_id) {
            message.channel.send('UUID: ' + player_id)
        })
    }
}