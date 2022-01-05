const { Schema, model } = require('mongoose')

const ticket = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    categoryId: {
        type: String,
        required: true,
    },
    staffRoleId: {
        type: String,
        required: true,
    },
})

module.exports = model('ticket', ticket)