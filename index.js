const Discord = require('discord.js');
const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const prefix = '-'
const fs = require('fs');
client.commands = new Discord.Collection();
const fetch = require('node-fetch')

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
                                    embedObject += `{"heroku":[{"app_status" : "${jsonHeroku.status[0].status}"}, {"data_status" : "${jsonHeroku.status[1].status}"}], "faceit_status" : "${jsonFaceit.status.description}" , "faceit_status_url" : "${jsonFaceit.page.url}"}`
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
                                { name: 'Heroku App Stats', value: (embedObject.heroku[0].app_status == 'green' ? '✅' : '❌'), inline: true  },
                                { name: 'Heroku Data Status', value: (embedObject.heroku[1].data_status == 'green' ? '✅' : '❌'), inline: true},
                                /* { name: '\u200B', value: '\u200B' },*/
                                { name: 'Faceit Stats', value: `[${embedObject.faceit_status}](${embedObject.faceit_status_url})`, inline: false },
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

    if(message.member.roles.cache.some(r => r.name === 'Administrator')){
        //an admin has availability of all commands -> level 5
        leverage = 5
    }else if(message.member.roles.cache.some(r => r.name === '@everyone')){
        leverage = 1
    }else if(message.member.roles.cache.some(r => r.name === 'Moderator')){
        leverage = 3
    }

    console.log("level: " + leverage)

    if(leverage >= 1){ //anything else
        console.log('admin + mod + everyone')
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
        console.log('admin + mod')
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
        console.log('admin only')
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
 
// LAMBDA-TOKEN
client.login(process.env.LAMBDA_TOKEN); //process.env.LAMBDA_TOKEN