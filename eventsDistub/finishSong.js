const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "finishSong",
    async execute(client, queue, song){

        const finishEmbed = new MessageEmbed()
        .setTitle("🎼|Cancion terminada")
        .setDescription(`${song.name} ha terminado`)
        .addField("link", `[Aqui](${song.url})`, true)
        .addField(`Duracion`, `${song.formattedDuration}`, true)
        .setThumbnail(song.thumbnail)
        .setColor("BLUE")
        .setTimestamp()
        
        queue.textChannel.send({embeds:[finishEmbed]})
    }
}