const mongoose = require('mongoose');
var Player = require('./player_schema.js');

module.exports = {
    name: 'authorize',
    description: 'command that returns some JSON NON FORMATTED stats about justice verdicts',
    execute(message, args) {
        //checks if there is an argument - NEEDED
        if (!args[0]) return message.reply("Please put the authorization string token ")

        //checks if the argument is greater than 25 - CANNOT BE > 25
        if (args[0].length != 12) return message.reply("Please put a valid of valid measure")

        //checks if the argument is less than 0 - CANNOT BE < 0
        if (args[0] <= 0) return message.reply("Please put a valid token")


        //I will get the user ID now
        let user_id = message.author.id
        let input_id = " "+args[0]

        //opening DB
        console.log("I WILL TRY CONNECTING NOW")

        var start = (new Date()).getTime();
        mongoose.connect('mongodb+srv://noxter:ZapataDuvan72@cluster1.j7mnp.mongodb.net/purple-lambda?retryWrites=true&w=majority', {
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

                    if(doc.token_auth === input_id){
                        //player auth
                        console.log('player auth')

                        //HERE WE GIVE THE ROLE     Verified

                        const { guild } = message

                        const targetUser = message.mentions.users.first()
                        console.log("targetUser "+ targetUser + " user_id " + user_id)

                        const member = guild.members.cache.get(user_id)

                        var role = message.guild.roles.cache.find(role => role.name === "Verified");
                        console.log(role);

                        member.roles.add(role)

                        console.log(member)

                        message.reply("player auth")
                    }else{
                        console.log('auth failed')
                        message.reply("The authentication has failed. This is probably because you inserted a wrong number. If the problem persists you can ask Support")
                    }
                
            })();
            console.log('Asynchronous this')

            console.log('Eventually res.end')
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
