const GPS = require("../models/gpsModel");
const Robot = require("../models/robotModel");

exports.getGpsByRobot = async (req, res) =>{
    try {
        if(!req.user){
            return res.status(401).json({
                message : "the user must be authorized"
            });
        }

        const { uuid } = req.params;

        if(!uuid){
            return res.status(400).json({
                message : "uuid is required"
            });
        }

        const robot = await Robot.findOne({uuid});

        if(!robot){
            return res.status(400).json({
                message : "robot with this uuid not found"
            });
        }

        const gps = await GPS.find({robotUuid : uuid}).sort({lastUpdate : -1}).limit(100);

        if(!gps || gps.length === 0){
            return res.status(404).json({
                message : "no gps data found for this robot"
            });
        }

        res.status(200).json(gps);


    } catch (error) {
        res.status(400).json({
            message : "failed to get gps data",
            error : error.message 
        })
        
    }
}