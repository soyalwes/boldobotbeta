const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Elimina algunos mensjes")
    .addNumberOption((option) =>
      option
        .setName("number")
        .setDescription("Escribe el numero de mensajes que quieras borrar")
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

    let number = interaction.options.getNumber("number");

    let permsBot = interaction.guild.me.permissions.has("MANAGE_MESSAGES");
    if (!permsBot)
      return interaction.reply({
        content:
          "No tengo los suficientes permisos\nPermiso: administrar mensajes",
      });

    let perms = interaction.member.permissions.has("MANAGE_MESSAGES");
    if (!perms)
      return interaction.reply({
        content:
          "No tienes los permisos suficientes\nPermiso: admonistrar mensaje",
      });

    if (number > 100)
      return interaction.reply({
        content: "No puedes borrar mas de 100 mensajes",
      });

    try {
      interaction.channel.bulkDelete(number);

      const embedMessDelet = new MessageEmbed()
        .setTitle("⛔|Purge")
        .setDescription(
          `El staff <@${interaction.member.id}> ha borrado: ${number}`
        )
        .setColor("RED")
        .setTimestamp();
        
        setTimeout(() => {
      interaction.reply({ embeds: [embedMessDelet] });
        }, 2000)
    } catch (e) {
      console.log(e);

      const errorEmbed = new MessageEmbed()
        .setTitle("❌|Error")
        .setDescription("No se a podido borrar los mensajes")
        .setColor("RED")
        .setTimestamp();

      interaction.reply({ embeds: [errorEmbed] });
    }
  },
};
