const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder().setName("unlock").setDescription("Desbloque el canal en donde estes"),

  async run(client, interaction) {
    if (cooldown.has(interaction.member.id)) {
      interaction.reply(`Estas en cooldown`);

      return;
    }

    cooldown.add(interaction.member.id);
    setTimeout(() => {
      cooldown.delete(interaction.member.id);
    }, 5000);

    let permsBot = interaction.guild.me.permissions.has("MANAGE_CHANNELS");
    if (!permsBot)
      return interaction.reply({
        content:
          "No tengo los permisos suficientes\nPermiso: administrar canales",
      });

    let perms = interaction.member.permissions.has("MANAGE_CHANNELS");
    if (!perms)
      return interaction.reply({
        content:
          "No tienes los permisos suficientes\nPermiso: administrar canales",
      });

      let everyone = interaction.guild.roles.cache.find(
        (r) => r.name === "@everyone"
      );
  
      if(interaction.channel.editable) return interaction.reply({content:"No puedo desbloquear este canal"})

    try{
        interaction.channel.permissionOverwrites.edit(everyone, {
            SEND_MESSAGES: true,
            ADD_REACTIONS: true,
        })

        const embedLock = new MessageEmbed()
        .setTitle("🔓|UnLock")
        .setDescription(`Canal desloqueado por ${interaction.member.user.tag}`)
        .setColor("GREEN")
        .setTimestamp()
        interaction.reply({embeds:[embedLock]})
        } catch (e) {
          console.log(e)
          
          const errorEmbed = new MessageEmbed()
          .setTitle("❌|Error")
          .setDescription("No se a podido desbloquear el canal")
          .setColor("RED")
          .setTimestamp();
    
        interaction.reply({ embeds: [errorEmbed] });
        }

  },
};