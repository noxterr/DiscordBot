const Discord = require('discord.js');
const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const prefix = '-'
const fs = require('fs');
client.commands = new Discord.Collection();
const fetch = require('node-fetch')
require('dotenv').config();
const common = require('./lib/common')

const commandFile = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'))
for(const file of commandFile){
    const command = require(`./commands/${file}`)

    client.commands.set(command.name, command)
}

client.once('ready' , () => {

    async function edit(){

        const channel = await client.channels.fetch('878988648916320266')
        channel.messages.fetch().then((messages) => {
            if(messages.size === 0){
                console.error('Message size is not compatible with standardized output')
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

    // Getting the arguments of the command
    const args = message.content.slice(prefix.length).split(" ")

    // Getting the name of the command
    const command = args.shift().toLowerCase()

    // Setting up role permission
    let leverage = 0
    if(message.member.roles.cache.some(r => r.name === 'Administrator') || message.member.roles.cache.some(r => r.name === 'ADMIN')){
        leverage = 3
    }else if(message.member.roles.cache.some(r => r.name === '@everyone')){
        leverage = 1
    }else if(message.member.roles.cache.some(r => r.name === 'Moderator')){
        leverage = 2
    }


    if(args[0] != null){
        client.channels.cache.get('885199141037305916').send("\`-"+command + " " + args[0] + "\` has been typed into a channel from `" + `${message.member.user.username}`+"`") // need to tag on logs? `<@${message.member.user.id}>`
    }else{
        client.channels.cache.get('885199141037305916').send("\`-"+command + "\` has been typed into a channel from `" + `${message.member.user.username}` +"`")// need to tag on logs? `<@${message.member.user.id}>`
    }

    const res = common.isUserAllowed(command, leverage)

    if (res.errcode == 0) {
        client.commands.get(command).execute(message, args)
    } else {
        message.reply(res.message)
    }
})

// LAMBDA-TOKEN
client.login(process.env.LAMBDA_TOKEN); //process.env.LAMBDA_TOKEN
