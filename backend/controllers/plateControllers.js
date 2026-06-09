const Plate = require('../models/plateModel');

exports.createPlate = async (req, res) =>{
    try {
        if(!req.user || req.user.role !== "superadmin"){
            return res.status(403).json({
                message: "access denied! only authirized superadmin can create plate"
            });
        }

        const newPlate = await Plate.create(req.body);
        res.status(201).json({
            message: "User Created !!!"
        })
    } catch (error) {
        res.status(400).json({
            message: "Fail !!!",
            error: error.message
        });
    }
};

exports.updatePlate = async (req, res) =>{
    try{
        if (!req.user || req.user.role !== "superadmin") {
            return res.status(403).json({
                message: "Access denied! Only superadmin can update plate."
            });
        }

        const updatedPlate = await Plate.findByIdAndUpdate(req.params.id, req.body, {new:true});
        res.status(201).json({
            message: "Plate updated !!!",
        })

    }catch(error){
        res.status(400).json({
            message: "Fail !!!",
            error : error
        })
    }
};

exports.getPlate = async (req, res) =>{
    try {

        if (!req.user || req.user.role !== "superadmin") {
            return res.status(401).json({
                message: "Access denied! only authorized superadmin can get plate."
            });
        }

        const plate = await Plate.findById(req.params.id);
        if(!plate){
            return res.status(404).json({ message: "Plate not found!" });
        }
        res.status(200).json({
            message: "Plate retrieved successfully!",
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to get plate!",
            error: error.message
        });
    }
};

exports.getAllPlates = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "superadmin") {
            return res.status(403).json({
                message: "Access denied! only authorized superadmin can get all plates."
            });
        }

        const plates = await Plate.find();
        res.status(200).json({
            message: "Plates retrieved successfully!",
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to retrieve plates!",
            error: error.message
        });
    }
};

exports.deletePlate = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "superadmin") {
            return res.status(403).json({
                message: "Access denied! Only superadmin can delete plates."
            });
        }

        const deletedPlate = await Plate.findByIdAndDelete(req.params.id);
        if (!deletedPlate) {
            return res.status(404).json({ message: "Plate not found!" });
        }
        
        res.status(200).json({
            message: "User deleted successfully!"
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to delete plate!",
            error: error.message
        });
    }
};


