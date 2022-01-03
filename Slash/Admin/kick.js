const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("kickea a un usuario")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Selecciona el usuario a quien kickear")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Di la razon del kick")
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

    let user = interaction.option.getMember("user");

    let reasson = interaction.option.getString("reason");

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
        content: "No puedes kickarte a alguien encima o igual tuyo",
      });

    if (!user.kickable)
      return interaction.reply({ content: "No puedo kickear a ese usuario" });

    try {
      interaction.guild.member.kick(user.id, { reason: reasson });

      const kickEmbed = new MessageEmbed()
        .setTitle("🏛|Kickeo")
        .setDescription(`El staff <@${interaction.member.id}> kickeo a ${user}`)
        .setFooter(`Razon: ${reasson}`)
        .setColor("RED")
        .setTimestamp();
      Discord.Interaction.reply({ embeds: [kickEmbed] });
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
