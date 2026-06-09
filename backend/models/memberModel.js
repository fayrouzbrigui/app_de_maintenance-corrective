const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({
    
    imagePath: {
        type: String,
        required: true, 
    },
    
    name: {
        type: String,
        required: [true, "Name is required !!!"],
    },


    timestamp: {
        type: Date,
        default: Date.now
    }
    
}, { timestamps: true }); 

const Image = mongoose.model("Member", MemberSchema);
module.exports = Image;
