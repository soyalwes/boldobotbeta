const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const logs = require("../../schema/logs-schema");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("logsystem")
    .setDescription("Activa el sistema de logs")
    .addSubcommand((subcommand) =>
      subcommand.setName("off").setDescription("Apaga el sistema de logs")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("on")
        .setDescription("Prende el sistema de logs")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Selecciona el canal a donde se enviaran")
            .setRequired(true)
        )
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

    if(interaction.options.getSubcommand() === "off"){
      let permsBot = interaction.guild.me.permissions.has("ADMINISTRATOR");
      if (!permsBot)
        return interaction.reply({
          content: "No tengo los permisos suficientes\nPermiso: administrador",
        });

      let perms = interaction.member.permissions.has("ADMINISTRATOR");
      if (!perms)
        return interaction.reply({
          content: "No tienes los permisos necesarios\nPermiso: administrador",
        });
        let datos = await logs.findOne({ guildId: interaction.guild.id });

      if (!datos)return interaction.reply({content:"No tengo registro de logs"})

      if(datos){
        await logs.findOneAndUpdate({
          guildId: interaction.guild.id,
          channelId: interaction.channel.id1,
          Status: false,
        });

        const embedLogsOFF = new MessageEmbed()
        .setTitle("❌|Logs OFF")
        .setDescription("El sistema de logs fue apagado")
        .setColor("RED")

        interaction.reply({embeds:[embedLogsOFF]})
      }
    } else if (interaction.options.getSubcommand() === "on") {
      let channel = interaction.options.getChannel("channel");

      let permsBot = interaction.guild.me.permissions.has("ADMINISTRATOR");
      if (!permsBot)
        return interaction.reply({
          content: "No tengo los permisos suficientes\nPermiso: administrador",
        });

      let perms = interaction.member.permissions.has("ADMINISTRATOR");
      if (!perms)
        return interaction.reply({
          content: "No tienes los permisos necesarios\nPermiso: administrador",
        });

      if (channel.type === "GUILD_CATEGORY")
        return interaction.reply({
          content: "Recuerda que tienes que elegir un canal",
        });

      let datos = await logs.findOne({ guildId: interaction.guild.id });
      if (!datos) {
        let newDatos = new logs({
          guildId: interaction.guild.id,
          channelId: channel.id,
          Status: false,
        });
        await newDatos.save();

        return interaction.reply({
          content: "Los datos estan siendo guardados, usa el comando de nuevo",
        });
      }
      if (datos) {
        await logs.findOneAndUpdate({
          guildId: interaction.guild.id,
          channelId: channel.id,
          Status: true,
        });

        const logsEmbed = new MessageEmbed()
          .setTitle("👮‍♂️|Logs ON")
          .setDescription(`Logs seteado en: ${channel}`)
          .setColor("BLUE");

        interaction.reply({ embeds: [logsEmbed] });
      }
    }
  },
};
