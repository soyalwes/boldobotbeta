module.exports = {
    name: "searchNoResult",
    async execute(client, message, query) {
        message.channel.send(`No hay resulatados para: ${query}`)
    }
}