const Discord = require("discord.js");
const { ContextMenuCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

let cooldown = new Set();

module.exports = {
  data: new ContextMenuCommandBuilder().setName("UserInfo").setType(2),

  async run(client, interaction) {
    if (cooldown.has(interaction.member.id)) {
      interaction.reply(`Estas en cooldown`);
      return;
    }

    cooldown.add(interaction.member.id);
    setTimeout(() => {
      cooldown.delete(interaction.member.id);
    }, 5000);

    let user = await interaction.guild.members.fetch(interaction.targetId);

    let state = {
      "online" : "🟢|En linea",
      "dnd": "🔴|No molestar",
      "idle": "🟡|Ausente",
      "ofline": "🚫|Desconectado",
    }

    const userEmbed = new MessageEmbed()
      .setTitle(`Info de ${user.tag}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addField(
        "🧔|Apodo",
        `${user.nickname ? user.nickname : "No tiene apodo"}`
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
      .addField("👨‍💼|Estado", `${state[user.presence.status]}`)
      .setColor("RANDOM")
      .setTimestamp();

    interaction.reply({ embeds: [userEmbed] });
  },
};
