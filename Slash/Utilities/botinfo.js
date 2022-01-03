const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("botinfo")
    .setDescription("Ve la mi info"),

  async run(client, interaction) {
    if (cooldown.has(interaction.member.id)) {
      interaction.reply(`Estas en cooldown`);

      return;
    }

    cooldown.add(interaction.member.id);
    setTimeout(() => {
      cooldown.delete(interaction.member.id);
    }, 5000);

    const botEmbed = new MessageEmbed()
      .setTitle(
        `Hola! ${interaction.user.tag} soy ${client.user.tag}, Espero que te haya gustado 🧐`
      )
      .addField("🆔|ID", `${client.user.id}`)
      .addField("🤖|Nombre", `${client.user.username}`)
      .addField("🤖|Tag", `#${client.user.discriminator}`)
      .addField("👮‍♂️|Creador", `alwes#4585`)
      .addField("🐕‍🦺|Servers", `${client.guilds.cache.size}`)
      .addField(
        "🕙|Creacion",
        `<t:${Math.floor(client.user.createdAt / 1000)}>`
      )
      .addField("👨‍🔧|Support", `[Aqui](https://discord.gg/uAdUw8BZvU)`)
      .setColor("RANDOM")
      .setTimestamp();

    interaction.reply({ embeds: [botEmbed] });
  },
};
