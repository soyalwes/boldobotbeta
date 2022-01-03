const Discord = require("discord.js");
const { ContextMenuCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

let cooldown = new Set();

module.exports = {
  data: new ContextMenuCommandBuilder().setName("Avatar").setType(2),

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

    const embedAvatar = new MessageEmbed()
    .setDescription(`[Descargar avatar](${user.user.displayAvatarURL({
        format: "png",
        dynamic: true
    })})`)
    .setImage(user.displayAvatarURL({dynamic: true, size: 2048}))
    .setColor("RANDOM")
    .setTimestamp()
    .setFooter(`Avatar pedido por: ${interaction.user.tag}`)

    interaction.reply({embeds:[embedAvatar]})
  },
};
