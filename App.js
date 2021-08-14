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

    if(command === 'commands' || command === 'help'){
        message.channel.send('Soon I will release a full module with avaible commands in the bot, for now stick to these:\n\`help\`,\n\`commands\`,\n\`thanks\`,\n\`pizza\`,\n\`carbonara\`,\n\`noxter\`,\n\` \`')
    }

    if(command === 'thanks'){
        message.channel.send('Yes, thanks \`help\` you big brainer of an Italian pizzaiolo')
    }

    if(command === 'user_id'){
        message.channel.send('\`CONTENT OF THE MESSAGE\`' + message.author)
    }
    
    switch (command){
        case 'noxter':
            message.channel.send("Noxter's gone making cases, sorry");
            break;
        case 'miches':
            message.channel.send("Master miches is gone making cases, sorry");
            break;
        case 'curis':
            message.channel.send("CuriS is outside and will try those commands Soon:tm:");
            break;
        case 'gone':
            message.channel.send("noxter is gone sleeping and with this, greets everyone in here as long as wishing a nice sleep. I am also going to sleep. Until next time, Purple Lambda, out ");
            break;
        case 'judge':          
            client.commands.get(command).execute(message, args)                 
        break;
        case 'date':
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