const Discord = require("discord.js");

const logs = require("../../schema/logs-schema");

module.exports = {
  name: "channelCreate",
  async execute(client, channelCreate) {
    let datos = await logs.findOne({ guildId: channelCreate.guild.id });

    if (!datos) return;

    if (datos.Status === false) return;

    if (datos.Status === true) {
      let types = {
        GUILD_TEXT: "Texto",
        GUILD_CATEGORY: "Categoria",
        GUILD_VOICE: "Voz",
      };

      const embedChannelNew = new Discord.MessageEmbed()
        .setTitle("Canal creado")
        .addField("Nombre", `${channelCreate.name}`, true)
        .addField("Categoria", `${channelCreate.parent}`, true)
        .addField("Tipo", `${types[channelCreate.type]}`, true)
        .addField("ID", `${channelCreate.id}`, true)
        .addField("Creado", `<t:${Math.floor(Date.now() / 1000)}>`, true)
        //.addField("Autor", `${channelCreate.author}`, true)
        .setColor("GREEN")
        .setTimestamp();

      client.channels.cache
        .get(datos.channelId)
        .send({ embeds: [embedChannelNew] });
    }
  },
};
