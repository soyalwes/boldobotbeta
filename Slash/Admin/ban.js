const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Banea a un usuario")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Selecciona al usuario para el ban")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Di la razon el ban")
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

    let user = interaction.options.getMember('user')

    let reasson = interaction.options.getString('reason') || "No hay una razon especificada"

    let permsBot = interaction.guild.me.permissions.has("BAN_MEMBERS")
    if(!permsBot) return interaction.reply("No tengo los permisos suficientes\nPermiso: Banear miembros")

    let perms = interaction.member.permissions.has("BAN_MEMBERS")
    if(!perms) return interaction.reply({content:"No tienes los suficientes permisos \nPermiso: banear miembros"})

    if(user === interaction.member) return interaction.reply({content:'No te puedes banear a ti mismo'})

    if(user === client.user) return interaction.reply({content:"No me puedes banear"})

    if(interaction.member.roles.highest.comparePositionTo(user.roles.highest) <= 0) return interaction.reply({content:"No puedes banear a alguien que este por encima o igual tuyo"})

    if(!user.banneable)return interaction.reply({content:"No puedo banear a ese usuario"})

    try{
        interaction.guild.members.ban(user.id, {reason: reasson})
        
        const banEmbed = new MessageEmbed()
        .setTitle("👮‍♂️|Miembro baneado")
        .setDescription(`El usuario ${user} a sido banado por <@${interaction.member.id}>, razon: ${reasson}`)
        .setColor("RED")
        .setTimestamp()

        interaction.reply({embeds:[banEmbed]})
    } catch (e) {
        console.log(e)
        const errorEmbed = new MessageEmbed()
        .setTitle("❌|Error")
        .setDescription("No se a podido banear al miembro")
        .setColor("RED")
        .setTimestamp();

      interaction.reply({ embeds: [errorEmbed] });
    }
  },
};
