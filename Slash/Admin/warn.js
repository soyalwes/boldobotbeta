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

    let user = interaction.options.getMember("user");

    let reasson = interaction.options.getString("reason") || "No hay una razon"

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

    const datos = await warn.findOne(
        { userId: user.id ,  guildId: interaction.guild.id }
    );

    if(!datos){
        let newDatos = new warn({
            guildId: interaction.guild.id,
            userId: user.id,
            warns: 0,
        })
        await newDatos.save()

        return interaction.reply({ content: "Los datos estan siendo guardados a mi base de datos usa el comando de nuevo" })
    }

    await warn.findOneAndUpdate({userId: user.id}, { warns: datos.warns + 1})

    const embedWarn = new MessageEmbed()
    .setTitle("???|Warn")
    .setDescription(`El staff: <@${interaction.member.id}>, warneo a: ${user}`)
    .setFooter(`Razon: ${reasson}, Warns: ${datos.warns}`)
    .setColor("RED");

    interaction.reply({embeds:[embedWarn]})
  },
};
