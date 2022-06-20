const request = require('request');
require('dotenv').config();

module.exports = {
    name: 'http',
    description: 'command that closes support for a user',
    execute(message, args, id) {
        let url = ''
        if (args && args.length > 0 && args[0] != '') {
            url = args[0]
        } else {
            url = 'https://www.noxters.com/api/v2/prod/e/list'
        }
        request.post({
            url: url,
            headers: {
                'Content-type': 'application/json',
                'Accept' : 'application/json'
            }
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