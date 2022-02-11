const request = require('request');
require('dotenv').config();

module.exports = {
    name: 'savejudgestats',
    description: 'command that closes support for a user',
    execute(message, args, id) {

        let user_id = message.author.id

        let n = false;
        if(args[0] == '--n') {
            n = true;
        }

        if(user_id != '355265732940136448') {
            message.reply('You are not authorized to execute such command')
        } else {

            let body = {}
            let url = ""
            if (n) {
                url = "https://noxters.com/api/v1/faceit/justice/save?c=res"
                body = {
                    u: "noxter"
                }
            } else {
                url = "https://noxters.com/api/v1/faceit/justice/saveSpecific?c=res"
                body = {
                    u: "M1CHES;Irene_TS;lad00;thsiw;Bonanno;FINElias;NoStep0nSnek;Licmi_eXe;noxter;cody_sw;justMemo;LUGOW;OliverDPlace;M1XxY;xck;AleksTG"
                }
            }

            console.log(url)
            console.log(body)
            request.post({
                url: url,
                json: body,
                headers: {
                    'Content-type': 'application/json',
                    'Accept' : 'application/json',
                    'nox-auth-bearer': 'noxter',
                    'nox-auth-user': 'noxter'
                },
                rejectUnauthorized: false
            }, function(err, res) {
                if(err) {
                    console.error(err);
                    message.channel.send("Something went wrong " + err)
                } else {
                    const response = res.body
                    console.log(res.body)
                    if (response.errcode == 0) {
                        return message.reply('Success!')
                    } else {
                        return message.reply('There has been an error')
                    }
                }
            });
        }
    }
}