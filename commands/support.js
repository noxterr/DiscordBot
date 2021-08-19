module.exports = {
    name: 'support',
    description: 'command that returns some JSON NON FORMATTED stats about justice verdicts',
    execute(message, args) {

        if (!args[0]) return message.reply("Please put a valid reason to contact support. Be specific as this will just make support faster solving your issue.")


        let user_id = message.author.id

        let supportRequest = `<@${user_id}> needs support, with this request:\n`+ args.join(' ')

        const { guild } = message

        const targetUser = message.mentions.users.first()
        console.log("targetUser "+ targetUser + " user_id " + user_id)

        const member = guild.members.cache.get(user_id)

        var role = message.guild.roles.cache.find(role => role.name === "Support needed");
        console.log(role);

        member.roles.add(role)

        
        return supportRequest
    }
}