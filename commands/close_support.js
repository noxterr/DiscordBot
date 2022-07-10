module.exports = {
    name: 'close_support',
    description: 'command that closes support for a user',
    execute(message, args) {
        if (!args[0]) message.reply("Please put a valid player.")

        let user_id = message.author.id

        const { guild } = message

        const member = guild.members.cache.get(user_id)

        var role = message.guild.roles.cache.find(role => role.name === "Support needed");

        member.roles.remove(role)

        return message.channel.send(`Support request closed for: ${args[0]}`)
    }
}