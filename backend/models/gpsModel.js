const mongoose = require("mongoose");

const gpsSchema = new mongoose.Schema({
    robotUuid : {
        type : String,
        required : true
    },

    latitude : {
        type : Number,
        required : true
    },

    longitude : {
        type : Number,
        required : true
    },

    num_satellites : {
        type : Number,
        required : true
    },

    lastUpdate : {
        type : Date,
        default : Date.now
    },
})

const GPS = mongoose.model("GPS", gpsSchema);
module.exports = GPS;