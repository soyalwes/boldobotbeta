const Discord = require("discord.js")

module.exports = {
    name: "error",
    async execute(client, channel, error) {
        console.log(error)
        
        channel.send(`Un error a ocurrido`)
    }
}