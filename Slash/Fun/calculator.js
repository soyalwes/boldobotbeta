const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { Calculator } = require("slash-calculator")

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder().setName("calculator").setDescription("Spawnea una calculadora"),

  async run(client, interaction) {
    if (cooldown.has(interaction.member.id)) {
      interaction.reply(`Estas en cooldown`);

      return;
    }

    cooldown.add(interaction.member.id);
    setTimeout(() => {
      cooldown.delete(interaction.member.id);
    }, 5000);

    await Calculator({
        interaction: interaction,
        embed: {
            title: "📖|Calculadora",
            color: "BLUE",
            footer: "Genius calculator",
            timestap: true,
        },
        disbleQuery: "❌|calculadora deactivada",
        invalidQuery: "❌|Syntax error",
        otherMessage: `❌|No puedes usar estos botones son de ${interaction.member.user.tag}`,
    })
  },
};