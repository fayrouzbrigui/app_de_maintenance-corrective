const Robot = require("../models/robotModel");
const Command = require("../models/commandModel");
const {sendRosCommand} = require("../services/rosService");

exports.startRobot = async(req, res) =>{
    try {
        const {uuid} = req.params;

        const robot = await Robot.findOne({uuid});

        if(!robot){
            return res.status(404).json({
                message: "robot not found"
            });
        };

        await sendRosCommand("start");

        await Command.create({
            robotUuid : uuid,
            command : "start"
        });

        res.json({message : "robot started", robot : uuid});
        
    } catch (error) {
        res.status(500).json({error});
    }
};

exports.stopRobot = async (req, res) =>{
    try {
        const {uuid} = req.params;
        const robot = await Robot.findOne({uuid});

        if(!robot){
            return res.status(404).json({
                message : "robot not foud"
            });
        };

        await sendRosCommand("stop");

        await Command.create({
            robotUuid : uuid,
            command : "stop"
        })

        res.status(200).json({message: "robot stoped", robot : uuid});

    } catch (error) {
        res.status(500).json({error});
        
    }
}