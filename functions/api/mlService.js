// functions/api/mlService.js
const { kmeans } = require('ml-kmeans');
const bayes = require('bayes');

//Executes K-Means spatial clustering on coordinate data
const performSpatialClustering = (records) => {
    let mlInsights = { 
        status: "Insufficient data for spatial clustering", 
        hotspotCentroid: null, 
        clusterSize: 0 
    };

    const spatialData = [];
    records.forEach(row => {
        const lat = parseFloat(row.Locations?.latitude);
        const lng = parseFloat(row.Locations?.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
            spatialData.push([lat, lng]);
        }
    });

    if (spatialData.length >= 2) {
        // Dynamically calculate 'k' based on dataset size (1 cluster per 50 records, min 2, max 5)
        const k = Math.min(Math.max(Math.floor(spatialData.length / 50), 2), 5); 
        const clusters = kmeans(spatialData, k, { initialization: 'kmeans++' });
        
        // Dynamically initialize counters for 'k' clusters
        let clusterCounts = {};
        for (let i = 0; i < k; i++) {
            clusterCounts[i] = 0;
        }
        
        // Count how many incidents fall into each cluster
        clusters.clusters.forEach(c => clusterCounts[c]++);
        
        // Find the index of the cluster with the most incidents (Highest Risk Hotspot)
        let highestRiskClusterIndex = 0;
        let maxCount = 0;
        
        for (let i = 0; i < k; i++) {
            if (clusterCounts[i] > maxCount) {
                maxCount = clusterCounts[i];
                highestRiskClusterIndex = i;
            }
        }
        
        const centroid = clusters.centroids[highestRiskClusterIndex];
        
        mlInsights = {
            status: "Active",
            primaryHotspotCentroid: { latitude: centroid[0], longitude: centroid[1] },
            incidentCountInHotspot: clusterCounts[highestRiskClusterIndex],
            totalProcessed: spatialData.length
        };
    }

    return mlInsights;
};

/**
 * Trains a Naive Bayes model and predicts risk for a target district
 */
const trainAndPredictRisk = (records, targetDistrict) => {
    const classifier = bayes();
        
    records.forEach(row => {
        const districtName = row.Locations?.district;
        const crimeType = row.Crimes?.crime_type;
        
        if (districtName && crimeType) {
            classifier.learn(districtName, crimeType);
        }
    });

    const predictedCrime = classifier.categorize(targetDistrict);
    
    return {
        target_environment: targetDistrict,
        predicted_risk_category: predictedCrime,
        model_status: "Trained on historical spatial distribution"
    };
};

module.exports = {
    performSpatialClustering,
    trainAndPredictRisk
};