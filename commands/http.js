const request = require('request');
require('dotenv').config();

module.exports = {
    name: 'http',
    description: 'command that closes support for a user',
    execute(message, args, id) {
        request({
            url: 'noxters.com/api/v2/prod/e/list',
            rejectUnauthorized: false
        }, function(err, res) {
            if(err) {
                console.error(err);
                message.channel.send("Something went wrong " + err)
            } else {
                const response = JSON.parse(res.body)
            }
        });
    }
}