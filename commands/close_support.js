module.exports = {
    name: 'close_support',
    description: 'command that closes support for a user',
    execute(message, args) {

        if (!args[0]) return message.reply("Please put a valid player.")

        console.log("player " + args[0])

        let user_id = message.author.id

        const { guild } = message

        const member = guild.members.cache.get(user_id)

        var role = message.guild.roles.cache.find(role => role.name === "Support needed");
        console.log(role)
        member.roles.remove(role)

        setTimeout(() => message.delete(), 1500)
        
        return message.channel.send(`Support request closed for: ${args[0]}`)
    }
}