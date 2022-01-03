const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Distube = require("distube")

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Pon musica")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("Escribe la musica que quieras escuchar")
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

    const music = interaction.options.getString("song")

    if(!interaction.member.voice.channel)return interaction.reply({content:"Tienes que estar en un canal de voz"})

    if(interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id)return interaction.reply({content:"Debes estar en el mismo canal de voz que yo"})

    interaction.client.distube.playVoiceChannel(
        interaction.member.voice.channel,
        music,
        {
            textChannel: interaction.channel,
            member: interaction.member,
        }
    )
    interaction.reply({content:"Buscando cancion....", ephemeral: true})
  },
};
