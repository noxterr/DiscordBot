require('dotenv').config();
const http = require('axios');
const common = require('./../lib/common')
export {}

interface Role {
    name: string,
}
interface Message {
    member: {
        user: {
            username: String
        }
        roles: {
            cache: Array<Role>
        }
    },
    channel: {
        send: Function
    }
    reply: Function
}
interface Ban {
    nickname: string,
    type: string,
    reason: string,
    game: string,
    starts_at: string,
    ends_at: string | 'never'
}
module.exports = {
    name : 'ban',
    description : 'command that returns the list of bans attached to a user',
    execute(message: Message, args: Array<string>){
        if(args.length == 0){
            return message.reply("This command requires a FACEIT guid to work. Use -player [name] to get one")
        }

        if (/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g.test(args[0])) {
            callApi(message, args[0])
        } else {
            const response = common.getGuidFromName(args[0])
            response.then(function(player_id: string) {
                callApi(message, player_id)
            })
        }

    }
}

const callApi = async(message: Message, _guid: string) => {
    const data = await http.get(`https://api.faceit.com/sheriff/v1/bans/${_guid}`)

    let banStatus: Array<Ban> = []
    if (data && data.data) {
        data.data.payload.forEach((ban: Ban, i: number) => {
            banStatus.push({
                nickname: ban.nickname,
                type: ban.type,
                reason: ban.reason,
                game: ban.game == null ? 'Platform' : ban.game,
                starts_at: ban.starts_at.replace('T', ' '),
                ends_at: ban.ends_at != null ? ban.ends_at.replace('T', ' ') : 'Never'
            })
        })

        let banMessage: string = '\`\`\`'
        if (banStatus.length > 0) {
            banStatus.forEach((ban: Ban) => {
                Object.keys(ban).forEach((banKey) => {
                    banMessage += "\n" + banKey + ": " + ban[banKey as keyof Ban]
                })
            })
            banMessage += '\`\`\`'
            message.channel.send(banMessage)
        } else {
            message.channel.send('No bans found')
        }
    }
}
