const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder().setName("coinflip").setDescription("En un momento decisivo el coinflip decide todo"),

  async run(client, interaction) {
    if (cooldown.has(interaction.member.id)) {
      interaction.reply(`Estas en cooldown`);

      return;
    }

    cooldown.add(interaction.member.id);
    setTimeout(() => {
      cooldown.delete(interaction.member.id);
    }, 5000);

    let option = ["Cara", "Cruz"]

    interaction.reply({content:`:coin: y salio ${option[Math.floor(Math.random() * option.length)]}`})
  },
};