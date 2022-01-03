const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Digo algo que quieres que diga")
    .addStringOption((option) =>
      option
        .setName("say")
        .setDescription("Di lo que quieres que diga")
        .setRequired(true)
    ),

  async run(client, interaction) {
    if (cooldown.has(interaction.member.id)) {
      interaction.reply(`Estas en cooldown`);

      return;
    }

    cooldown.add(interaction.member.id);
    setTimeout(() => {
      cooldown.delete(interaction.member.id);
    }, 5000);

    let string = interaction.options.getString("say");

    if (string.length > 150)
      return interaction.reply({
        content: "No puedes usar mas de 150 palabras",
      });

    interaction.reply({ content: `${string}` });
  },
};
