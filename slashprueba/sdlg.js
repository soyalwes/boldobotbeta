const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Canvas = require("canvas");

let cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sdlg")
    .setDescription("Revive la grasa")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Selecciona el usuario")
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

    const avatar = await Canvas.loadImage(user.displayAvatarURL({ format: 'png' }))

    const canvas = Canvas.createCanvas(800, 600)
    const ctx = canvas.getContext('2d')

    const background = await Canvas.loadImage('https://cdn.discordapp.com/attachments/851634368619085874/909228210888273920/grasapapu.png%27')

    ctx.drawImage(avatar, 0, 0, canvas.width, canvas.height)

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    const attachment = new MessageAttachment(canvas.toBuffer(), `${user.username}_la_grasa_es_un_sentimiento.jpg`)

    interaction.reply({content:`${interaction.member.user.username} graseo a ${user.user.username}`})

    interaction.followUp({files:[attachment]})
}
};
