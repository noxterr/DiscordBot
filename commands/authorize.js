var mysql = require('mysql');

module.exports = {
    name : 'authorize',
    description : 'command that returns some JSON NON FORMATTED stats about justice verdicts',
    execute(message, args){
        //checks if there is an argument - NEEDED
        if(!args[0]) return message.reply("Please put the authorization string token ")

        //checks if the argument is greater than 25 - CANNOT BE > 25
        if(args[0].length != 12) return message.reply("Please put a valid of valid measure")

        //checks if the argument is less than 0 - CANNOT BE < 0
        if(args[0] <= 0 ) return message.reply("Please put a valid token")


        var con = mysql.createConnection({
            host: process.env.ACCESS_DB_IP,     //ACCESS_DB_IP
            user: process.env.ACCESS_DB_USER,   //ACCESS_DB_USER
            password: process.env.ACCESS_DB_PASSWORD,   //ACCESS_DB_PASSWORD
            database: process.env.ACCESS_DB_TABLE   //ACCESS_DB_TABLE
        });

        let sql = "SELECT * FROM cha_auth"
        con.connect(function(err) {
            if (err){
                message.channel.send("\`Issues with the DB, please check logs\`")
                console.log(err)
            }else{
                console.log("Connected!");
                con.query(sql, function (err, result) {
                    if (err){
                        message.channel.send("\`Issues with the query, please check logs\`")
                        console.log(err)
                    }else{
                        let data = ""
                        Object.keys(result).forEach(function(key) {
                            var row = result[key];
                            data += row.token_auth

                            if(row.token_auth == args[0]){
                                message.channel.send("\`Authorized\`")
                            }else{
                                message.channel.send("\`NOT Authorized, you suck balls\`")
                            }
                        });
                    }             
                });
            }
        }); 
    }
}
