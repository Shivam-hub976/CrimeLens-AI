// functions/api/index.js
const express = require('express');
const catalyst = require('zcatalyst-sdk-node');
const { performSpatialClustering, trainAndPredictRisk } = require('./mlService');

const app = express();
app.use(express.json());

// GET: Fetch all crimes & clustering insights
app.get('/all-crimes', async (req, res) => {
    try {
        const zcql = catalyst.initialize(req).zcql();
        
        const query = `
            SELECT 
                Crimes.ROWID, Crimes.crime_type, Crimes.date_reported, Crimes.description, 
                Locations.district, Locations.latitude, Locations.longitude,
                Suspects.alias, Suspects.status
            FROM Crimes 
            LEFT JOIN Locations ON Crimes.ROWID = Locations.crime_id
            LEFT JOIN Suspects ON Crimes.ROWID = Suspects.crime_id
        `;
        
        const records = await zcql.executeZCQLQuery(query);
        
        // Delegate complex algorithms to the ML service
        const mlInsights = performSpatialClustering(records);

        res.status(200).json({
            data: records,
            ai_insights: mlInsights
        });

    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ error: "Failed to fetch and analyze data." });
    }
});

// POST: Predict risk using Naive Bayes
app.post('/predict-risk', async (req, res) => {
    try {
        const targetDistrict = req.body.district;
        
        // Reject request if no district is provided
        if (!targetDistrict) {
            return res.status(400).json({ error: "Target district is required for simulation." });
        }

        const zcql = catalyst.initialize(req).zcql();
        
        const query = `
            SELECT Crimes.crime_type, Locations.district 
            FROM Crimes 
            LEFT JOIN Locations ON Crimes.ROWID = Locations.crime_id
        `;
        
        const records = await zcql.executeZCQLQuery(query);
        
        // Delegate model training and prediction to the ML service
        const predictionData = trainAndPredictRisk(records, targetDistrict);

        res.status(200).json(predictionData);

    } catch (error) {
        console.error("Prediction Error:", error);
        res.status(500).json({ error: "Failed to generate prediction." });
    }
});

module.exports = app;