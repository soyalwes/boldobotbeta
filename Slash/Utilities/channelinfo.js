const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("channelinfo")
    .setDescription("Muestra la informacion de un canal")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Elije el canal")
        .setRequired(false)
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

    
    let channel = interaction.options.getChannel("channel") || interaction.channel;

    if(channel.type === "GUILD_CATEGORY")return interaction.reply({content:"Debes elejir un canal"})

    let types = {
        GUILD_TEXT: "Texto",
        GUILD_CATEGORY: "Categoria",
        GUILD_VOICE: "Voz",
        GUILD_NEWS: "Anuncios",
        GUILD_STAGE_VOICE: "Esenario",
      };

      let fot = {
          true : "Si",
          false : "No",
      }

    const embedChannel = new MessageEmbed()
    .setTitle("ChannelInfo")
    .setThumbnail(interaction.guild.iconURL())
    .addField("📰|Nombre", `${channel.name}`)
    .addField("🆔|ID", `${channel.id}`)
    .addField("📝|tipo", `${types[channel.type]}`)
    .addField("🪀|Descripcion", `${channel.topic || "No tiene descripcion"}`)
    .addField("🔞|NSFW", `${fot[channel.nsfw]}`)
    .addField("👶|Creado", `<t:${Math.floor(channel.createdAt / 1000)}>`)
    .setColor("BLUE")

    interaction.reply({embeds:[embedChannel]})

  },
};
