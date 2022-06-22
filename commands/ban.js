require('dotenv').config();


module.exports = {
    name : 'ban',
    description : 'command that returns the list of bans attached to a user',
    execute(message, args){
        // if(args.length==0){
        //     return message.reply("Why you think this command works if you don't put anything?")
        // }

        message.channel.send('Soon this will work')
    }
}

