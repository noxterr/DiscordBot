require('dotenv').config();
const http = require('axios')

module.exports = {
    name : 'ban',
    description : 'command that returns the list of bans attached to a user',
    execute(message, args){
        if(args.length==0){
             return message.reply("This command requires a FACEIT guid to work. Use -player [name] to get one")
        }

        let banStatus = []
        const guid = args[0]

        const callApi = async() => {
            const data = await http.get(`https://api.faceit.com/sheriff/v1/bans/${guid}`)

            if (data && data.data) {
                data.data.payload.forEach((ban, i) => {
                    banStatus.push({
                        nickname: ban.nickname,
                        reason: ban.reason,
                        game: ban.game,
                        starts: ban.starts_at.replace('T', ' '),
                        ends: ban.ends_at.replace('T', ' ')
                    })
                })

                banMessage = '\`\`\`'
                if (banStatus.length > 0) {
                    banStatus.forEach((ban) => {
                        Object.keys(ban).forEach(banKey => {
                            banMessage += "\n" + banKey + " " + ban[banKey]
                        })
                    })
                    banMessage += '\`\`\`'
                    message.channel.send(banMessage)
                } else {
                    message.channel.send('No bans found')
                }
            } else {
                message.channel.send('No bans found')
            }
        }

        callApi()
    }
}

