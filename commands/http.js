const request = require('request');
require('dotenv').config();

module.exports = {
    name: 'http',
    description: 'command that closes support for a user',
    execute(message, args, id) {
        request.post({
            url: 'https://www.noxters.com/api/v2/prod/e/list',
            headers: {
                'Content-type': 'application/json',
                'Accept' : 'application/json'
            },
            rejectUnauthorized: false
        }, function(err, res) {
            if(err) {
                console.error(err);
                message.channel.send("Something went wrong " + err)
            } else {
                const response = JSON.parse(res.body)
                return message.reply(response.message)
            }
        });
    }
}