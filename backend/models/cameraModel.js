const mongoose = require("mongoose");

const cameraSchema = new mongoose.Schema({
    robotUuid: { 
        type: String, 
        required: true, 
        index: true 
    },

    focus: {
        type : Number,
        required : true
    },

    brightness: {
        type: Number,
        required : true
    },

    contrast: {
        type: Number,
        required: true
    },

    noise:{
        type: Number,
        required: true
    },

    fps:{
        type: Number,
        required: true
    },

    lastUpdate: { 
        type: Date, 
        default: Date.now 
    },
})

const Camera = mongoose.model("Camera", cameraSchema);
module.exports = Camera;