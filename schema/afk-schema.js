const { Schema, model } = require('mongoose')

let afk = new Schema({
    guildId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    Status: {
        type: Boolean,
        required: true
    },
})

module.exports = model("afkSystem", afk)