const Discord = require("discord.js");

module.export = {
  name: "guildBanRemove",
  async execute(client, guild, user) {
    try {
      let datos = await logs.findOne({ guildId: user.guild.id });

      if (!datos) return;

      if (datos.Status === false) return;

      if (datos.Status === true) {
        const emojiNewEmbed = new Discord.MessageEmbed()
          .setTitle("Miembro desbaneado")
          .addField("Miembro", `${user.tag}`)
          .addField("Id", `${user.id}`)
          .setColor("RED");

        client.guild.channels.cache
          .get(datos.channelId)
          .send({ embeds: [emojiNewEmbed] });
      }
    } catch (e) {
      await logs.findOneAndUpdate({
        guildId: interaction.guild.id,
        channelId: interaction.channel.id,
        Status: false,
      });
    }
  },
};
