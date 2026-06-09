const Robot = require("../models/robotModel");
const Camera = require("../models/cameraModel")

exports.getCameraByRobot = async (req, res) => {
    try {
        if(!req.user){
            return res.status(401).json({ message: "Access denied! User should be authorized" });
        }

        const { uuid } = req.params;
        if(!uuid){
            return res.status(400).json({ message: "uuid is required" });
        }

        const robot = await Robot.findOne({ uuid });
        console.log("Found robot:", robot);
        if (!robot) {
            return res.status(400).json({ message: "robot with this uuid not found" });
        }

        const cameras = await Camera.find({ robotUuid: uuid }).sort({ lastUpdate: -1 }).limit(100);
        if(!cameras || cameras.length === 0){
            return res.status(404).json({ message: "No camera data found for this robot!" });
        }

        res.status(200).json(cameras);

    } catch (error) {
        res.status(400).json({ message: "Failed to get camera data", error: error.message });
    }
}