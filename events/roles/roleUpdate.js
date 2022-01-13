const Discord = require("discord.js");

const logs = require("../../schema/logs-schema");

module.exports = {
  name: "roleUpdate",
  async execute(client, oldRol, newRol) {
    try {
      const datos = await logs.findOne({ guildId: oldRol.guild.id });

      if (!datos) return;

      if (datos.Status === false) return;

      if (datos.Status === true) {
        const roleUpdateEmbed = new Discord.MessageEmbed()
          .setTitle("Rol Actualizado")
          .addField("Nombre viejo", `${oldRol.name}`)
          .addField("Nombre nuevo", `${newRol.name}`)
          .addField("Posicion antigua", `${oldRol.position}`)
          .addField("Posicion nueva", `${newRol.position}`)
          .addField("Antiguo color", `${oldRol.hexColor}`)
          .addField("Nuevo color", `${newRol.hexColor}`)
          .addField("Id", `${newRol.id}`)
          .setColor(newRol.hexColor);

        client.channels.cache
          .get(datos.channelId)
          .send({ embeds: [roleUpdateEmbed] });
      }
    } catch (e) {
      console.log(e);
    }
  },
};
