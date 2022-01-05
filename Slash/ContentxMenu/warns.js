const Discord = require("discord.js");
const { ContextMenuCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const warn = require("../../schema/warn-schema")

let cooldown = new Set();

module.exports = {
  data: new ContextMenuCommandBuilder().setName("Warns").setType(2),

  async run(client, interaction) {
    if (cooldown.has(interaction.member.id)) {
      interaction.reply(`Estas en cooldown`);
      return;
    }

    cooldown.add(interaction.member.id);
    setTimeout(() => {
      cooldown.delete(interaction.member.id);
    }, 5000);
    let user = await interaction.guild.members.fetch(interaction.targetId)

      const datos = await warn.findOne(
        { userId: user.id ,  guildId: interaction.guild.id }
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

    if(datos.warns === 0) return interaction.reply({content:"El usuario no tiene warns"})

    const embedWarn = new MessageEmbed()
    .setTitle("⚠|Warn")
    .setDescription(`${user} tiene **${datos.warns}** warns`)
    .setColor("RED");

    interaction.reply({embeds:[embedWarn]})
  },
};