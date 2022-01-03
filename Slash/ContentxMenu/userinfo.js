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

    let user = await interaction.guild.members.fetch(interaction.targetId)

    const userEmbed = new MessageEmbed()
    .setTitle(`Info de ${interaction.user.tag}`)
    .setThumbnail(user.displayAvatarURL({dynamic: true}))
    .addField("🧔|Apodo", `${interaction.user.nickname ? interaction.user.nickname : "No tiene apodo"}`)
    .addField("📌|TAG", `#${interaction.user.discriminator}`)
    .addField("🆔|ID", `${interaction.user.id}`)
    .addField("🔗|Link del avatar", `[Aqui](${interaction.user.displayAvatarURL()})`)
    .addField("🕕|Datos de creacion", `${interaction.user.createdAt.toLocaleDateString("es-pe")}`)
    .addField("🕣|Entrada al servidor", `${user.joinedAt.toLocaleDateString("es-pe")}`)
    .addField("🧛‍♂️|Roles del usuario", `${user.roles.cache.map(role => role.toString()).join(", ")}`)
    .setColor("RANDOM")
    .setTimestamp()

    interaction.reply({embeds:[userEmbed]})
  },
};