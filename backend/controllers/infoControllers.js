const Info = require("../models/infoModel");
const Robot = require("../models/robotModel");


exports.getInfoByRobot = async (req, res) => {
    try {
        if(!req.user){
            return res.status(401).json({
                message : "access denied! User should be authorized"
            });
        }

        const {uuid} = req.params;
        if(!uuid){
            return res.status(400).json({
                message : "uuid is required"
            });
        }

        const robot = await Robot.findOne({uuid});
        console.log("Found robot: ", robot);

        if(!robot){
            return res.status(400).json({
                message: "robot with this uuid not found"
            });
        }

        const info = (await Info.find({robotUuid : uuid})).sort({lastUpdate : 1}).limit(100);
        if(!info || info.length === 0){
            return res.status(404).json({
                message : "no info found for this robot"
            });
        }

        res.status(200).json(info);
        
    } catch (error) {
        res.status(400).json({
            message: "Failed to get data",
            error : error.meesage
        })
        
    }
}