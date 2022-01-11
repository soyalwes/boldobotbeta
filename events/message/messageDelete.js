const Discord = require("discord.js")

const snipe = require("../../schema/snipe-schema")

const logs = require("../../schema/logs-schema.js")

module.exports = {
    name:"messageDelete",
    async execute (client, message) {
         let datos = await snipe.findOne({guildId: message.guild.id}, {channelId: message.channel.id})

        if(!datos){
            let newDatos = new snipe({
                guildId: message.guild.id,
                channelId: message.channel.id,
                message: message.content,
                author: message.author.tag,
                authorId: message.author.id,
                time: Math.floor(Date.now() / 1000 )
            })
            return await newDatos.save()
        }

        await snipe.findOneAndUpdate({
            guildId: message.guild.id,
            channelId: message.channel.id,
            message: message.content,
            author: message.author.tag,
            authorId: message.author.id,
            time: Math.floor(Date.now() / 1000)
        })

        let data = await logs.findOne({guildId: message.guild.id})
        if(!data)return
        if(data.Status === false)return
        if(data.Status === true){
            
            const embedDelelteMess = new Discord.MessageEmbed()
            .setTitle("Mensaje borrado")
            .setDescription(`Mensaje: ${message.content}`)
            .addField("Autor", `${message.author}`, true)
            .addField("Canal", `${message.channel}`, true)
            .addField("Tiempo", `<t:${Math.floor(Date.now() / 1000)}>`,true)
            .setColor("RED")
            .setTimestamp()

            client.channels.cache.get(data.channelId).send({embeds:[embedDelelteMess]})
        }

    }
}