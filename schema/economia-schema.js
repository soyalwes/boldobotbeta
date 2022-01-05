const { Schema, model } = require('mongoose')

const Economia = new Schema({
    guildId: {
        type: String,
        required: true,
    },   
    userId: {
        type: String,
        required: true,
    },
    Dinero: {
        type: Number,
        default: 10
    },
});
module.exports = model('Economia', Economia)