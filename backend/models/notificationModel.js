const mongoose = require("mongoose")

const notifcationSchema = new mongoose.Schema({
    robotuuid :{
        type : String,
        required : false
    },

    type : {
        type : String,
        required : true
    },

    severity : {
        type : String,
        enum : ['low', 'medium', 'high'],
        default : 'low'
    },

    message : {
        type : String,
        required : true
    },

    data : {
        type : Object
    },

    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model('Notification', notifcationSchema);