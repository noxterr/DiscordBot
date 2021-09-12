const request = require('request');
const mongoose = require('mongoose');
var Player = require('./player_schema.js');


module.exports = {
    name : 'hubplayer',
    description : 'command that returns some JSON NON FORMATTED stats about justice verdicts',
    execute(message, args){
        let apiBearer = "c763eb50-c2ed-4874-b63b-8b000979177e";
        let uriId = "b455f6bf-1648-4a1f-a615-fc31c0814315";
        let regex = /(([a-z]?\d?)*){8}(-(([a-z]?\d?)*){4}){3}-(([a-z]?\d?)*){12}/;
        //HUB URI b455f6bf-1648-4a1f-a615-fc31c0814315
        //API KEY c763eb50-c2ed-4874-b63b-8b000979177e
        //HUB API LINK https://open.faceit.com/data/v4/hubs/b455f6bf-1648-4a1f-a615-fc31c0814315/members?offset=0&limit=100
        //API PLAYER LINK https://open.faceit.com/data/v4/players?nickname=noxter

        //checks if there is an argument - NEEDED
        if (!args[0]) return message.reply("Please put a valid faceit player name")

        //checks if the argument is greater than 25 - CANNOT BE > 25
        if (args[0].length == 0) return message.reply("Please put a valid faceit player name")

        //checks if the argument is less than 0 - CANNOT BE < 0
        if (args[0] <= 0) return message.reply("Please put a valid faceit player name")

        //opening DB
        console.log("I WILL TRY CONNECTING NOW")
        mongoose.connect('mongodb+srv://noxter:ZapataDuvan72@cluster1.j7mnp.mongodb.net/purple-lambda?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        let  filter = {};

        try{
            let number = parseInt(args[0]);
            if(number.toString().length == args[0].length){
                console.log("Args[0] is not a string, thus is the discord ID: " + args[0]);
                let disc_id = args[0];
                filter = { discord_id: disc_id };
            } 

            if(Number.isNaN(parseInt(args[0]))) {
                console.log("Args[0] is the faceit username, thus is the nickname is: " + args[0]);
                let nickname  = args[0];
                filter = { nickname: nickname };
            } else {
                if (args[0].match(regex)) {
                    console.log("Args[0] is the faceit user_id, thus is the faceit user ID: " + args[0]);
                    let player_id = args[0];
                    filter = { player_id: player_id };
                }
            } 

        }catch(e){
            console.log(e);
        }

        console.log(filter)

        //open the DB connection
        mongoose.connection.once('open', function () {
            (async () => {
                //check for which type of filter we should apply: nickname, discord_id or faceit_player_id
               
                doc = await Player.findOne(filter);
                console.log(filter)
                if(doc){
                    console.log(doc)
                    //player is authorized
                    //here we check if the player is in the HUB
                    request({
                        url: `https://open.faceit.com/data/v4/players?nickname=${doc.nickname}`,
                        headers: {'Authorization': 'Bearer c763eb50-c2ed-4874-b63b-8b000979177e'},
                        rejectUnauthorized: false
                    }, function(err, res) {
                        if(err) {
                            console.error(err);
                            message.reply("Something went wrong - if problem persists, contact <@355265732940136448> or FaceIt staff")
                        } else {
                            json = JSON.parse(res.body)
                        
                            request({
                                url: `https://open.faceit.com/data/v4/hubs/b455f6bf-1648-4a1f-a615-fc31c0814315/members?offset=0&limit=100`,
                                headers: {'Authorization': 'Bearer c763eb50-c2ed-4874-b63b-8b000979177e'},
                                rejectUnauthorized: false
                            }, function(errHub, resHub) {
                                if(errHub) {
                                    console.error(errHub);
                                    message.reply("Something went wrong - if problem persists, contact <@355265732940136448> or FaceIt staff")
                                } else {
                                    jsonHub = JSON.parse(resHub.body)
                                    let isNotInHub = true;
                                    for (let i = 0; i < jsonHub.items.length; i++) {
                                        if(jsonHub.items[i].user_id == json.player_id){
                                            message.reply(`Player ${args[0]} is in the HUB`)
                                            isNotInHub = false;
                                            break
                                        }else{
                                            isNotInHub = true;
                                        }
                                    }
                                    if(isNotInHub){
                                        message.reply(`Player ${args[0]} is not playing the HUB, you can send him a link`)
                                    }
                                }
                            });
                        }
                    });
                } else {
                    //player is NOT authorized
                    message.reply(`Player ${args[0]} is not authorized to play in the HUB`);
                }
            })();
        });

        setTimeout(() =>{
            mongoose.connection.close()
        }, 2500)
    }
}