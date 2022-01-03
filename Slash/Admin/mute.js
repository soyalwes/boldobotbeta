const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const mutes = require("../../schema/mute-schema");
const ms = require("ms")

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mutea a los usuarios")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Selecciona al usuario a mutear")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription("Di el tiempo de mute")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Di la razon del mute")
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

    let user = interaction.options.getMember("user");//mute

    let times = interaction.options.getString("time");

    let reasson = interaction.options.getString("reason");

    const time = ms(times);

    let permsBot = interaction.guild.me.permissions.has(
      "KICK_MEMBERS",
      "MANAGE_ROLES"
    );
    if (!permsBot)
      return interaction.reply({
        content:
          "No tengo los permisos suficientes\n permiso kickear miembros, administrar roles",
      });

    let perms = interaction.member.permissions.has("KICK_MEMBERS");
    if (!perms)
      return interaction.reply({
        content:
          "No tienes los suficientes permisos\nPermiso: kickear miembros",
      });

    let datos = await mutes.findOne({ guildId: interaction.guild.id });
    if (!datos)
      return interaction.reply({
        content: "No encuentro ningun dato usa /muterol",
      });

    if (interaction.member === user)
      return interaction.reply({ content: "No puedes automutearte" });

    if (
      interaction.member.roles.highest.comparePositionTo(user.roles.highest) <=
      0
    )
      return interaction.reply({
        content: "No puedes mutear a alguien por encima o igual a ti",
      });

      let rolMute = datos.muteRolId

      try{
        user.roles.add(rolMute)
          const embedMute = new MessageEmbed()
          .setTitle("😶|Mute")
          .setDescription(`El staff: <@${interaction.member.id}>, muteo a ${user}`)
          .setFooter(`Razon: ${reasson}`)
          .setColor("RED")
          .setTimestamp()

          interaction.reply({embeds:[embedMute]})
          
          setTimeout(() => {
            user.roles.remove(rolMute)
          }, time)

      } catch (e) {
          console.log(e)

          const errorEmbed = new MessageEmbed()
          .setTitle("❌|Error")
          .setDescription("No se a podido mutear al miembro")
          .setColor("RED")
          .setTimestamp();
    
        interaction.reply({ embeds: [errorEmbed] });
      }
  },
};
