const mongoose = require("mongoose");

const plateSchema = new mongoose.Schema({
    plateText : {
        type : String,
        required : true,
        unique: true,
        uppercase: true,
        trim: true
    },

    status :{
        type : String,
        enum : ["allowed", "denied", "unkown"],
        required : true
    },

     created_at : {
        type: Date,
        default: Date.now(),
    }
});

const Plate = mongoose.model("Plate", plateSchema);
module.exports = Plate;