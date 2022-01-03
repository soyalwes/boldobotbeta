const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const mutes = require("../../schema/mute-schema");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("muterol")
    .setDescription("Selecciona el rol del mute")
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("Selleciona el rol del mute")
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

    let role = interaction.options.getRole("role")

    let permsBot = interaction.guild.me.permissions.has("BAN_MEMBERS")
    if(!permsBot) return interaction.reply({content:"No tengo los suficientes permisos\nPermiso: banear miembros"})

    let perms = interaction.member.permissions.has("BAN_MEMBERS")
    if(!perms) return interaction.reply({content:"No teines los suficientes permisos\nPermiso: banear miembros"})

    if(role.name === "@everyone") return interaction.reply({content:"No puedes elejir el rol everyone como para el mute"})

    let datos = await mutes.findOne({guildId: interaction.guild.id})
    if(!datos){
        let newDatos = new mutes({
            guildId: interaction.guild.id,
            muteRolId: role.id,
        })
        await newDatos.save()
        return interaction.reply({content:`El rol del mute se a establecido como ${role.name}`})
    }
    if(datos){
        let newDatosGuar = new mutes({
            guildId: interaction.guild.id,
            muteRolId: role.id,
        })
        await newDatosGuar.save()
        return interaction.reply({content:`El nuevo rol del mute se a establecido como ${role.name}`})
    }
  },
};
