const Discord = require("discord.js");
const fetch = require("node-superfetch");
const afk = require("../../schema/afk-schema");

module.exports = {
  name: "messageCreate",
  async execute(client, message) {
    if(message.author.bot)return

    let datos = await afk.findOne({
      guildId: message.guild.id,
      userId: message.author.id,
    });

    if (!datos) return;

    if (datos.Status === false) return;

    if (datos.Status === true) {
      message.channel.send({
        content: `Bienvenido, actualizare los datos para quitarte el afk`,
      });

      try {
        message.member.setNickname(`${message.author.username}`);

        await afk.findOneAndUpdate({
          guildId: message.guild.id,
          userId: message.member.id,
          Status: false,
        });
      } catch (e) {
        console.log(e)
        await afk.findOneAndUpdate({
          guildId: message.guild.id,
          userId: message.member.id,
          Status: false,
        });
      }

      if(message.mentions.members.first()){
        return message.reply({contetn:`${message.mentions.users.first().username} esta afk, lo esperamos juntos?`})
      }
    }
  },
};
