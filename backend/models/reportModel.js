const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
    robotUuid : {
        type : String,
        required : true
    },

    camera : {
        type : String,
        default : "unknown"
    },

    lidar : {
        type : String,
        default : "unknown"
    },

    gps : {
        type : String,
        default : "unknown"
    },

    timestamp: {
    type: Date,
    default: Date.now
  }
});

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;