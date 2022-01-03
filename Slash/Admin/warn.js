const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const warn = require("../../schema/warn-schema");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warnea a un usuario")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Selecciona al usuario a warnear")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Especifica la razon del warn")
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

    let user = interaction.options.getMember("user")

    let reasson = interaction.options.getString("reason") || "No hay una razon especificada"

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
        content: "No puedes warnear a alguien que este por encima de ti",
      });

    if (user === interaction.member)
      return interaction.reply({
        content: "No puedes darte un war a ti mismo",
      });

    let datos = await warn.findOne(
      { guildId: interaction.guild.id },
      { userId: user.id }
    );
    if (!datos) {
      let newDatos = new warn({
        userId: user.id,
        warns: 0,
      });

      await newDatos.save();

      return interaction.reply({
        content:
          "Los datos estan siendo guardados a mi base de datos usa el comando de nuevo",
      });
    }
    let warns = datos.warns;

    const embedWarn = new MessageEmbed()
      .setTitle("⚠|Warn")
      .setDescription(
        `El staff: <@${interaction.member.id}>, warneo a: ${user}`
      )
      .setFooter(`Razon: ${razon}, Warns: ${warns}`)
      .setColor("RED")
      .setTimestap();

      interaction.reply({embeds:[embedWarn]})
  },
};
