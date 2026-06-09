const mongoose = require("mongoose");

const commandSchema = new mongoose.Schema({
    robotUuid : {
        type : String,
        required : true
    },

    command : {
        type : String,
        enum : ["start", "stop"],
        required : true
    },

    executedAt: {
        type : Date,
        default : Date.now
    }
}, {timestamps : true});

const Command = mongoose.model("Command", commandSchema);
module.exports = Command;
