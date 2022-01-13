const Discord = require("discord.js");

const logs = require("../../schema/logs-schema");

module.exports = {
  name: "channelUpdate",
  async execute(client, oldChannel, newChannel) {
    try {
      let datos = await logs.findOne({ guildId: newChannel.guild.id });

      if (!datos) return;

      if (datos.Status === false) return;

      if (datos.Status === true) {
        let types = {
          GUILD_TEXT: "Texto",
          GUILD_CATEGORY: "Categoria",
          GUILD_VOICE: "Voz",
          GUILD_NEWS: "Anuncios",
          GUILD_STAGE_VOICE: "Esenario",
        };

        const embedChannelUpdate = new Discord.MessageEmbed()
          .setTitle("Canal acutalizado")
          .addField(
            "Nombre",
            `Viejo: ${oldChannel.name}, Nuevo: ${newChannel.name}`
          )
          .addField("Tipo", `${types[newChannel.type]}`, true)
          .addField("Categoria", `${newChannel.parent}`, true)
          .addField("ID", `${newChannel.id}`, true)
          .addField("Creado", `<t:${Math.floor(Date.now() / 1000)}>`, true)
          .setColor("BLUE");

        client.channels.cache
          .get(datos.channelId)
          .send({ embeds: [embedChannelUpdate] });
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
