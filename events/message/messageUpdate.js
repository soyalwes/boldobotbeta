const Discord = require("discord.js");

const logs = require("../../schema/logs-schema");

module.exports = {
    name: "messageUpdate",
    async execute(client, oldMessage, newMessage) {
        const datos = await logs.findOne({ guildId: newMessage.guild.id})
        if(!datos)return

        if(datos.Status === false)return

        if(datos.Status === true){
            const newMessageEmbed = new Discord.MessageEmbed()
            .setTitle("Mensaje actualizado")
            .addField(`Mensaje`, `Viejo: ${oldMessage}. Nuevo: ${newMessage}`)
            .addField("Canal", `${newMessage.channel}`)
            .addField("Autor", `${newMessage.author}`)
            .addField("ID", `${newMessage.id}`)

            client.channels.cache.get(datos.channelId).send({embeds:[newMessageEmbed]})
        }
    }
}