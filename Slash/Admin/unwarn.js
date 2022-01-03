const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const warn = require("../../schema/warn-schema");
const warnSchema = require("../../schema/warn-schema");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unwarn")
    .setDescription("Quita un warn a algun usuario")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Seleciona a un usuario para quitar el warn")
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

    if (
      interaction.member.roles.highest.comparePositionTo(user.roles.highest) <=
      0
    )
      return interaction.reply({
        content: "No puedes quitar el warn a alguien que esta por encima de ti",
      });

    if (user === interaction.member)
      return interaction.reply({
        content: "No puedes quitarte el warn a ti mismo",
      });

    let datos = await warn.findOne(
      { guildId: interaction.guild.id },
      { userId: interaction.guild.id }
    );
    if (!datos) {
      let newDatos = new warnSchema({
        userId: user.id,
        warns: 0,
      });
      await newDatos.save();

      return interaction.reply({
        content:
          "Los datos estan siendo guardados a mi base de datos usa el comando de nuevo",
      });
    }
    if (datos.warns === 0)
      return interaction.reply({ content: "El usuario tiene 0 warns" });

    await warn.findOneAndUpdate(
      { userId: user.id },
      { warns: warns - Number(1) }
    );

    const embedUnWarn = new MessageEmbed()
      .setTitle("✅|UnWarn")
      .setDescription(
        `El staff: <@${interaction.member.id}>, quito el warn a: ${user}`
      )
      .setColor("GREEN")
      .setTimestamp();

    interaction.reply({ embeds: [embedUnWarn] });
  },
};
