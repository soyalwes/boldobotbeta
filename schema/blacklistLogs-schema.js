const { Schema, model } = require('mongoose')

const logs = new Schema({
    Status: {
        type: Boolean,
        required: true,
    },
})


module.exports = model("log", logs)