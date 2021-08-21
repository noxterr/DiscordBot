const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
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

    //everyone 833449438248042526 
    //admin 833469698410676284
    console.log(message.guild.roles.cache.find(role => role.id === '833469698410676284'))
    let jsonGuild = message.guild.roles.cache.find(role => role.id === '833469698410676284')

    console.log("author ID " + message.member.roles.cache.some(r => r.name === 'Administrator'))
    console.log("guild ID " + jsonGuild.id)
    /*
    id: '877976088310063186',
    name: 'Support needed',
    */

    const args = message.content.slice(prefix.length).split(" ")
    const command = args.shift().toLowerCase()

    if(command === 'user_id'){
        message.channel.send('\`CONTENT OF THE MESSAGE\`' + message.author)
    }

    if(command === 'role'){
        message.channel.send("\`Is noxter an admin\`")
        message.channel.send(" "+message.member.roles.cache.some(r => r.name === 'Administrator'))  //@everyone
    }
    
    if(command === 'online'){
        message.channel.send("\`Local Purple Lambda is ONLINE\`")
        message.channel.send("\`Good time everyone\`")
    }

    if(command === 'offline'){
        message.channel.send("\`Local Have fun around everyone\`")
        message.channel.send("\`Purple Lambda is OFFLINE\`")
    }

    let leverage = 0

    if(message.member.roles.cache.some(r => r.name === 'Administrator')){
        //an admin has availability of all commands -> level 5
        leverage = 5
    }else if(message.member.roles.cache.some(r => r.name === '@everyone')){
        leverage = 1
    }else if(message.member.roles.cache.some(r => r.name === 'Moderator')){
        leverage = 3
    }

    console.log("lvel: " + leverage)

    if(leverage >= 1){ //anything else
        switch (command){
            case 'support':
                client.channels.cache.get('877980154910081075').send(client.commands.get(command).execute(message, args))
                break;
            case 'authlink':
                client.commands.get(command).execute(message, args)
                break;
            case 'auth':
                setTimeout(() => message.delete(), 1250)
                client.commands.get(command).execute(message, args)            
                break;
        }
    }
    
    if(leverage >= 3){ //moderator level
        console.log('admin can come here')
        switch (command){
            case 'close_support':
                client.commands.get(command).execute(message, args)
                break;
            case 'mute':
                client.commands.get(command).execute(message, args)
                break;
            case 'auth':
                client.commands.get(command).execute(message, args)            
                break;
        }
    }
    if(leverage >= 5){ //admin level
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
        }
    }

    
    
})

client.on('messageCreate', gotMessage);


function gotMessage(msg) {
    if (msg.content === 'ciao') {
        msg.reply('🚂🌈💖');
    }
}
 
// LAMBDA-TOKEN
client.login(process.env.LAMBDA_TOKEN); 