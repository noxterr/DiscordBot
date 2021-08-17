module.exports = {
    name : 'authlink',
    description : 'command that sends a link',
    execute(message, args){

        let user = message.author.id
        console.log(message.author.id)
<<<<<<< HEAD

        //let userCB = Buffer.from(user, 'ascii').toString('base64')
=======

        let userCB = Buffer.from(user, 'ascii').toString('base64')

        console.log(userCB)
>>>>>>> f8175dd07a4723039d18151fbac8e1ec45c64478

        //console.log(userCB)

        message.channel.send("Link to authorize with faceit :" + `https://faceit-oauth.herokuapp.com/?p=${user}`)
    }
}
