const Discord = require("discord.js");
const fetch = require("node-superfetch");

module.exports = {
  name: "messageCreate",
  async execute(client, message) {
    if(message.author.bot)return

      if(message.content.startsWith("hentai")){
          message.channel.send({content:"El que no paso porno hentai se va baneado"})
      }

      if(message.content.startsWith("nashe")){
        message.channel.send("nashe noooo")
      }
      
  }
}