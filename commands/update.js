const mongoose = require('mongoose');
var Player = require('./player_schema.js');
const request = require('request');

module.exports = {
    name : 'update',
    description : 'command that updates all record in the DB',
    execute(message, args){

        if(args.length > 0){
            //a specific player is required to be updated

            let regex = /(([a-z]?\d?)*){8}(-(([a-z]?\d?)*){4}){3}-(([a-z]?\d?)*){12}/;
            let defaultURL = "";

            //setup of the filter for the player
            let number = parseInt(args[0]);
            if(number.toString().length == args[0].length){
                //send error message because you cannot update based on discord id
                return message.reply("No discord ID allowed for this command. Please put a valid FACEIT user name or FACEIT player ID")
            }

            if(Number.isNaN(parseInt(args[0]))) {
                console.log("Args[0] is the faceit username, thus is the nickname is: " + args[0]);
                let nickname  = args[0];
                filter = { nickname: nickname };
                defaultURL = "https://open.faceit.com/data/v4/players?nickname=";
            } else {
                if (args[0].match(regex)) {
                    console.log("Args[0] is the faceit user_id, thus is the faceit user ID: " + args[0]);
                    let player_id = args[0];
                    filter = { player_id: player_id };
                    defaultURL = "https://open.faceit.com/data/v4/players/";
                }
            }



            //database connection + time of connection
            var start = (new Date()).getTime();
            mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_CREDS}@cluster1.j7mnp.mongodb.net/purple-lambda?retryWrites=true&w=majority`, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });

            //if the DB is open, I will tell ya
            mongoose.connection.once('open', function () {
                request({
                    url: defaultURL + args[0],
                    headers: {
                        'Authorization': `Bearer ${process.env.API_BEARER_KEY}`
                    }
                }, function(err, json) {
                    if(err) {
                        console.error(err);
                    } else {
                        let dataJson = JSON.parse(json.body);

                        if(dataJson.errors != undefined){
                            if(dataJson.errors[0].http_status == 404) {
                                return message.reply("There has been some kind of error in the request, try using another parameter");
                            }
                        }else{
                            //I make a query to the DB via discord_id
                            (async () => {

                                let doc = await Player.findOneAndUpdate(filter, {
                                    player_elo : dataJson.games.csgo.faceit_elo,
                                    skill_level : dataJson.games.csgo.skill_level,
                                    nickname: dataJson.games.csgo.game_player_name
                                },{
                                    new: true
                                });

                                if(doc){
                                    return message.reply("The data of " + doc.nickname + " has been updated in the database");
                                }else{
                                    return message.reply("There has been some kind of error in the request in the database");
                                    console.log("no doc");
                                }

                            })();
                        }
                    }
                });

            }).on('error', function (error) {
                console.log("Err:\n" + error)
            })

        } else{
            //every user in the database is required to be updated
            let playerData = [];
            let length = 0

            //database connection
            mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_CREDS}@cluster1.j7mnp.mongodb.net/purple-lambda?retryWrites=true&w=majority`, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });

            //if the DB is open, I will tell ya
            mongoose.connection.once('open', function () {
                //I will make a query to get every player_id + the length of the whole for loop
                (async () => {
                    doc = await Player.find({});

                    for (let j = 0; j < doc.length; j++) {
                        playerData[j] = {
                            discord_id: doc[j].discord_id,
                            player_id: doc[j].player_id
                        }
                    }
                    length = doc.length;
                })();

                setTimeout(() => {
                    //I loop over each player, making an API call
                    for (let i = 0; i < length; i++) {
                        //I make an API call with request, and get a JSON object

                        request({
                            url: `https://open.faceit.com/data/v4/players/${doc[i].player_id}`,
                            headers: {
                                'Authorization': `Bearer ${process.env.API_BEARER_KEY}`
                            }
                        }, function(err, json) {
                            if(err) {
                                console.error(err);
                            } else {
                                let dataJson = JSON.parse(json.body);

                                //checking for errors
                                if(dataJson.errors != undefined){
                                    if(dataJson.errors[0].http_status == 404) {
                                        return message.reply("There has been some kind of error in the request, try using another parameter");
                                    }
                                }else{
                                    //I make a query to the DB via discord_id
                                    (async () => {
                                        let filter = {discord_id : playerData[i].discord_id}

                                        let doc = await Player.findOneAndUpdate(filter, {
                                            player_elo : dataJson.games.csgo.faceit_elo,
                                            skill_level : dataJson.games.csgo.skill_level,
                                            nickname: dataJson.games.csgo.game_player_name
                                        },{
                                            new: true
                                        });

                                        if(doc){
                                            return message.reply("The data of all users has been updated in the database");
                                        }else{
                                            return message.reply("There has been some kind of error in the request in the database");
                                        }

                                    })();
                                }
                            }
                        });
                    }
                } ,1500);



            }).on('error', function (error) {
                console.log("Err:\n" + error)
            })
        }
    }
}


