const Discord = require("discord.js");

const logs = require("../../schema/logs-schema");

module.exports = {
  name: "channelDelete",
  async execute(client, channelDelete) {
    let datos = await logs.findOne({ guildId: channelDelete.guild.id });

    if (!datos) return;

    if (datos.Status === false) return;

    if (datos.Status === true) {
      let types = {
        GUILD_TEXT: "Texto",
        GUILD_CATEGORY: "Categoria",
        GUILD_VOICE: "Voz",
      };

      const embedChannelDelete = new Discord.MessageEmbed()
      .setTitle("Canal eliminado")
      .addField("Nombre", `${channelDelete.name}`, true)
      .addField("Categoria", `${channelDelete.parent}`, true)
      .addField("Tipo", `${types[channelDelete.type]}`, true)
      .addField("ID", `${channelDelete.id}`, true)
      .setColor("RED")

      client.channels.cache.get(datos.channelId).send({embeds:[embedChannelDelete]})
    }
  },
};
