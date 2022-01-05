const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const warn = require("../../schema/warn-schema")

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warns")
    .setDescription("Ve los warns de un usuario")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Elije al usuario")
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

    let user = interaction.options.getMember("user") || interaction.member;

    const datos = await warn.findOne(
        { userId: user.id , guildId: interaction.guild.id}
    );

    if(!datos){
        let newDatos = new warn({
            guildId: interaction.guild.id,
            userId: user.id,
            warns: 0,
        })
        await newDatos.save()

        return interaction.reply({ content: "Los datos estan siendo guardados a mi base de datos usa el comando de nuevo" })
    }

    let warnsEmbed = new MessageEmbed()
    .setTitle("⚠|Warn")
    .setDescription(`${user} tiene **${datos.warns}** warns`)
    .setColor("RED")
    
    interaction.reply({embeds:[warnsEmbed]})
    }
}