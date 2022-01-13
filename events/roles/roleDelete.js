const Discord = require("discord.js");

const logs = require("../../schema/logs-schema")

module.exports = {
  name: "roleDelete",
  async execute(client, roleDelete) {
      try{
        const datos = await logs.findOne({ guildId: roleDelete.guild.id})

        if(!datos)return

        if(datos.Status === false)return

        if(datos.Status === true){
            const embedDeleteRol = new Discord.MessageEmbed()
            .setTitle("Rol eliminado")
            .addField("Nombre", `${roleDelete.name}`)
            .addField("ID", `${roleDelete.id}`)
            .setColor(roleDelete.hexColor)

            client.channels.cache.get(datos.channelId).send({embeds:[embedDeleteRol]})
        }
      }catch (e){
          console.log(e)
      }
    }
}