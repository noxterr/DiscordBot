module.exports = {
    name : 'authlink',
    description : 'command that sends a link',
    execute(message, args){

        let user_id = message.author.id
        let user_name = message.author.username
        console.log(message.author.id)
        console.log(message.author)

        let userCB = Buffer.from(user_id, 'ascii').toString('base64')
        let userNameCB = Buffer.from(user_name, 'ascii').toString('base64')
        console.log(userCB)

        message.author.send("Link to authorize with faceit :" + `https://faceit-oauth.herokuapp.com/?p=${userCB}&n=${userNameCB}`)

        setTimeout(() => message.delete(), 1500)
    }
}
