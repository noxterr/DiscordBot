module.exports = {
    name : 'clear',
    description : 'command that clears messages',
    async execute(message, args){

        //checks if there is an argument - NEEDED
        if(!args[0]) return message.reply("Please put the number of messages you want to delete")

        //checks if the argument is a number- CANNOT BE A STRING
        if(isNaN(args[0])) return message.reply("Please put a valid number")

        //checks if the argument is greater than 25 - CANNOT BE > 25
        if(args[0] > 25) return message.reply("Please put a valid number within 1 - 25 range")

        //checks if the argument is less than 0 - CANNOT BE < 0
        if(args[0] <= 0 ) return message.reply("Please put a valid number within 1 - 25 range")


        await message.channel.messages.fetch({
            limit: args[0]
        }).then(messages =>{
            message.channel.bulkDelete(messages)
            if(args[0] < 2){
                message.channel.send("\`"+args[0] + " message has been deleted\`")
            }else{
                message.channel.send("\`"+args[0] + " messages have been deleted\`")
            }
        })
    }
}