const { Schema, model } = require('mongoose')

const logs = new Schema({
    guildId: {
        type: String,
        require: true,
    },
    channelId: {
        type: String,
        required: true,
    },
    Status: {
        type: Boolean,
        required: true,
    },
})


module.exports = model("log", logs)