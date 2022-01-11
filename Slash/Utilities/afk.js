const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const afk = require("../../schema/afk-schema");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("afk")
    .setDescription("Pone en afk")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("on")
        .setDescription("Prende el estado afk")
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("Di la razon")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("off").setDescription("Apaga el modo afk")
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

    let datos = await afk.findOne({
      guildId: interaction.guild.id,
      userId: interaction.member.id,
    });

    if (!datos) return interaction.reply({content:"No tengo datos sobre ti"})

    if(datos){
      
    if(datos.Status === false)return interaction.reply({content:"No Estas afk"})
  
    const embedAfk = new MessageEmbed()
      .setTitle("😁|AFK OFF")
      .setDescription(
        `${interaction.member} se a quitado el afk`
      )
      .setColor("BLUE")
      .setTimestamp();

    await afk.findOneAndUpdate({
      guildId: interaction.guild.id,
      userId: interaction.user.id,
      Status: false,
    });

    interaction.reply({embeds:[embedAfk]})
    }
  }

    if (interaction.options.getSubcommand() === "on") {
      let reason =
        interaction.options.getString("reason") || "No hay una razon aparente";

      let datos = await afk.findOne({
        guildId: interaction.guild.id,
        userId: interaction.member.id,
      });
      if (!datos) {
        let newDatos = new afk({
          guildId: interaction.guild.id,
          userId: interaction.member.id,
          Status: false,
        });
        await newDatos.save();

        return interaction.reply({
          content:
            "Los datos estan siendo guardados a mi base de datos usa el comando de nuevo",
        });
      }
      if (datos) {
        if (datos.Status !== false)
          return interaction.reply({ content: "No Estas afk" });

        const embedAfk = new MessageEmbed()
          .setTitle("😴|AFK ON")
          .setDescription(
            `${interaction.member} se a puesto afk. Razon: ${reason}`
          )
          .setColor("DARK_BLUE")
          .setTimestamp();

        await afk.findOneAndUpdate({
          guildId: interaction.guild.id,
          userId: interaction.user.id,
          Status: true,
        });

        interaction.reply({ embeds: [embedAfk] });

        setTimeout(() => {
          interaction.channel.send({ content: `${interaction.member}` });
        }, 5000);
      }
    }
  },
};
