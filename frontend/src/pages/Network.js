import React, { useRef, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

export default function Network({ crimes, loading }) {
  const fgRef = useRef();

  // Loosen the physics to spread out clustered nodes
  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3Force('charge').strength(-200);
      fgRef.current.d3Force('link').distance(60);
    }
  }, [crimes]);

  if (loading) return <p>Processing graph associations...</p>;

  const nodes = [];
  const links = [];
  const addedNodes = new Set();

  crimes.forEach(record => {
    const crimeId = record.Crimes?.ROWID;
    const crimeType = record.Crimes?.crime_type;
    const district = record.Locations?.district;
    const suspect = record.Suspects?.alias;

    if (crimeId && !addedNodes.has(crimeId)) {
      nodes.push({ id: crimeId, name: `${crimeType} (${crimeId})`, type: 'Incident', color: '#ef4444' });
      addedNodes.add(crimeId);
    }
    if (district && !addedNodes.has(`loc_${district}`)) {
      nodes.push({ id: `loc_${district}`, name: district, type: 'District Hub', color: '#3b82f6' });
      addedNodes.add(`loc_${district}`);
    }
    if (suspect && !addedNodes.has(`susp_${suspect}`)) {
      nodes.push({ id: `susp_${suspect}`, name: suspect, type: 'Suspect', color: '#a855f7' });
      addedNodes.add(`susp_${suspect}`);
    }
    if (crimeId && district) links.push({ source: crimeId, target: `loc_${district}` });
    if (suspect && crimeId) links.push({ source: `susp_${suspect}`, target: crimeId });
  });

  return (
    <div>
      <h2 className="page-title">Criminal Network Graph</h2>
      
      {/* Wrapper needs position: relative for the absolute floating legend */}
      <div className="network-wrapper" style={{ position: 'relative' }}>
        
        {/* FLOATING GLASSMORPHISM LEGEND */}
        <div style={{
          position: 'absolute', top: '16px', right: '16px', zIndex: 10,
          backgroundColor: 'rgba(30, 41, 59, 0.85)', backdropFilter: 'blur(4px)',
          padding: '12px 16px', borderRadius: '8px', border: '1px solid #334155',
          color: '#ffffff', fontSize: '13px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid #475569', paddingBottom: '4px' }}>
            Network Entity Key
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#3b82f6', display: 'inline-block' }}></span>
            <span>Police Station / District Hub</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block' }}></span>
            <span>Crime Incident ID</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#a855f7', display: 'inline-block' }}></span>
            <span>Suspect / Offender</span>
          </div>
        </div>

        {nodes.length > 0 ? (
          <ForceGraph2D 
            ref={fgRef}
            graphData={{ nodes, links }} 
            
            // 1. Hover Tooltips
            nodeLabel={node => `
              <div style="background: #1e293b; color: #f8fafc; padding: 8px 12px; border-radius: 6px; font-family: sans-serif; font-size: 12px; border: 1px solid #475569;">
                <strong style="color: #60a5fa;">${node.type || 'Entity'}:</strong> ${node.name || node.id}
              </div>
            `}
            
            // 2. Draw Text Labels next to nodes
            nodeCanvasObject={(node, ctx, globalScale) => {
              const label = node.name || node.id;
              const fontSize = 12 / globalScale;
              const radius = 6;

              ctx.beginPath();
              ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
              ctx.fillStyle = node.color || '#3b82f6';
              ctx.fill();

              // Only show text when sufficiently zoomed in to avoid clutter
              if (globalScale > 0.8) {
                ctx.font = `${fontSize}px Sans-Serif`;
                ctx.fillStyle = '#f8fafc';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                ctx.fillText(label, node.x + radius + 4, node.y);
              }
            }}
            
            // 3. Keep hover detection accurate over drawn nodes
            nodePointerAreaPaint={(node, color, ctx) => {
              ctx.fillStyle = color;
              ctx.beginPath();
              ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI, false);
              ctx.fill();
            }}
            
            linkColor={() => 'rgba(148, 163, 184, 0.4)'} 
            backgroundColor="#0f172a" 
            width={850} 
            height={600} 
          />
        ) : (
          <p className="network-empty" style={{ width: '100%', textAlign: 'center' }}>No network data available.</p>
        )}
      </div>
    </div>
  );
}