const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { DiscordTogether } = require('discord-together');

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder().setName("together").setDescription("Ve videos en discord"),

  async run(client, interaction) {
    if (cooldown.has(interaction.member.id)) {
      interaction.reply(`Estas en cooldown`);

      return;
    }

    cooldown.add(interaction.member.id);
    setTimeout(() => {
      cooldown.delete(interaction.member.id);
    }, 5000);

    client.discordTogether.createTogetherCode(interaction.member.voice.channel.id, 'youtube').then(async invite => {
      const togetherEmbed = new MessageEmbed()
      .setTitle("🟥|toGether")
      .setDescription(`Aqui tienes disfruta\n ${invite.code}`)
      .setColor("RED")
      .setTimestamp()

        return interaction.reply({embeds:[togetherEmbed]});
    })

  },
};