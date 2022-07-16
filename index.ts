const Discord = require('discord.js')
const { Client, Intents, MessageEmbed } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
const fs = require('fs')
require('dotenv').config()

const prefix: string = '-'
client.commands = new Discord.Collection();
const common = require('./lib/common')
export {}

const commandFile = fs.readdirSync('./commands/').filter((file: String) => file.endsWith('.ts'))
for(const file of commandFile){
    const command = require(`./commands/${file}`)

    client.commands.set(command.name, command)
}

interface leverageResult {
    errcode: 0 | 1
    message?: string
}

client.on('messageCreate', (message: any) =>{
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    // Getting the arguments of the command
    const args: Array<string> = message.content.slice(prefix.length).split(" ")

    // Getting the name of the command
    const cmd: any = args.shift()
    const command: string = cmd.toLowerCase()

    // Setting up role permission
    const roleLevel: number | undefined = common.getUserLeverage(message)
    const leverage: number = roleLevel ? roleLevel : 1

    // Saving the logs
    common.sendLogs({
        client,
        args,
        message,
        command
    })

    // Sending the actual command
    const res: leverageResult = common.isUserAllowed(command, leverage)
    if (res.errcode == 0) {
        try {
            client.commands.get(command).execute(message, args)
        } catch (e: unknown) {
            console.error(e)
            message.reply('There has been an error. If the problem persists please contact the administrator')
        }
    } else {
        message.reply(res.message)
    }
})

client.login(process.env.LAMBDA_TOKEN)