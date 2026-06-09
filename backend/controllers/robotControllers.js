const Robot = require("../models/robotModel")

exports.createRobot = async (req, res) => {
    try {
        if(!req.user || req.user.role !== "superadmin"){
            return res.status(403).json({
                message: "Access denied! Only super admins can create users." 
            });
        }

        const newRobot = await Robot.create(req.body)
        res.status(201).json({
            message: "Robot created successfully!",
            data: {newRobot}
        })
    } catch (error) {
        res.status(400).json({
            message: "Failed to create new robot",
            error: error.message
        })
    }
}

exports.getAllRobots = async (req, res) => {
    try {
        if(!req.user){
            return res.status(401).json({
                message: "Access denied! User should be authorized"
            });
        }

        const robots = await Robot.find();
        res.status(200).json({
            message: "Robots retrieved successfully!",
            data: {robots}
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to retrieve robots data!",
            error: error.message
        })
    } 
}

exports.getRobot = async (req, res) => {
    try {
        if(!req.user){
            return res.status(401).json({
                message: "Access denied! User should be authorized"
            });
        }

        const robot = Robot.findById(req.params.id);
        if(!robot){
            return res.status(404).json({message: "robot with this id not found"})
        }

        return res.status(200).json({
            message: "robot retrieved successfully!",
            data: {robot}
        })
    } catch (error) {
        res.status(400).json({
            message: "Failed to get robot data",
            error: error.message
        })
    }
}

exports.updateRobot = async (req, res) => {
    try {
        if(!req.user){
            return res.status(401).json({
                message: "Access denied! User should be authorized"
            });
        }

        const updatedRobot = await Robot.findByIdAndUpdate(req.params.id, req.body, {new:true});
        res.status(201).json({
            message: "Robot data updated successfully",
            data: {updatedRobot}
        })

    } catch (error) {
        res.status(400).json({
            message: "Failed to update robot data!!",
            error : error.message
        })
    }
}

exports.deleteRobot = async (req, res) => {
    try {
        if(!req.user){
            return res.status(401).json({
                message: "Access denied! User should be authorized"
            });
        }

        const deletedRobot = await Robot.findByIdAndDelete(req.params.id);

        if(!deletedRobot){
            return res.status(404).json({
                message: "robot with thi Id not found!"
            });
        }

        res.status(200).json({
            message: "robot deleted successfully!"
        })
    } catch (error) {
        res.status(400).json({
            message: "Failed to delete robot!",
            error: error.message
        });
    }
}