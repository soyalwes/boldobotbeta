const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addrole")
    .setDescription("Agrega un rol")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Selecciona al usuario para darle el rol")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("Seleciona el rol a dar")
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

    let user = interaction.options.getMember("user");

    let role = interaction.options.getRole("role");

    let permsBot = interaction.guild.me.permissions.has("MANAGE_ROLES");
    if (!permsBot)
      return interaction.reply({
        content: "No tengo los suficientes permisos\nPermiso: administrar roles",
      });

    let perms = interaction.member.permissions.has("MANAGE_ROLES");
    if (!perms)
      return interaction.reply({
        content: "No tienes los permisos suficientes\nPermiso: administrar roles",
      });

    if (user === interaction.member)
      return interaction.reply({
        content: "No puedes agregarte roles a ti mismo",
      });

    if (
      interaction.member.roles.highest.comparePositionTo(user.roles.highest) <= 0
    )
      return interaction.reply({
        content:
          "No puedes agregar roles a usuarios que estan por encima de ti",
      });

    if (role.comparePositionTo(interaction.member.roles.highest) > 0)
      return interaction.reply({
        content: "No puedes darle ese rol, esta por encima de el tuyo",
      });

    if (role.permissions.has("ADMINISTRATOR"))
      return interaction.reply({ content: "No puedo darle ese rol" });

    if (!role.editable)
      return interaction.reply({ content: "No puedo dar ese rol" });

    try {
      await user.roles.add(role);

      const roleEmbed = new MessageEmbed()
        .setTitle("✅|Rol giveado")
        .setDescription(`Rol giveado a Usuario: ${user} \nrol: ${role.name}`)
        .setFooter(`Rol giveado por: ${interaction.user.tag}`)
        .setColor("GREEN")
        .setTimestamp();

      interaction.reply({ embeds: [roleEmbed] });
    } catch (e) {
      const errorEmbed = new MessageEmbed()
        .setTitle("❌|Error")
        .setDescription("No se a podido dar el rol")
        .setColor("RED")
        .setTimestamp();

      interaction.reply({ embeds: [errorEmbed] });
    }
  },
};
