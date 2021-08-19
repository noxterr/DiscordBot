module.exports = {
    name : 'authlink',
    description : 'command that sends a link',
    execute(message, args){

        let user = message.author.id
        console.log(message.author.id)


        let userCB = Buffer.from(user, 'ascii').toString('base64')
        console.log(userCB)

        message.author.send("Link to authorize with faceit :" + `https://faceit-oauth.herokuapp.com/?p=${userCB}`)

        setTimeout(() => message.delete(), 1500)
    }
}
