const User = require('../models/userModel');
const jwt = require("jsonwebtoken");


exports.createUser = async (req, res)=>{
    try{
        if (!req.user || req.user.role !== "superadmin") {
            return res.status(403).json({
                message: "Access denied! Only super admins can create users."
            });
        }

        const newUser = await User.create(req.body)
        res.status(201).json({message: "User created !!!",
            data : {newUser}
        })

    } catch(error){
        res.status(400).json({
            message: "Fail !!!",
            error : error
        })
    }
};

exports.updateUser = async (req, res) =>{
    try{
        if (!req.user || req.user.role !== "superadmin") {
            return res.status(403).json({
                message: "Access denied! Only admins can update users."
            });
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new:true});
        res.status(201).json({message: "User updated !!!",
            data : {updatedUser}
        })

    }catch(error){
        res.status(400).json({
            message: "Fail !!!",
            error : error
        })
    }
}

exports.getUser = async (req, res) =>{
    try {

        if (!req.user) {
            return res.status(401).json({
                message: "Access denied! You must be authenticated to get a user."
            });
        }

        const user = await User.findById(req.params.id);
        if(!user){
            return res.status(404).json({ message: "User not found!" });
        }
        res.status(200).json({
            message: "User retrieved successfully!",
            data: { user }
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to get user!",
            error: error.message
        });
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "superadmin") {
            return res.status(403).json({
                message: "Access denied! Only admins can get users."
            });
        }

        const users = await User.find();
        res.status(200).json({
            message: "Users retrieved successfully!",
            data: { users }
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to retrieve users!",
            error: error.message
        });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "superadmin") {
            return res.status(403).json({
                message: "Access denied! Only admins can delete users."
            });
        }

        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found!" });
        }
        res.status(200).json({
            message: "User deleted successfully!"
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to delete user!",
            error: error.message
        });
    }
};


exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check for required fields explicitly
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if superadmin exists
    const existingAdmin = await User.findOne({ role: "superadmin" });
    if (existingAdmin) {
      return res.status(403).json({
        message: "Superadmin already exists. Only one admin can sign up.",
      });
    }

    // Optional: Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // Create new superadmin
    const newAdmin = await User.create({ name, email, password, role: "superadmin" });

    res.status(201).json({
      message: "Superadmin created ✅",
      data: { newAdmin },
    });
  } catch (error) {
    console.error(error);
    // Return detailed validation errors if available
    if (error.name === "ValidationError") {
      const errors = {};
      for (const key in error.errors) {
        errors[key] = error.errors[key].message;
      }
      return res.status(400).json({ message: "Validation failed", errors });
    }
    res.status(500).json({ message: error.message });
  }
};


exports.login = async (req, res) =>{
    try {

        const {email, password} = req.body

        if(!email || !password){
            return res.status(400).json({
                message: "email and password are required !!!!"
            })
        }

        const user = await User.findOne({email})

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password!"
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password!"
            });
        }


        const token = jwt.sign(
            { id: user.id, name: user.name, role: user.role },
            process.env.SECRET_KEY,
            { expiresIn: "90d" }
        );

        res.status(200).json({
            message: "Login successful!",
            token,
            userId: user.id,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(400).json({
            message: "Fail !!!",
            error : error
        })
    }
}

exports.getProfile = async (req, res) => {
    try {
        res.status(200).json({
            message: "User profile fetched successfully",
            user: req.user,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch user profile",
            error: error.message,
        });
    }
};