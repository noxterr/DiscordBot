module.exports = {
    name : 'authlink',
    description : 'command that sends a link',
    execute(message, args){

        message.channel.send("Link to authorize with faceit :" + 'https://faceit-oauth.herokuapp.com/')
        
    }
}