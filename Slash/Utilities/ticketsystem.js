const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const ticket = require("../../schema/tickets-schema");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticketsystem")
    .setDescription("Activa el sistema de tickets")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Selecciona el canal en donde poner los tickets")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("category")
        .setDescription(
          "Selecciona la categoria en donde se crearan los tickets"
        )
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("Selecciona el rol del soporte")
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

    let channel = interaction.options.getChannel("channel");

    let category = interaction.options.getChannel("category");

    let role = interaction.options.getRole("role")

    if (!channel.type === "GUILD_TEXT")
      return interaction.reply({
        content: "Recuerda que debes seleccionar un canal",
      });

    if (!category.type === "GUILD_CATEGORY")
      return interaction.reply({
        content: "Recuerda que debes elegir una categoria",
      });

    const embedTicket = new MessageEmbed()
      .setTitle("🎫|Ticket")
      .setDescription(
        "Recuerda leer las reglas antes de hacer un ticket, para hacer un ticket toca el boton de abajo"
      )
      .setColor("BLUE")
      .setTimestamp();

    const row = new Discord.MessageActionRow()
    .addComponents(
      new Discord.MessageButton()
        .setCustomId("ticket")
        .setEmoji("🎫")
        .setLabel("|Ticket")
        .setStyle("PRIMARY")
    );

    let datos = await ticket.findOne(
      { guildId: interaction.guild.id },
      { channelId: channel.id }
    );
    if (!datos) {
      let newDatos = new ticket({
        guildId: interaction.guild.id,
        categoryId: category.id,
        staffRoleId: role.id,
      });

      await newDatos.save();
      interaction.guild.channels.cache
        .get(channel.id)
        .send({ embeds: [embedTicket], components: [row] });
      return interaction.reply({ content: "Sistema de tickets creado" });
    }
    if (datos) {
      let newDatosGuar = new ticket({
        guildId: interaction.guild.id,
        categoryId: category.id,
        staffRoleId: role.id,
      });
      await newDatosGuar.save();
      interaction.guild.channels.cache
        .get(channel.id)
        .send({ embeds: [embedTicket], components: [row] });
      return interaction.reply({ content: "Sistema de tickets creado" });
    }
  },
};
