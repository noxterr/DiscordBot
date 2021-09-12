module.exports = {
    name : 'help',
    description : 'command that returns every command avaible now in the server',
    execute(message, args){

        message.channel.send("**Here's a list of all the commands avaible with this BOT**")
        
        let messageStringStart = "\`\`\`";
        
        let helpCmd =       "\n-help              -> This command will return the list of avaible commands in the system."
        let dateCmd =       "\n-date              -> This command will return a JSON of the actual time, and other infos about faceit API."
        let judgeCmd =      "\n-judge [n]         -> This command will return a JSON of the actual Justice Count Live if no arguments are passed. Passing a name will return the actual count of cases of that player."
        let clearCmd =      "\n-clear [n]         -> This command will clear n messages in a channel in a range 1-25, within the last 14 days."
        let authorizeCmd =  "\n-auth <t>          -> This command will authorize players, t is the data passed in this format -auth t. (t is the token)"
        let hubPlayer  =    "\n-hubplayer  <p>    -> This command will check for authorized players in the HUB, if they are not there, they are eligible to get sent an invite"



        messageStringEnd = "\`\`\`";

        messageStringStart = messageStringStart + helpCmd + clearCmd + dateCmd + judgeCmd +  authorizeCmd + hubPlayer +    messageStringEnd

        message.channel.send(messageStringStart)
    }
} 