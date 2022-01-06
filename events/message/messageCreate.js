const Discord = require("discord.js");
const fetch = require("node-superfetch");
const afk = require("../../schema/afk-schema");

module.exports = {
  name: "messageCreate",
  async execute(client, message) {

    let datos = await afk.findOne({
      guildId: message.guild.id,
      userId: message.member.id,
    });

    if (!datos) return;

    if (datos.Status === false) return;

    if (datos.Status === true) {

      message.channel.send({
        content: `Bienvenido, actualizare los datos para quitarte el afk`,
      });

      await afk.findOneAndUpdate({
        guildId: message.guild.id,
        userId: message.member.id,
        Status: false,
      });
    }

  },
};
