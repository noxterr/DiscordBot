module.exports = {
    name: 'support',
    description: 'command that allows an user to be contacted via support',
    execute(message, args) {

        if (!args[0]) return message.reply("Please put a valid reason to contact support. Be specific as this will just make support faster solving your issue.")


        let user_id = message.author.id

        let supportRequest = `Hey <@&833469853310517258>. <@${user_id}> needs support, with this request:\n`+ args.join(' ')

        const { guild } = message

        const member = guild.members.cache.get(user_id)

        var role = message.guild.roles.cache.find(role => role.name === "Support needed");
        member.roles.add(role)

        setTimeout(() => message.delete(), 1500)

        return supportRequest
    }
}