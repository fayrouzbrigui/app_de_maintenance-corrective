const mongoose = require("mongoose");

const robotSchema = new mongoose.Schema(
    {
        
        reference : {
            type : String,
            required : [true, "Name is required !!!"]
        },

        ipAddress : {
            type : String,
            required : [true, "Name is required !!!"]
        },

        uuid: {
            type: String,
            unique: true, 
            index: true,
            required : true
        },
        
    }

);

const Robot = mongoose.model("Robot", robotSchema);
module.exports = Robot;