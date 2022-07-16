const http = require('axios')
require('dotenv').config();

module.exports = {
    getGuidFromName: async(name) => {
        if (!name || name === undefined) {
            return 'Name result undefined or not passed'
        }

        // Headers
        let config = {
            headers: {
                'Authorization': `Bearer ${process.env.API_BEARER_KEY}`
            }
        }
        const data = await http.get(`https://open.faceit.com/data/v4/players?nickname=${name}`, config)

        if (data && data.data) {
            return data.data.player_id
        }
    },
    isUserAllowed: (command, leverage) => {
        // Everyone's command
        const everyoneCommand = [
            'support', 'authlink', 'auth'
        ]
        // Mod's command
        const modsCommand = [
            ...everyoneCommand,
            'close_support', 'mute'
        ]
        // Admin's command
        const adminsCommand = [
            ...modsCommand,
            'judge', 'date', 'clear', 'help', 'player', 'http', 'ban', 'uuid'
        ]

        const commands = [
            everyoneCommand, // Position 0 = leverage 1
            modsCommand, // Position 1 = leverage 2
            adminsCommand, // Position 2 = leverage 3
        ]
        const errMessages = [
            'You are not authorized to perform this command!',
            'Only admins are authorized to perform this command!',
            'Something went wrong!'
        ]

        let isAllowed = false;
        const allowedMessage = {errcode: 0}
        let deniedMessage = {errcode: 1, message: ''}

        // I chose the generations of commands, which is an ar array of array of commands
        // I loop over the commands for that role, and if that doesn't exist, the user is not allowed
        commands[leverage - 1].forEach(c => {
            if (command == c) {
                isAllowed = true
                // The return here breaks the loop, because I don't want to loop over and over if the command is found
                return allowedMessage
            }
        })

        // Returning either an error or the result
        return isAllowed ? allowedMessage : {
            ...deniedMessage,
            message: errMessages[leverage - 1]
        }
    },
    getUserLeverage: (message) => {
        const levRole = {
            'Administrator': 3,
            'ADMIN': 3,
            '@everyone': 1,
            'Moderator': 2,
        }
        let leverage = 0
        message.member.roles.cache.some(r => {
            leverage = levRole[r.name]
            // This breaks the forEach btw
            return leverage
        })
        return leverage
    },
    sendLogs: (_params) => {
        let commandArgs = ''
        const args = _params.args
        if (args.length > 0) {
            commandArgs = args.join(', ')
        }
        const client = _params.client
        const message = _params.message
        client.channels.cache.get(process.env.LOGS_CHANNEL_ID).send("\`-"+_params.command + " " + commandArgs + "\` has been typed into a channel from `" + `${message.member.user.username}`+"`") // need to tag on logs? `<@${message.member.user.id}>`
    }
}
