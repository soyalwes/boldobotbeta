const { Schema, model } = require('mongoose')

let mute = new Schema({
    guildId: String,
    muteRolId: String,
})

module.exports = model('mute', mute)