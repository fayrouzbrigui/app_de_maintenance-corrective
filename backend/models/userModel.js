const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required : [true, "Name is required !!!"]
        },

        email : {
            type : String,
            required : [true, "Email is required !!!"],
            validate : [validator.isEmail, "Email is not valid !!!"],
            unique : true,
            lowercase : true,
        },

        password : {
            type : String,
            required : [true, "password is required !!!"],
            minlength : 8,
        },

        role : {
            type : String,
            enum : ["superadmin", "admin"],
            default : "superadmin",
        },

        last_password_update : {
            type: Date,
            default: Date.now(),
        },

        created_at : {
            type: Date,
            default: Date.now(),
        }

    }
);

userSchema.pre("save", async function () {
    // Only hash if password is new or modified
    if (!this.isModified("password")) return;

    this.password = await bcryptjs.hash(this.password, 10);
});
userSchema.methods.comparePassword = async function(password){
    return await bcryptjs.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;