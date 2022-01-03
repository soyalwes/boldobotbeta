const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("La bola 8 decidira bien?")
    .addStringOption((option) =>
      option
        .setName("answer")
        .setDescription("Escribe tu pregunta")
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
    let answer = interaction.options.getString("answer")

    let options = ['Si', 'No', 'Puede ser', 'Definitivamente', 'Obio', 'Claro que si', 'No se', 'Definitivamente no', 'Claro que no', 'Si o si', 'No, creo', 'Pensalo vos', 'Parece bien', 'No, NO', 'No nunca']

    const eigthBallEmbed = new MessageEmbed()
    .setTitle("🎱|8Ball")
    .setDescription("La bola 8 decidira bien?")
    .addField(`Pregunta: ${answer}`, `Respuesta: ${options[Math.floor(Math.random() * options.length)]}`, true)
    .setColor("BLUE")
    .setTimestamp()
    interaction.reply({embeds:[eigthBallEmbed]})
  },
};
