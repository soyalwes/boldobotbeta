const { Schema, model } = require('mongoose')

const ticket = new Schema({
    guildId: String,
    categoryId: String,
    staffRoleId: String,
})

module.exports = model('ticket', ticket)