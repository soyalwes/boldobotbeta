const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Ve la info de un usuraio")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Elige al usuario a quien ver su info")
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

    let user = interaction.options.getMember("user") || interaction.member;

    const userEmbed = new MessageEmbed()
      .setTitle(`Info de ${interaction.user.tag}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addField(
        "🧔|Apodo",
        `${
          interaction.user.nickname
            ? interaction.user.nickname
            : "No tiene apodo"
        }`
      )
      .addField("📌|TAG", `#${interaction.user.discriminator}`)
      .addField("🆔|ID", `${interaction.user.id}`)
      .addField(
        "🔗|Link del avatar",
        `[Aqui](${interaction.user.displayAvatarURL()})`
      )
      .addField(
        "🕕|Datos de creacion",
        `<t:${Math.floor(interaction.user.createdAt / 1000)}>`
      )
      .addField(
        "🕣|Entrada al servidor",
        `<t:${Math.floor(user.joinedAt / 1000)}>`
      )
      .addField(
        "🧛‍♂️|Roles del usuario",
        `${user.roles.cache.map((role) => role.toString()).join(", ")}`
      )
      .setColor("RANDOM")
      .setTimestamp();

    interaction.reply({ embeds: [userEmbed] });
  },
};
