const mongoose = require("mongoose")

const pcSchema = new mongoose.Schema({
    robotUuid: { 
        type: String, 
        required: true, 
        index: true 
    },

    cpu_usage:{
        type : Number,
    },

    cpu_temp:{
        type : Number,
    },

    gpu_usage:{
        type : Number,
    },

    gpu_temp:{
        type : Number,
    },

    lastUpdate: { 
        type: Date, 
        default: Date.now 
    },
});

const Pc = mongoose.model("Pc", pcSchema);
module.exports = Pc;