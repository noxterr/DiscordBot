require('dotenv').config();
const http = require('axios');
const common = require('./../lib/common')

module.exports = {
    name : 'ban',
    description : 'command that returns the list of bans attached to a user',
    execute(message, args){
        if(args.length == 0){
            return message.reply("This command requires a FACEIT guid to work. Use -player [name] to get one")
        }

        if (/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g.test(args[0])) {
            callApi(message, args[0])
        } else {
            const response = common.getGuidFromName(args[0])
            response.then(function(player_id) {
                callApi(message, player_id)
            })
        }

    }
}

const callApi = async(message, _guid) => {
    const data = await http.get(`https://api.faceit.com/sheriff/v1/bans/${_guid}`)

    let banStatus = []
    if (data && data.data) {
        data.data.payload.forEach((ban, i) => {
            banStatus.push({
                nickname: ban.nickname,
                type: ban.type,
                reason: ban.reason,
                game: ban.game == null ? 'Platform' : game.ban,
                starts: ban.starts_at.replace('T', ' '),
                ends: ban.ends_at != null ? ban.ends_at.replace('T', ' ') : 'Never'
            })
        })

        banMessage = '\`\`\`'
        if (banStatus.length > 0) {
            banStatus.forEach((ban) => {
                Object.keys(ban).forEach(banKey => {
                    banMessage += "\n" + banKey + ": " + ban[banKey]
                })
            })
            banMessage += '\`\`\`'
            message.channel.send(banMessage)
        } else {
            message.channel.send('No bans found')
        }
    }
}
