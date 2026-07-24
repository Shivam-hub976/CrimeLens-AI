import React from 'react';
import { FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Reports({ crimes, aiInsights }) {
  const generatePDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42); 
    doc.text("CrimeLens AI - Intelligence Briefing", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
    
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("Executive Summary", 14, 40);
    
    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105);
    let yPos = 48;
    
    if (aiInsights && aiInsights.status === "Active") {
      doc.text(`• Geospatial AI Alert: A high-risk zone has been detected at coordinates`, 14, yPos);
      yPos += 6;
      doc.text(`  Lat: ${aiInsights.primaryHotspotCentroid.latitude.toFixed(4)}, Lng: ${aiInsights.primaryHotspotCentroid.longitude.toFixed(4)}.`, 14, yPos);
      yPos += 6;
      doc.text(`• Cluster Volume: ${aiInsights.incidentCountInHotspot} linked incidents require immediate resource allocation.`, 14, yPos);
      yPos += 14;
    } else {
       doc.text("• Geospatial AI: Scanning in progress. Insufficient data for clustering.", 14, yPos);
       yPos += 14;
    }

    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("Recent Incident Logs", 14, yPos);
    yPos += 6;

    const tableColumn = ["Crime Type", "District", "Suspect", "Date Reported"];
    const tableRows = crimes.map(crime => [
      crime.Crimes?.crime_type || "N/A",
      crime.Locations?.district || "N/A",
      crime.Suspects?.alias || "Unknown",
      crime.Crimes?.date_reported || "N/A"
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: yPos,
      theme: 'striped',
      styles: { fontSize: 10, cellPadding: 4 },
      headStyles: { fillColor: [59, 130, 246] } 
    });

    doc.save("CrimeLens_Intelligence_Report.pdf");
  };

  return (
    <div>
      <h2 className="page-title">Intelligence Reports</h2>
      
      <div className="report-card">
        <h3 className="card-heading borderless">Generate Official Briefing</h3>
        <p className="report-desc">
          Compile the latest ML insights, geospatial hotspot data, and recent incident logs into a standardized PDF report for dispatch and command review.
        </p>
        
        <button className="action-btn icon-btn" onClick={generatePDF}>
          <FileText size={20} />
          Generate Intelligence Briefing
        </button>
      </div>
    </div>
  );
}