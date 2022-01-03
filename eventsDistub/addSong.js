const Discord = require("discord.js");

module.exports = {
  name: "addSong",
  async execute(client, queue, song) {
    const addSongEmbed = new Discord.MessageEmbed()
      .setTitle("💿|Agregado a la playlist")
      .setDescription(`${song.name}`)
      .setFooter(`Pedido: ${song.user.tag}`)
      .addField("link", `[Aqui](${song.url})`, true)
      .addField(`Duracion`, `${song.formattedDuration}`, true)
      .setThumbnail(song.thumbnail)
      .setColor("BLUE")
      .setTimestamp();

    queue.textChannel.send({ embeds: [addSongEmbed] });
  },
};
