const { Schema, model } = require('mongoose')

const Economia = new Schema({
    guildId: String,    
    userId: String,
    Dinero: {
        type: Number,
        default: 10
    },
    DineroEnBanco: {
        type: Number,
        default: 0
    }
});
module.exports = model('Economia', Economia)