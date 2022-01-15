const { Schema, model } = require('mongoose')

let captcha = new Schema({
    guildId: {
        type: String,
        required: true
    },
    roleId: {
        type: String,
        required: true
    }
})

module.exports = model("captchas", captcha)