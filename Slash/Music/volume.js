const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Cambia el volumen de la musica")
    .addNumberOption((option) =>
      option
        .setName("volume")
        .setDescription("Escribe el volumen a poner")
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

    let volume = interaction.options.getNumber("volume")

    if(!interaction.member.voice.channel)return interaction.reply({content:"Tienes que estar en un canal de voz"})

    if(interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id)return interaction.reply({content:"Debes estar en el mismo canal de voz que yo"})

    const queue = client.distube.getQueue(interaction.member.voice.channel)

    if(!queue)return interaction.reply({content:"No hay una cancion reprodiciendose"})

    if(volume < 1)return interaction.reply({content:"El volumen debe ser mayo a 1"})

    if(volume > 200)return interaction.reply({content:"El volumen debe ser menor a 200"})

    try{
        client.distube.setVolume(interaction.member.voice.channel, volume)

        if(volume > 1) return interaction.reply({content:`🔈|Volumen: ${volume}`})
        if(volume > 50) return interaction.reply({content:`🔉|Volumen: ${volume}`})
        if(volume > 150) return interaction.reply({content:`🔊|Volumen: ${volume}`})
        
    } catch (e) {
        console.log(e)
        
        const errorEmbed = new MessageEmbed()
        .setTitle("❌|Error")
        .setDescription("No se a podido cambiar el volumen")
        .setColor("RED")
        .setTimestamp();
        interaction.reply({embeds:[errorEmbed]})
    }
  },
};
