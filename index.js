const Discord = require('discord.js');
const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const prefix = '-'
const fs = require('fs');
client.commands = new Discord.Collection();
const fetch = require('node-fetch')
require('dotenv').config();

const commandFile = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'))
for(const file of commandFile){
    const command = require(`./commands/${file}`)

    client.commands.set(command.name, command)
}

client.once('ready' , () =>{
    
    async function edit(){

        const channel = await client.channels.fetch('878988648916320266')
        //878988648916320266

        channel.messages.fetch().then((messages) => {
            if(messages.size === 0){

            }else{      
                for(const message of messages){
                    let embedObject = ''

                    let purpleLambdaBotImg = 'https://cdn.discordapp.com/avatars/875472232929972384/56324581ce49da2adbd4580b608ebac2.png?size=128'

                    fetch('https://status.heroku.com/api/v4/current-status')
                        .then(responseHeroku => responseHeroku.json())
                        .then(jsonHeroku =>{
                            //herokuStatusFetch
                            fetch('https://www.faceitstatus.com/api/v2/status.json')
                                .then(responseFaceit => responseFaceit.json())
                                .then(jsonFaceit =>{
                                    fetch('https://api.steampowered.com/ICSGOServers_730/GetGameServersStatus/v1/?appid=440&key=CEFE5FC1E26B180DCF064C6AC06C5433')
                                    .then(responseFaceit => responseFaceit.json())
                                    .then(jsonSteam =>{
                                        embedObject += `{"heroku":[{"app_status" : "${jsonHeroku.status[0].status}"}, {"data_status" : "${jsonHeroku.status[1].status}"}], "faceit_status" : "${jsonFaceit.status.description}" , "faceit_status_url" : "${jsonFaceit.page.url}", "steam_status" : "${jsonSteam.result.services.SessionsLogon}"}`
                                    })  
                                })             
                        })   

                    setTimeout(()=>{

                        embedObject = JSON.parse(embedObject)
                        console.log(embedObject)

                        const exampleEmbed = new MessageEmbed()
                            .setColor('#0099ff')
                            .setTitle('STATUS')
                            .setURL('https://discord.js.org/')
                            .setAuthor('Purple Lambda', purpleLambdaBotImg, 'https://discord.js.org')
                            .setDescription('Operation Status of Providers')
                            //.setThumbnail('https://i.imgur.com/AfFp7pu.png')
                            .addFields(
                                { name: 'App Stats', value: (embedObject.heroku[0].app_status == 'green' ? '✅' : '❌'), inline: true  },
                                { name: 'Data Status', value: (embedObject.heroku[1].data_status == 'green' ? '✅' : '❌'), inline: true},
                                /* { name: '\u200B', value: '\u200B' },*/
                                { name: 'Faceit Stats', value: `[${embedObject.faceit_status}](${embedObject.faceit_status_url})`, inline: false },
                                { name: 'Steam Session Status', value: (embedObject.steam_status == 'normal' ? '✅' : '❌'), inline: false },
                            ) 
                            /*.addField('Inline field title', 'Some value here', true)*/
                            .setTimestamp()
                            .setFooter('Last update was:', purpleLambdaBotImg); 
                                setTimeout(()=>{
                                    message[1].edit({ embeds: [exampleEmbed] }) 
                                }, 500)
                    }, 5000)
                }
            }
        })
    };
    
    setInterval(() => {
        edit();
    }, 3600000) // 60 minutes = 3600 seconds = 3600000 ms 
    

    console.log('purple lambda is on and run');
})

client.on('messageCreate', message =>{
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(" ")
    const command = args.shift().toLowerCase()


    let leverage = 0

    if(message.member.roles.cache.some(r => r.name === 'Administrator') || message.member.roles.cache.some(r => r.name === 'ADMIN')){
        //an admin has availability of all commands -> level 5
        leverage = 5
    }else if(message.member.roles.cache.some(r => r.name === '@everyone')){
        leverage = 1
    }else if(message.member.roles.cache.some(r => r.name === 'Moderator')){
        leverage = 3
    }

    //console.log(client)

    

    if(args[0] != null){
        client.channels.cache.get('885199141037305916').send("\`-"+command + " " + args[0] + "\` has been typed into a channel from `" + `${message.member.user.username}`+"`") // need to tag on logs? `<@${message.member.user.id}>`
    }else{
        client.channels.cache.get('885199141037305916').send("\`-"+command + "\` has been typed into a channel from `" + `${message.member.user.username}` +"`")// need to tag on logs? `<@${message.member.user.id}>`
    }

    if(leverage >= 1){ //anything else
        //console.log('admin + mod + everyone')
        switch (command){
            case 'support':
                //client.channels.cache.get('885199141037305916')
                client.channels.cache.get('877980154910081075').send(client.commands.get(command).execute(message, args))
                break;
            case 'authlink':
                //client.channels.cache.get('885199141037305916')
                client.commands.get(command).execute(message, args)
                break;
            case 'auth':
                //client.channels.cache.get('885199141037305916')
                //setTimeout(() => message.delete(), 1250)
                client.commands.get(command).execute(message, args)            
                break;
            case 'tocapri':
                client.commands.get(command).execute(message, args)            
                break;
        }
    }   
    
    if(leverage >= 3){ //moderator level
        //console.log('admin + mod')
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
        //console.log('admin only')
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
            case 'hubplayer':
                client.commands.get(command).execute(message, args)
                break;    
            case 'todo':
                client.commands.get(command).execute(message, args)
                break;
            case 'update':
                client.commands.get(command).execute(message, args)
                break
            case 'judgeontime':
                client.commands.get(command).execute(message, args)
                break
            case 'nsdr':
                const list = client.guilds.cache.get("803308964716347442");
                console.log(list) 
                // list.members.cache.forEach(member => console.log(member.user.username)); 
                break
        }
    }  

    
})

client.on('messageCreate', gotMessage);
    
function gotMessage(msg) {
    switch(msg.content){
        case 'I am amazing':
        case 'I am huge':
        case 'I am a god':
        case 'I am professional':
        case 'I am insane':
            msg.reply('You are💖');
            break;
        case 'me good':
            const ayy = client.emojis.cache.find(emoji => emoji.name === "pog");
            msg.reply(`${ayy}`);
            break;
        case 'me bad':
            const crycat = client.emojis.cache.find(emoji => emoji.name === "crycat");
            msg.reply(`${crycat}`);
            break;
        case 'I did it':
            const poggers = client.emojis.cache.find(emoji => emoji.name === "poggers");
            msg.reply(`${poggers}`);
            break;
    }
}

// LAMBDA-TOKEN
client.login('ODc1NDcyMjMyOTI5OTcyMzg0.YRWBDQ.7Gg6Jz7i4lkG2UeYT3a3z_-Lh-M'); //process.env.LAMBDA_TOKEN
