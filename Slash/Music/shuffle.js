const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Randomiza la playlist"),

  async run(client, interaction) {
    if (cooldown.has(interaction.member.id)) {
      interaction.reply(`Estas en cooldown`);

      return;
    }

    cooldown.add(interaction.member.id);
    setTimeout(() => {
      cooldown.delete(interaction.member.id);
    }, 5000);

    if (!interaction.member.voice.channel)
      return interaction.reply({
        content: "Tienes que estar en un canal de voz",
      });

    if (
      interaction.guild.me.voice.channel &&
      interaction.member.voice.channel.id !==
        interaction.guild.me.voice.channel.id
    )
      return interaction.reply({
        content: "Debes estar en el mismo canal de voz que yo",
      });

    const queue = client.distube.getQueue(interaction.member.voice.channel);

    if (!queue)
      return interaction.reply({ content: "No hay canciones en la queue" });

    try {
      client.distube.shuffle(interaction.member.voice.channel);

      const embedShuffle = new MessageEmbed()
        .setTitle("🔀|Shuffle")
        .setDescription(`La queue a sido randomizado`)
        .setColor("BLUE")
        .setTimestamp();
      interaction.reply({ embeds: [embedShuffle] });
    } catch (e) {
      console.log(e);
      const errorEmbed = new MessageEmbed()
        .setTitle("❌|Error")
        .setDescription("No se a podido shuflear la musica")
        .setColor("RED")
        .setTimestamp();

      interaction.reply({ embeds: [errorEmbed] });
    }
  },
};
