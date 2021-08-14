module.exports = {
    name : 'help',
    description : 'command that returns every command avaible now in the server',
    execute(message, args){

        message.channel.send("**Here's a list of all the commands avaible with this BOT**")
        
        let messageStringStart = "\`\`\`";
        
        let helpCmd =  "\n-help       -> This command will return the list of avaible commands in the system."
        let dateCmd =  "\n-date       -> This command will return a JSON of the actual time, and other infos about faceit API."
        let judgeCmd = "\n-judge [n]  -> This command will return a JSON of the actual Justice Count Live if no arguments are passed. Passing a name will return the actual count of cases of that player."
        let clearCmd = "\n-clear [n]  -> This command will clear n messages in a channel in a range 1-25, within the last 14 days."
        let authorizeCmd = "\n-auth <d>   -> This command will authorize players, d is the data passed in this format <player_id:token>.🔜"


        messageStringEnd = "\`\`\`";

        messageStringStart = messageStringStart + helpCmd + clearCmd + dateCmd + judgeCmd +  authorizeCmd+    messageStringEnd

        message.channel.send(messageStringStart)
    }
} 