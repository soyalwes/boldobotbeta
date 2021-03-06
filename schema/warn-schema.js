const { Schema, model } = require('mongoose')

let warn = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    warns: {
        type: Number,
        default: 0
    }
});

module.exports = model('warn', warn)