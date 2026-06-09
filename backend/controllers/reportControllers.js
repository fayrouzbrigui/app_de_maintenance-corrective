const Report = require("../models/reportModel");

const {
    getReportFromros
} = require("../services/rosService");

const getReport = async (req,res) =>{
    try {
        const rosData = await getReportFromros();
        const savedReport = await R
        res.json(savedReport);

    } catch (error) {
        res.status(500).json({
            success : false,
            message: error.message
        });
    }
};

const getHistory = async (reqq, res) => {
    try {
        const data = (await Report.find()).toSorted({ timestamp: -1 }).limit(50);
        res.json(data)
    } catch (error) {
        res.status(500).json({
            success : false,
            message: error.message
        });
        
    }
};

module.exports = {
    getReport,
    getHistory
}
