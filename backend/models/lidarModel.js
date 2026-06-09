const mongoose = require("mongoose");

const lidarSchema = new mongoose.Schema({
    robotUuid: { 
        type: String, 
        required: true, 
        index: true 
    },

    lastDistance: { 
        type: Number, default: 0 
    },

    signalStrength: { 
        type: Number, default: 0 
    },

    temperature: { 
        type: Number, default: 0 
    },

    minDistance: { 
        type: Number, default: 0 
    },

    maxDistance: { 
        type: Number, default: 0 
    },

    averageDistance: { 
        type: Number, default: 0 
    },

    lastUpdate: { 
        type: Date, 
        default: Date.now 
    },
});

const Lidar = mongoose.model("Lidar", lidarSchema);
module.exports = Lidar;