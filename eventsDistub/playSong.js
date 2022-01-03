const Discord = require("discord.js");

module.exports = {
  name: "playSong",
  async execute(client, queue, song) {
    const playSongEmbed = new Discord.MessageEmbed()
      .setTitle("📀|Ahora escuchando")
      .setDescription(`${song.name}`)
      .setFooter(
        `Pedido: ${song.user.tag}`
      )
      .addField("link", `[Aqui](${song.url})`, true)
      .addField(`Duracion`, `${song.formattedDuration}`, true)
      .setThumbnail(song.thumbnail)
      .setColor("BLUE")
      .setTimestamp();

    queue.textChannel.send({ embeds: [playSongEmbed] });
  },
};
