const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Necesitas ayuda?, aqui lo tienes"),

  async run(client, interaction) {
    if (cooldown.has(interaction.member.id)) {
      interaction.reply(`Estas en cooldown`);

      return;
    }

    cooldown.add(interaction.member.id);
    setTimeout(() => {
      cooldown.delete(interaction.member.id);
    }, 5000);

    const row = new Discord.MessageActionRow().addComponents(
      new Discord.MessageSelectMenu()
        .setCustomId("1")
        .setMaxValues(1)
        .setMinValues(1)
        .addOptions([
          {
            label: "Slash commands: Diversion",
            description: "slash commands categoria: diversion",
            value: "1111",
          },
          {
            label: "Slash commands: Economia",
            description: "slash commands categoria: economia",
            value: "1222",
          },
          {
            label: "Slash commands: Staff",
            description: "slash commands categoria: staff",
            value: "1333",
          },
          {
            label: "Slash commands: Utiles",
            description: "slash commands categoria: Utiles",
            value: "1444",
          },
          {
            label: "Comandos con prefix: bd!",
            description: "comandos con prefix",
            value: "2111",
          },
        ])
    );
    const PpEmbed = new MessageEmbed()
      .setTitle("Help")
      .setDescription(
        `Hola ${interaction.member.user.username} soy ${client.user} elije uno de los menus de abajo paraver mis comandos`
      )
      .setColor("RANDOM")
      .setTimestamp();

    const DEmbed = new MessageEmbed()
      .setTitle(`Help: slash diversion`)
      .setDescription("Bienvenido a los slash de diversion")
      .addField("8ball", "La bola 8 decidira bien?")
      .addField("calculator", "Una calculadora")
      .addField("coinflip", "Una pequeña apuesta y el coin flip decidira todo")
      .addField("fusbol", "Manito vamo a jugar un fuchibol")
      .addField(
        "hack",
        "alguien te cae mal pues usa el comando hack con virus por ejemplo tumama.god"
      )
      .addField(
        "sdlg",
        "el shitpost es un pasatiempo pero la grasa es un sentiemiento como dicen el piberio"
      )
      .setColor("RANDOM")
      .setTimestamp();

    const EEmbed = new MessageEmbed()
      .setTitle("Help: slash economia")
      .setDescription("Bienvenido a los slash de economia")
      .addField("addmoney", "Agrega dinero a los usuarios *solo staff*")
      .addField("balance", "Revisa tu balance")
      .addField("dep", "Deposita dinero en el banco")
      .addField("pay", "Paga a un usuario")
      .addField("with", "Quita dinero del banco")
      .addField("work", "Trabaja para conseguir dinero")
      .setColor("RANDOM")
      .setTimestamp();

    const Sembed = new MessageEmbed()
      .setTitle("Help: slash staff")
      .setDescription("Bienvenido a los slash de los staff")
      .addField("addrole", "Agrega roles a los usuarios")
      .addField("ban", "Banea a los usuarios")
      .addField("kick", "Kickea a los usuarios")
      .addField("lock", "Bloque el canal en donde estas")
      .addField("removerol", "Remueve el rol a un usuario")
      .addField("unlock", "Desbloquea el canal en donde estas")
      .addField("unwarn", "Quitale el warn a un usuario")
      .addField("warn", "Warnea a un usuario")
      .addField("warns", "Ve los warns de un usuario")
      .setColor("RANDOM")
      .setTimestamp();

    const UEmbed = new MessageEmbed()
      .setTitle("Help: slash utiles")
      .setDescription("Bienvenido a los slash utiles")
      .addField("botinfo", "Ve mi informacion")
      .addField("ping", "Revisa mi ping")
      .addField("Recordar", "Pon un timer")
      .addField("say", "algo que quieres que diga")
      .addField("serverinfo", "Info del server")
      .setColor("RANDOM")
      .setTimestamp();

    const pEmbed = new MessageEmbed()
      .setTitle("Help: comandos con prefix")
      .setDescription("Aqui estan los comandos con prefix")
      .addField("ytsearch", "Busca algo en youtube")
      .setColor("RANDOM")
      .setTimestamp();

    interaction.reply({
      content: "👋 Hola",
      embeds: [PpEmbed],
      components: [row],
    });

    const ifilter = (i) => i.user.id === interaction.member.id;

    const collector = interaction.channel.createMessageComponentCollector({
      filter: ifilter,
      time: 60000,
    });

    collector.on("collect", async (i) => {
      if (i.values[0] === "1111") {
        await i.deferUpdate();
        i.editReply({ embeds: [DEmbed], components: [row] });
      }
    });
    collector.on("collect", async (i) => {
      if (i.values[0] === "1222") {
        await i.deferUpdate();
        i.editReply({ embeds: [EEmbed] });
      }
    });
    collector.on("collect", async (i) => {
      if (i.values[0] === "1333") {
        await i.deferUpdate();
        i.editReply({ embeds: [Sembed], components: [row] });
      }
    });
    collector.on("collect", async (i) => {
      if (i.values[0] === "1444") {
        await i.deferUpdate();
        i.editReply({ embeds: [UEmbed], components: [row] });
      }
    });
    collector.on("collect", async (i) => {
      if (i.values[0] === "2111") {
        await i.deferUpdate();
        i.editReply({ embeds: [pEmbed], components: [row] });
      }
    });
  },
};
