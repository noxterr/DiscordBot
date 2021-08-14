const request = require('request');

module.exports = {
    name : 'judge',
    description : 'command that returns some JSON NON FORMATTED stats about justice verdicts',
    execute(message, args){
        request({
            url: `https://api.faceit.com/judge/v1/stats`,
            headers: {
                'Authorization': 'Bearer 01572f53-7fac-4796-9673-04dd54c1f467' //and old bearer c763eb50-c2ed-4874-b63b-8b000979177e
            },
            rejectUnauthorized: false
        }, function(err, res) {
            if(err) {
                console.error(err);
            } else {
                message.channel.send("Closed verdicts in justice and stats of justice "+res.body)
            }
        }); 
    }
}