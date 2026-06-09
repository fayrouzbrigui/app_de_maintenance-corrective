const mongoose = require("mongoose");

const infoSchema = new mongoose.Schema({
    robotUuid : {
        type : String,
        required : true,
        index : true
    },

    temperature : {
        type: Number,
        default : 0
    },

    speed : {
        type : Number,
        default : 0
    },

    battery_level : {
        type : Number
    },

    lastUpdate : {
        type : Date,
        default : Date.now
    },
});

const Info = mongoose.model("Info", infoSchema);
module.exports = Info;