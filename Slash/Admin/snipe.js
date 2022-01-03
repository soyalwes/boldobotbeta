const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const snipe = require("../../schema/snipe-schema");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("snipe")
    .setDescription("ve el ultimo mensaje borrado"),

  async run(client, interaction) {
    if (cooldown.has(interaction.member.id)) {
      interaction.reply(`Estas en cooldown`);

      return;
    }

    cooldown.add(interaction.member.id);
    setTimeout(() => {
      cooldown.delete(interaction.member.id);
    }, 5000);

    let datos = await snipe.findOne(
      { channelId: interaction.channel.id }
    );
    if (!datos) {
      return interaction.reply({
        content: "No hay mensajes borrado en este canal",
      });
    }
    
    const embedSnipe = new MessageEmbed()
      .setTitle("📨|Mensaje borrado")
      .addField(`📩Mensaje:`, `${datos.message}`)
      .addField("👨‍🦱Autor:", `${datos.author}`)
      .addField("🆔Id:", `${datos.authorId}`)
      .addField("🗃Canal:", `<#${datos.channelId}>`)
      .addField("🕞Tiempo:", `<t:${datos.time}>`)
      .setFooter(`👱‍♂️Pedido por: ${interaction.member.user.tag}`)
      .setColor("BLUE")
      .setTimestamp();

    interaction.reply({ embeds: [embedSnipe] });
  },
};