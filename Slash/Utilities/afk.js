const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const afk = require("../../schema/afk-schema");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("afk")
    .setDescription("Pone en afk")
    .addStringOption((option) =>
      option.setName("reason").setDescription("Di la razon").setRequired(false)
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
    let reason = interaction.options.getString("reason") || "No hay una razon aparente"

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
    if(datos) {
      if(datos.Status !== false)return interaction.reply({content:"No Estas afk"})

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

      interaction.reply({embeds:[embedAfk]})

      setTimeout(() => {
        interaction.channel.send({content:`${interaction.member}`})
      }, 5000)
    }
  },
};
