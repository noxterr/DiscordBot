var mysql = require('mysql');

module.exports = {
    name : 'query',
    description : 'command that tries the DB',
    execute(message, args){

        //db name -> purple-lambda

        var con = mysql.createConnection({
            host: process.env.ACCESS_DB_IP,     //ACCESS_DB_IP
            user: process.env.ACCESS_DB_USER,   //ACCESS_DB_USER
            password: process.env.ACCESS_DB_PASSWORD,   //ACCESS_DB_PASSWORD
            database: process.env.ACCESS_DB_TABLE   ,   //ACCESS_DB_TABLE
            port: process.env.ACCESS_DB_PORT //ACCESS_DB_PORT
        });


        let sql = "SELECT * FROM cha_admin"
        con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            con.query(sql, function (err, result) {
                if (err) throw err;
                let data = ""
                Object.keys(result).forEach(function(key) {
                    var row = result[key];
                    data += row.player_name + " "
                });
                message.channel.send("Stats from \`Query\`:" +data)
            });
        });        
    }
}
