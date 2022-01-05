const Discord = require("discord.js");

const ticket = require("../../schema/tickets-schema");
module.exports = {
  name: "interactionCreate",
  async execute(client, interaction) {
    if (interaction.isButton()) {
      if (interaction.customId === "ticket") {
        await interaction.deferUpdate();
        const datos = await ticket.findOne({ guildId: interaction.guild.id });
        if (!datos) return;
        let category = datos.categoryId;
        let staffId = datos.staffRoleId;
        const everyone = interaction.guild.roles.cache.filter(
          (r) => r.name === "@everyone"
        );
        const channel = interaction.guild.channels.cache.find(
          (c) => c.name === `ticket-${interaction.user.username}`
        );
        if (channel) return;
        interaction.guild.channels
          .create(`ticket-${interaction.user.username}`, {
            type: "GUILD_TEXT",
            parent: `${category}`,
            permissionsOverwrites: [
              {
                id: interaction.guild.id,
                allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
              },
              {
                id: staffId,
                allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
              },
              {
                id: everyone.id,
                deny: ["VIEW_CHANNEL", "SEND_MESSAGES"],
              },
            ],
          })
          .then((h) => {
            const embedBorrTicket = new Discord.MessageEmbed()
              .setTitle("❌|Borrar ticket")
              .setDescription(
                `Toca el boton de bajo para borrar el ticket, de caso contrario deja tu duda o queja abajo y espera que un staff te responda`
              )
              .setColor("RED")
              .setTimestamp();

            const rowTicket = new Discord.MessageActionRow().addComponents(
              new Discord.MessageButton()
                .setCustomId("deleteTicket")
                .setEmoji("❌")
                .setLabel("Borrar ticket")
                .setStyle("DANGER")
            );
            h.send({ embeds: [embedBorrTicket], components: [rowTicket] });
          });
      }
      if(interaction.customId === "deleteTicket"){
        interaction.channel.delete()
      }
      }
    console.log(
      `Una interacion a ocurrido en #${interaction.channel.name}\npor el usuario ${interaction.user.tag}\nen el servidor: ${interaction.guild.name}`
    );

    if (interaction.isCommand() || interaction.isContextMenu()) {
      const slashcmds = client.slashCommands.get(interaction.commandName);

      if (!slashcmds) return;

      try {
        await slashcmds.run(client, interaction);
      } catch (e) {
        console.error(e);
      }
    }
  },
};