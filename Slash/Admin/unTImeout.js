const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("untimeout")
    .setDescription("Quita el timeouta un usuario")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Elije al usuario a quien quitar el timeout")
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
    let user = interaction.options.getMember("user")

    const permsBot = interaction.guild.me.permissions.has("MODERATE_MEMBERS")
    if(!permsBot) return interaction.reply({content:"No tengo los permisos suficientes\nPermiso: aislar miembros"})

    const perms = interaction.member.permissions.has("MODERATE_MEMBERS")
    if(!perms) return interaction.reply({content:"No tines los permisos suficientes\nPermiso: aislar miembros"})

    if(!user.isCommunicationDisabled())return interaction.reply({content:"Ese miembro no tiene un timeout"})

    if(interaction.member.roles.highest.comparePositionTo(user.roles.highest) <= 0)return interaction.reply({content:"No puedes quitar un timeout a alguien mayor a ti o igual"})

    try{
        user.timeout(null)
        const timeoutEmbed = new MessageEmbed()

        .setTitle("📢|UnTimeout")
        .setDescription(`${interaction.member} quito el timeout a: ${user}`)
        .setColor("RED")
        .setTimestamp()
        interaction.reply({embeds:[timeoutEmbed]})

    }catch (e){
        console.log(e)
    }
  },
};
