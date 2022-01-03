const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("removerol")
    .setDescription("Remueve un rol a un usuario")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Selecciona al usuario")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("Selleciona el rol a quitar")
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

      if(user === interaction.member)return interaction.reply({content:"No puedes quitarte roles a ti mismo"})

      if(interaction.member.roles.highest.comparePositionTo(user.roles.highest) <= 0)return interaction.reply({content:"No puedes quitar el rol a alguien por encima de ti"})

      if(!role.editable) return interaction.reply({content:"No puedo quitar este rol"})

      if(role.permissions.has("ADMINISTRATOR")) return interaction.relpy({content:"No puedo quitar ese rol"})
      try{
          await user.roles.remove(role)

          const roleRemoEmbed = new MessageEmbed()
          .setTitle("❌|Rol removido")
          .setDescription(`El staff: <@${interaction.member.id}>, quito el rol a ${user}`)
          .setFooter(`Rol quitado: ${role.name}`)
          .setColor("RED")
          .setTimestamp()

      } catch (e) {
          console.log(e)

          const errorEmbed = new MessageEmbed()
          .setTitle("❌|Error")
          .setDescription("No se a podido quitar el rol a el miembro")
          .setColor("RED")
          .setTimestamp();
  
        interaction.reply({ embeds: [errorEmbed] });
      }
  },
};
