const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Revisa mi ping"),

  async run(client, interaction) {
    if (cooldown.has(interaction.member.id)) {
      interaction.reply(`Estas en cooldown`);

      return;
    }

    cooldown.add(interaction.member.id);
    setTimeout(() => {
      cooldown.delete(interaction.member.id);
    }, 5000);

    let ping = Math.floor(client.ws.ping);

    if (ping > 300) {
      const pAEmbed = new MessageEmbed()
        .setTitle("🏓 Pong...")
        .setDescription(`🔴|${ping}ms`)
        .setColor("RED")
        .setTimestamp();
      interaction.reply({ embeds: [pAEmbed] });
    } else if (ping > 200) {
      const pMEmbed = new MessageEmbed()
        .setTitle("🏓 Pong...")
        .setDescription(`🟠|${ping}ms`)
        .setColor("ORANGE")
        .setTimestamp();
      interaction.reply({ embeds: [pMEmbed] });
    } else if (ping > 100) {
      const pBEmbed = new MessageEmbed()
        .setTitle("🏓 Pong...")
        .setDescription(`🟢|${ping}ms`)
        .setColor("GREEN")
        .setTimestamp();
      interaction.reply({ embeds: [pBEmbed] });
    } else if (ping > 1) {
      const pUbEmbed = new MessageEmbed()
        .setTitle("🏓 Pong...")
        .setDescription(`⚪|${ping}ms`)
        .setColor("WHITE")
        .setTimestamp();
      interaction.reply({ embeds: [pUbEmbed] });
    }
  },
};
