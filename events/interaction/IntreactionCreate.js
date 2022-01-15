const Discord = require("discord.js");

const ticket = require("../../schema/tickets-schema");

const captchas = require("../../schema/captcha-schema");

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
      if (interaction.customId === "deleteTicket") {
        const embedBorrTicketfa = new Discord.MessageEmbed()
          .setTitle("❌|Borrar ticket Auntentificacion")
          .setDescription(`Auntentificando que el ticket sera borrado`)
          .setColor("RED")
          .setTimestamp();

        const rowTicketfa = new Discord.MessageActionRow().addComponents(
          new Discord.MessageButton()
            .setCustomId("deleteTickettwoaf")
            .setEmoji("❌")
            .setLabel("Borrar ticket 2FA")
            .setStyle("DANGER")
        );
        try {
          interaction.channel.permissionOverwrites.edit(interaction.member, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false,
          });
        } catch (e) {
          return interaction.reply({
            content:
              "Hubo un error, No puedo proseguir, Necesito permisos para editar permisos de canales",
          });
        }
        interaction.reply({ content: "2FA activado" });
        interaction.channel.send({
          embeds: [embedBorrTicketfa],
          components: [rowTicketfa],
        });
      }
      if (interaction.customId === "deleteTickettwoaf") {
        interaction.reply({
          content:
            "Verificado correctamente, borrando el ticket en 10 segundos",
        });

        setTimeout(() => {
          interaction.channel.delete();
        }, 10000);
      }
      if (interaction.customId === "verf") {
        let datos = await captchas.findOne({ guildId: interaction.guild.id });

        const { Captcha } = require("captcha-canvas");

        const captcha = new Captcha();
        captcha.async = false;
        captcha.addDecoy();
        captcha.drawTrace();
        captcha.drawCaptcha();

        const attachment = new Discord.MessageAttachment(
          captcha.png,
          "captcha.png "
        );

        interaction.reply({
          content: `${interaction.member}, Resuelve el siguiente captcha para verificarte [20s]`,
          files: [attachment],
          ephemeral: true,
        });

        const filter = (m) => m.author.id === interaction.user.id;

        const collector = interaction.channel.createMessageCollector({
          filter,
          time: 20000,
        });

        collector.on("collect", async (m) => {
          setTimeout(() => {
            m.delete();
          }, 10000);
          if (m.content.startsWith(captcha.text)) {
            interaction.member.roles.add(`${datos.roleId}`);
          }
          if (!m.content.startsWith(captcha.text)) {
            collector.stop();

            m.channel
              .send({ content: "Captcha incorrecto" })
              .then((message) => {
                setTimeout(() => {
                  message.delete();
                }, 3000);
              });
          }
        });
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
