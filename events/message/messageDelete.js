const Discord = require("discord.js")

const snipe = require("../../schema/snipe-schema")

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
    }
}