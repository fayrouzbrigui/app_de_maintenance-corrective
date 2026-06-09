const Pc = require("../models/pcModel");
const Robot = require("../models/robotModel");

exports.getPcByRobot = async(req, res) =>{
    try {
        if(!req.user){
            return res.status(401).json({
                message : "access denied! user should be authorized"
            });
        }

        const {uuid} = req.params;
        if(!uuid){
            return res.status(400).json({
                message: "uuid is required"
            });
        }

        const robot = await Robot.findOne({uuid});
        console.log("Found robot:", robot);
        if(!robot){
            return res.status(400).json({
                message: "robot with this uuid not found"
            });
        }

        const pc = await Pc.find({ robotUuid: uuid }).sort({ lastUpdate: -1 }).limit(100);
        if(!pc || pc.length === 0){
            return res.status(404).json({ message: "No pc data found for this robot!" });
        }

        res.status(200).json(pc);

    } catch (error) {
        res.status(400).json({ message: "Failed to get pc data", error: error.message });
    }
    
}