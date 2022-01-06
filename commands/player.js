const request = require('request');
require('dotenv').config();


module.exports = {
    name : 'player',
    description : 'command that returns some JSON NON FORMATTED stats about justice verdicts',
    execute(message, args){
        if(args.length==0){
            return message.reply("Why you think this command works if you don't put anything?")
        }    

        request({
            url: `https://open.faceit.com/data/v4/players?nickname=`+args[0],
            headers: {
                'Authorization': `Bearer ${process.env.API_BEARER_KEY}`
            },
            rejectUnauthorized: false
        }, function(err, res) {
            if(err) {
                console.error(err);
                message.channel.send("Something went wrong " + err)
            } else {
                let obj = JSON.parse(res.body)
                let uriParser = obj.faceit_url.split('{lang}')
                let url = uriParser[0] + 'en' + uriParser[1]
                message.channel.send('```Player ' + obj.nickname + ' has player_id: ' + obj.player_id + ' Steam_id_64: ' + obj.steam_id_64 +'```'+ `${(url)}`) 
            }
        });

    }
}

//heroku logs --tail