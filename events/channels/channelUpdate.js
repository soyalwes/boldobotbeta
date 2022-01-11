const Discord = require("discord.js");

const logs = require("../../schema/logs-schema");

module.exports = {
  name: "channelUpdate",
  async execute(client, oldChannel, newChannel) {
    let datos = await logs.findOne({ guildId: newChannel.guild.id });

    if (!datos) return;

    if (datos.Status === false) return;

    if (datos.Status === true) {
      let types = {
        GUILD_TEXT: "Texto",
        GUILD_CATEGORY: "Categoria",
        GUILD_VOICE: "Voz",
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
        .setColor("BLUE");
        
        client.channels.cache.get(datos.channelId).send({embeds:[embedChannelUpdate]})
    }
  },
};
