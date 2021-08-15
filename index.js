const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const request = require('request');
const prefix = '-'
const fs = require('fs');
client.commands = new Discord.Collection();


const commandFile = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'))
for(const file of commandFile){
    const command = require(`./commands/${file}`)

    client.commands.set(command.name, command)
}



client.once('ready' , () =>{
    console.log('purple lambda is on and run');
})

client.on('messageCreate', message =>{
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(" ")
    const command = args.shift().toLowerCase()

    if(command === 'user_id'){
        message.channel.send('\`CONTENT OF THE MESSAGE\`' + message.author)
    }
    
    if(command === 'online'){
        message.channel.send("\`Purple Lambda is ONLINE\`")
        message.channel.send("\`Good time everyone\`")
    }

    if(command === 'offline'){
        message.channel.send("\`Have fun around everyone\`")
        message.channel.send("\`Purple Lambda is OFFLINE\`")
    }


    switch (command){
        case 'judge':          
            client.commands.get(command).execute(message, args)                 
        break;
        case 'date':
            client.commands.get(command).execute(message, args)
            break; 
        case 'clear':
            client.commands.get(command).execute(message, args)
            break; 
        case 'help':
            client.commands.get(command).execute(message, args)
            break;        
        default:
            message.channel.send("\`This is the default response from the bot, when no command is inserted\`")
            break;
    }
    
})

client.on('messageCreate', gotMessage);


function gotMessage(msg) {
    if (msg.content === 'ciao') {
        msg.reply('🚂🌈💖');
    }
  }

client.login('ODc1NDcyMjMyOTI5OTcyMzg0.YRWBDQ.z1GJpLAw8c6ZQklbDIjDlK0iBZs');