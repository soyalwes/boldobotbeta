const Discord = require("discord.js");

const logs = require("../../schema/logs-schema");

module.exports = {
  name: "channelDelete",
  async execute(client, channelDelete) {
    try {
      let datos = await logs.findOne({ guildId: channelDelete.guild.id });

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

        const embedChannelDelete = new Discord.MessageEmbed()
          .setTitle("Canal eliminado")
          .addField("Nombre", `${channelDelete.name}`, true)
          .addField("Categoria", `${channelDelete.parent}`, true)
          .addField("Tipo", `${types[channelDelete.type]}`, true)
          .addField("ID", `${channelDelete.id}`, true)
          .addField("Creado", `<t:${Math.floor(Date.now() / 1000)}>`, true)
          .setColor("RED");

        client.channels.cache
          .get(datos.channelId)
          .send({ embeds: [embedChannelDelete] });
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
