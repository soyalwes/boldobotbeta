const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const ms = require("ms")

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("da un tiemout a un miembro")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Selecciona a un usuario")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("seconds")
        .setDescription("Escribe los segundos que mutearas al miembro")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Di la razon del mute")
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

    let seconds = interaction.options.getNumber("seconds")

    let reason = interaction.options.getString("reason") || "No hay una razon"

    let timesOnSeconds = `${seconds}s`

    let time = ms(timesOnSeconds)

    const permsBot = interaction.guild.me.permissions.has("MODERATE_MEMBERS")
    if(!permsBot) return interaction.reply({content:"No tengo los permisos suficientes\nPermiso: aislar miembros"})

    const perms = interaction.member.permissions.has("MODERATE_MEMBERS")
    if(!perms) return interaction.reply({content:"No tines los permisos suficientes\nPermiso: aislar miembros"})

    if(user.isCommunicationDisabled())return interaction.reply({content:"Ese miembro ya tiene un timeout"})

    if(user === interaction.member)return interaction.reply({content:"No puedes darte un timeout a ti mismo"})

    if(user === client.user)return interaction.reply({content:"No me des un timeout pofavo"})

    if(interaction.member.roles.highest.comparePositionTo(user.roles.highest) <= 0)return interaction.reply({content:"No puedes dar un timeout a alguien mayor a ti o igual"})

    try{

        user.timeout(time, reason)

        const timeoutEmbed = new MessageEmbed()
        .setTitle("🔇|Timeout")
        .setDescription(`${user} fue muteado por: ${interaction.member}`)
        .setFooter(`razon: ${reason}, tiempo: ${timesOnSeconds}`)
        .setColor("RED")
        .setTimestamp()
        interaction.reply({embeds:[timeoutEmbed]})

    }catch (e){
        console.log(e)
    }
  },
};
