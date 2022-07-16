const http = require('axios')
require('dotenv').config()
export {}

// Logs interface needed
interface Client {
    channels: {
        cache: any
    }
}
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
    }
}
interface LogsInterface {
    client: Client,
    args: Array<string>,
    message: Message,
    command: string
}

module.exports = {
    getGuidFromName: async(name: string) => {
        // I want to specify in reality that I just need the player_id even if I will get the full object
        interface ReturnObj {
            data?: {
                player_id: string
            }
        }
        if (!name || name === undefined) {
            return 'Name result undefined or not passed'
        }

        // Headers
        let config = {
            headers: {
                'Authorization': `Bearer ${process.env.API_BEARER_KEY}`
            }
        }

        // data
        const data: ReturnObj = await http.get(`https://open.faceit.com/data/v4/players?nickname=${name}`, config)

        if (data && data.data) {
            return data.data.player_id
        }
    },
    isUserAllowed: (command: string, leverage: number) => {
        // Defining the interface that will map the return
        interface ReturnValue {
            errcode: 0 | 1,
            message?: string
        }

        // Everyone's command
        const everyoneCommand: Array<string> = [
            'support', 'authlink', 'auth'
        ]
        // Mod's command
        const modsCommand: Array<string> = [
            ...everyoneCommand,
            'close_support', 'mute'
        ]
        // Admin's command
        const adminsCommand: Array<string> = [
            ...modsCommand,
            'judge', 'date', 'clear', 'help', 'player', 'http', 'ban', 'uuid'
        ]

        const commands: Array<Array<string>> = [
            everyoneCommand, // Position 0 = leverage 1
            modsCommand, // Position 1 = leverage 2
            adminsCommand, // Position 2 = leverage 3
        ]

        const errMessages: Array<string> = [
            'You are not authorized to perform this command!',
            'Only admins are authorized to perform this command!',
            'Something went wrong!'
        ]

        let isAllowed: true | false = false;
        const allowedMessage: ReturnValue = {errcode: 0}
        let deniedMessage: ReturnValue = {errcode: 1, message: ''}

        // I chose the generations of commands, which is an ar array of array of commands
        // I loop over the commands for that role, and if that doesn't exist, the user is not allowed
        commands[leverage - 1].forEach((c: string) => {
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
    getUserLeverage: (message: Message) => {
        // mapping the role object with another interface
        const levRole: any = {
            'Administrator': 3,
            'ADMIN': 3,
            '@everyone': 1,
            'Moderator': 2,
        }
        let leverage: number = 0
        message.member.roles.cache.some((r: Role) => {
            leverage = levRole[r.name]
            // This breaks the forEach btw
            return leverage
        })
        return leverage
    },
    sendLogs: (_params: LogsInterface) => {
        let commandArgs: string = ''
        const args: Array<String> = _params.args
        if (args.length > 0) {
            commandArgs = args.join(', ')
        }
        const client: Client = _params.client
        const message: Message = _params.message
        client.channels.cache.get(process.env.LOGS_CHANNEL_ID).send("\`-"+_params.command + " " + commandArgs + "\` has been typed into a channel from `" + `${message.member.user.username}`+"`") // need to tag on logs? `<@${message.member.user.id}>`
    }
}