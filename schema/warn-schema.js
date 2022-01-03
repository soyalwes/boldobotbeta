const { Schema, model } = require('mongoose')

let warn = new Schema({
    userId: String,
    guildId: String,
    warns: {
        type: Number,
        default: 0
    }
});

module.exports = model('warn', warn)