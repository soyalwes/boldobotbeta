const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const captchas = require("../../schema/captcha-schema");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("captcha")
    .setDescription("Activa el captcha para la verificacion")
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("Elije el rol a dar")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Elije el canal para enviar el captcha")
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
    let permsBot = interaction.guild.me.permissions.has("ADMINISTRATOR")
    if(!permsBot)return interaction.reply({content:"No tengo los permisos suficientes\nPermiso: administrador"})

    let perms = interaction.member.permissions.has("ADMINISTRATOR")
    if(!perms)return interaction.reply({content:"No tienes los permisos suficientes\nPermiso: administrador"})

    let channel =
      interaction.options.getChannel("channel") || interaction.channel;

    let role = interaction.options.getRole("role");

    const embedVerf = new MessageEmbed()
      .setTitle("✅|Verificacion")
      .setDescription("Toca el boton de abajo para verificarte")
      .setColor("GREEN");

    const row = new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton()
        .setStyle("SUCCESS")
        .setCustomId("verf")
        .setLabel("Verificate")
        .setEmoji("✅")
    );

    let datos = await captchas.findOne({ guildId: interaction.guild.id });
    if (!datos) {
      let newDatos = new captchas({
        guildId: interaction.guild.id,
        roleId: role.id,
      });
      await newDatos.save();

      interaction.reply({ content: "Datos guardados ya se puede usar" });
      return client.channels.cache
        .get(channel.id)
        .send({ embeds: [embedVerf], components: [row] });
    }
    if(datos){
        await captchas.findOneAndUpdate({guildId: interaction.guild.id, roleId: role.id})

        interaction.reply({content:"Nuevos datos guardados"})
        return client.channels.cache
        .get(channel.id)
        .send({ embeds: [embedVerf], components: [row] });
    }
  },
};
