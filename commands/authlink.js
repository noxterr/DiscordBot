module.exports = {
    name : 'authlink',
    description : 'command that sends a link',
    execute(message, args){

        let user = message.author.id
        console.log(message.author.id)

        let userCB = user.toString('base64');
        console.log(userCB)

        message.channel.send("Link to authorize with faceit :" + `https://faceit-oauth.herokuapp.com/?p=${userCB}`)
    }
}
