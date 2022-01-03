const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Ve el avatar de un usuario")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Elige el usuario para ver su avatar")
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

    const avatarEmbed = new MessageEmbed()
      .setDescription(
        `[Descargar avatar](${user.displayAvatarURL({
          format: "png",
          dynamic: true,
        })})`
      )
      .setImage(user.displayAvatarURL({ dynamic: true, size: 2048 }))
      .setColor("RANDOM")
      .setTimestamp()
      .setFooter(`Avatar pedido por: ${interaction.user.tag}`);

    interaction.reply({ embeds: [avatarEmbed] });
  },
};
