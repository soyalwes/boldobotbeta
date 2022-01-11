const Discord = require("discord.js");
const { ContextMenuCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

let cooldown = new Set();

module.exports = {
  data: new ContextMenuCommandBuilder().setName("kick").setType(2),

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

    let permsBot = interaction.guild.me.permissions.has("KICK_MEMBERS");
    if (!permsBot)
      return interaction.reply({
        content: "No tengo lo permisos suficientes\nPermiso: kickar miembros",
      });

    let perms = interaction.member.permissions.has("KICK_MEMBER");
    if (!perms)
      return interaction.reply({
        content: "No tienes los permisos suficientes\nPermiso: kickar miembros",
      });

    if (user === interaction.member)
      return interaction.reply({ content: "No puedes kickearte a ti mismo" });

    if (
      interaction.member.roles.highest.comparePositionTo(user.roles.highest) <=
      0
    )
      return interaction.reply({
        content: "No puedes kickar a alguien por encima o igual a ti",
      });

    if (!user.kickable)
      return interaction.reply({ content: "No puedo kickear a ese usuario" });

    try {
      interaction.guild.member.kick(user.id, { reason: "No hay una razon" });

      const kickEmbed = new MessageEmbed()
        .setTitle("🏛|Kickeo")
        .setDescription(`El staff <@${interaction.member.id}> kickeo a ${user}`)
        .setFooter(`Razon: ${reasson}`)
        .setColor("RED")
        .setTimestamp();
      interaction.reply({ embeds: [kickEmbed] });
    } catch (e) {
      console.log(e);

      const errorEmbed = new MessageEmbed()
        .setTitle("❌|Error")
        .setDescription("No se a podido kickear al miembro")
        .setColor("RED")
        .setTimestamp();

      interaction.reply({ embeds: [errorEmbed] });
    }
  },
};
