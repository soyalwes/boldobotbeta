const Discord = require("discord.js");

const logs = require("../../schema/logs-schema")

module.exports = {
  name: "roleCreate",
  async execute(client, roleCreate) {
      try{
        const datos = await logs.findOne({ guildId: roleCreate.guild.id})

        if(!datos)return

        if(datos.Status === false)return

        if(datos.Status === true){
            const embedNewRole = new Discord.MessageEmbed()
            .setTitle("Rol creado")
            .addField("Nombre", `${roleCreate.name}`)
            .addField("ID", `${roleCreate.id}`)
            .setColor("BLUE")

            client.channels.cache.get(datos.channelId).send({embeds:[embedNewRole]})
        }
      }catch (e) {
          return console.log(e)
      }
  }
}