const mongoose = require('mongoose');
var Player = require('./player_schema.js');

module.exports = {
    name: 'auth',
    description: 'command that returns some JSON NON FORMATTED stats about justice verdicts',
    execute(message, args) {
       
        //checks if there is an argument - NEEDED
        if (!args[0]) return message.author.send("Please put the authorization string token ")

        //checks if the argument is greater than 25 - CANNOT BE > 25
        if (args[0].length != 12) return message.author.send("Please put a valid of valid measure")

        //checks if the argument is less than 0 - CANNOT BE < 0
        if (args[0] <= 0) return message.author.send("Please put a valid token")

        //I will set up some environment variables to use later
        let user_id = message.author.id;
        let input_id = args[0];
        let level = 'Level';

        //opening DB
        console.log("I WILL TRY CONNECTING NOW")

        var start = (new Date()).getTime();
        mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_CREDS}@cluster1.j7mnp.mongodb.net/purple-lambda?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        //if the DB is open, I will tell ya
        mongoose.connection.once('open', function () {

            console.log('Open & Connected!');

            //I will put the player on the search of the discord id aka discord_token

            (async () => {
                const filter = { discord_id: user_id };
                    console.log("a payer was found and modifications were made")

                    doc = await Player.findOne(filter);
           
                    console.log('before if:' + doc.token_auth + " and" + input_id)
                    console.log("doc = ")
                    console.log(doc)
                    console.log("player lvl : "+doc.skill_level + " player elo : "+doc.player_elo + " steam64 : "+doc.steam_64)
                    console.log(doc.token_auth + " and " + input_id +" ");                         
                    console.log(doc.token_auth == input_id);

                    //if the DB token is correct and coincides with the input from the player
                    if(doc.token_auth == input_id){
                        //player auth
                        message.author.send("You are authenticated in Purple Lambda. This is your HUB link:" +` https://faceit-oauth.herokuapp.com/faceit-hub?c=${Buffer.from(user_id, 'ascii').toString('base64')}`)                      

                        //HERE WE GIVE ROLES     
                        const { guild } = message
           
                        //I get the member to add the verified + level + (premium ? nothing) 
                        const member = guild.members.cache.get(user_id)

                        //getting from guild verified and level role
                        var verifiedRole = message.guild.roles.cache.find(role => role.name === "Verified");
                        var levelRole = message.guild.roles.cache.find(role => role.name === level+" "+doc.skill_level);

                        //if the player has more than 2.4k elo, he will be given only 2.4k elo role
                        if(doc.player_elo > 2401){
                            var masterEloRole = message.guild.roles.cache.find(role => role.name === "2400+");
                            member.roles.add(masterEloRole)
                        }else{
                            //if not, the player will be given any rank, based on his
                            member.roles.add(levelRole)
                        }

                        //add verified - for sure added
                        member.roles.add(verifiedRole)

                        if (doc.membership ) { //if there is a membership
                            console.log('there is a sub')
                            if(doc.membership == 'csgo' || doc.membership == 'premium'){ //if the membership is any subscription, allowed to play in premium queues
                                console.log('the sub is ' +doc.membership)
                                var premiumRole = message.guild.roles.cache.find(role => role.name === "Premium");
                                member.roles.add(premiumRole)
                            }
                        }
                        console.log('no sub')
                        
                        
                    }else{
                        message.author.send("The authentication has failed. This is probably because you inserted a wrong number. If the problem persists you can ask Support")
                    }          
            })();
            var stop = (new Date()).getTime();
            console.log('Took this long: ', (stop - start) / 1000);
            

            setTimeout(() => {
                mongoose.connection.close()
            }, 1500)

        }).on('error', function (error) {
            console.log("Err:\n" + error)
        })
    }
}
