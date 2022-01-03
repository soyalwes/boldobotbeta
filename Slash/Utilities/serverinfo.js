const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("info del server"),

  async run(client, interaction) {
    if (cooldown.has(interaction.member.id)) {
      interaction.reply(`Estas en cooldown`);

      return;
    }

    cooldown.add(interaction.member.id);
    setTimeout(() => {
      cooldown.delete(interaction.member.id);
    }, 5000);

    let server = interaction.guild;

    const serverEmebed = new MessageEmbed()
      .setTitle(`Info de ${server.name}`)
      .setThumbnail(server.iconURL())
      .addField("🆔|ID", `${server.id}`)
      .addField("🕐|Fecha de creacion", `<t:${Math.floor(server.joinedAt / 1000)}>`)
      .addField(
        "🧔|Owner",
        `${(await interaction.guild.fetchOwner()).user.tag}`
      )
      .addField("🆔|ID del Owner", `${interaction.guild.ownerId}`)
      .addField("🗃|Canales", `${server.channels.cache.size}`)
      .addField("👱‍♂️|Miembros", `${server.memberCount}`)
      .addField(
        "🤖|Bots",
        `${interaction.guild.members.cache.filter((m) => m.user.bot).size}`
      )
      .addField("🤣|Emojis", `${interaction.guild.emojis.cache.size}`)
      .addField(
        "💎|Booster",
        `${interaction.guild.premiumSubscriptionCount.toString()}`
      )
      .addField("✅|Nivel de verificacion", `${server.verificationLevel}`)
      .setColor("RANDOM")
      .setTimestamp();

    interaction.reply({ embeds: [serverEmebed] });
  },
};
