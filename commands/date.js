const request = require('request');

module.exports = {
    name : 'date',
    description : 'command that returns some JSON NON FORMATTED stats about time via an API call',
    execute(message, args){
        request({
            url: `https://api.faceit.com/time`,
            headers: {
                'Authorization': `Bearer ${process.env.JUSTICE_BEARER_KEY}` //and old bearer c763eb50-c2ed-4874-b63b-8b000979177e
            },
            rejectUnauthorized: false
        }, function(err, res) {
            if(err) {
                console.error(err);
            } else {          
                let json = JSON.parse(res.body)
                message.channel.send("\`\`\`\nDate: " + json.payload.date+"\nUnix Time: " +json.payload.unix_time + "\nServer Epoch Time: " +json.server_epoch_time + "\nVersion: " +json.version + "\`\`\`")
            }
    
        }); 
    }    
}