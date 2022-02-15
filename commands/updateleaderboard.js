const request = require('request');
require('dotenv').config();

module.exports = {
    name : 'updateleaderboard',
    description : 'command that saves justice leaderboard of each month',
    execute(message, args){

        console.log(args)

        if (!args[0] || args[0].length == 0) return message.reply("User required")

        if (args[0] && !args[1]) return message.reply(args[0] + "'s position required")

        if (!args[1]) return message.reply("Position required")

        if (args[1] <= 0) return message.reply("Actually a position that makes sense is required")

        if (args[1] > 10) return message.reply("Leaderboard limitations in place")

        body = {
            name: args[0],
            position : args[1]
        }


        request.post({
            url: 'https://www.noxters.com/api/v2/faceit/justice/leaderboard/save',
            json: body,
            headers: {
                'Content-type': 'application/json',
                'Accept' : 'application/json',
                'Authorization': 'Bearer noxter',
            },
            rejectUnauthorized: false
        }, function(err, res) {
            if(err) {
                console.error(err);
                message.channel.send("Something went wrong " + err)
            } else {
                console.log(res.body)
                const response = res.body
                return message.reply(response.errcode == 0 ? response.message : 'There has been an error')
            }
        });
    }
}

//heroku logs --tail