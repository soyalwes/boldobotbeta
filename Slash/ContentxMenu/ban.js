const Discord = require("discord.js");
const { ContextMenuCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

let cooldown = new Set();

module.exports = {
  data: new ContextMenuCommandBuilder().setName("Ban").setType(2),

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

    let permsBot = interaction.guild.me.permissions.has("BAN_MEMBERS")
    if(!permsBot) return interaction.reply("No tengo los permisos suficientes\nPermiso: Banear miembros")

    let perms = interaction.member.permissions.has("BAN_MEMBERS")
    if(!perms) return interaction.reply({content:"No tienes los suficientes permisos \nPermiso: banear miembros"})

    if(user === interaction.member) return interaction.reply({content:'No te puedes banear a ti mismo'})

    if(user === client.user) return interaction.reply({content:"No me puedes banear"})

    if(interaction.member.roles.highest.comparePositionTo(user.roles.highest) <= 0) return interaction.reply({content:"No puedes banear a alguien que este por encima o igual tuyo"})

    if(!user.banneable)return interaction.reply({content:"No puedo banear a ese usuario"})

    try{
        interaction.guild.members.ban(user.id, {reason: "No hay una razon"})
        
        const banEmbed = new MessageEmbed()
        .setTitle("👮‍♂️|Miembro baneado")
        .setDescription(`El usuario ${user} a sido banado por <@${interaction.member.id}>, razon: "No hay una razon"`)
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