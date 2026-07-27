import React, { useState, useEffect, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Search, Info, HelpCircle, GitCommit, Settings, AlertTriangle, ArrowRight, ShieldCheck, X, Sparkles, RefreshCw } from 'lucide-react';
import graphData from '../data/cems_knowledge_graph.json';

// Node Type Color Palette (for styled borders and status badges)
const TYPE_COLORS = {
  Plant: { border: '#38bdf8', bg: 'rgba(56, 189, 248, 0.1)', text: '#38bdf8' },
  Equipment: { border: '#2563eb', bg: 'rgba(37, 99, 235, 0.1)', text: '#60a5fa' },
  Sensor: { border: '#0d9488', bg: 'rgba(13, 148, 136, 0.1)', text: '#2dd4bf' },
  Finding: { border: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', text: '#fca5a5' },
  Diagnosis: { border: '#c084fc', bg: 'rgba(192, 132, 252, 0.1)', text: '#e9d5ff' },
  'Root Cause': { border: '#f97316', bg: 'rgba(249, 115, 22, 0.1)', text: '#ffedd5' },
  Recommendation: { border: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', text: '#a7f3d0' },
  'ML Finding': { border: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)', text: '#f3e8ff' },
  Forecast: { border: '#eab308', bg: 'rgba(234, 179, 8, 0.1)', text: '#fef9c3' },
  Health: { border: '#14b8a6', bg: 'rgba(20, 184, 166, 0.1)', text: '#99f6e4' }
};

export default function KnowledgeGraphView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  const [filterType, setFilterType] = useState('All');
  
  // Dynamic graph data state
  const [activeGraph, setActiveGraph] = useState(graphData);
  const [nodeDiagnosis, setNodeDiagnosis] = useState(null);
  const [isLoadingDiagnosis, setIsLoadingDiagnosis] = useState(false);

  useEffect(() => {
    if (selectedNode && selectedNode.type === 'Equipment') {
      setIsLoadingDiagnosis(true);
      setNodeDiagnosis(null);
      fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/graph/equipment/${selectedNode.label}/diagnosis`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch diagnosis');
          return res.json();
        })
        .then(data => {
          setNodeDiagnosis(data);
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => {
          setIsLoadingDiagnosis(false);
        });
    } else {
      setNodeDiagnosis(null);
    }
  }, [selectedNode]);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/graph`);
        if (!res.ok) throw new Error('API server offline');
        const data = await res.json();
        setActiveGraph(data);
      } catch (err) {
        console.warn('FastAPI backend offline, serving cached JSON knowledge graph data.', err);
      }
    };
    fetchGraphData();
    const interval = setInterval(fetchGraphData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Collapse/Expand state for subtrees
  const [collapsedNodes, setCollapsedNodes] = useState(new Set());

  // Layer layout configuration (determines Y coordinates)
  const LAYER_Y = {
    Plant: 40,
    Equipment: 140,
    Sensor: 260,
    Health: 260, // Side-aligned with sensors
    Finding: 380,
    Diagnosis: 500,
    'Root Cause': 620,
    Recommendation: 740,
    'ML Finding': 260,
    Forecast: 260
  };

  // Build nodes and edges for React Flow
  const { initialNodes, initialEdges } = useMemo(() => {
    const rawNodes = activeGraph.nodes || [];
    const rawRels = activeGraph.relationships || [];

    // 1. Group nodes into vertical lanes based on associated equipment
    const equipmentNodes = rawNodes.filter(n => n.type === 'Equipment');
    const scrubberNames = equipmentNodes.map(n => n.name).sort((a, b) => {
      return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    });

    const getScrubberLaneIndex = (nodeName) => {
      for (let i = 0; i < scrubberNames.length; i++) {
        if (nodeName.includes(scrubberNames[i])) {
          return i;
        }
      }
      return -1; // Global node
    };

    const laneSpacing = 360; // horizontal spacing between lanes
    const totalLanes = scrubberNames.length + 1; // +1 for the global lane
    const totalWidth = (totalLanes - 1) * laneSpacing;
    const startX = 400 - totalWidth / 2;

    const flowNodes = [];
    
    rawNodes.forEach((node) => {
      const isCollapsed = collapsedNodes.has(node.name);
      
      let x = 400; // default center
      const laneIdx = getScrubberLaneIndex(node.name);

      if (node.type === 'Plant') {
        x = 400;
      } else if (laneIdx !== -1) {
        const laneCenter = startX + laneIdx * laneSpacing;
        if (node.type === 'Health') {
          x = laneCenter - 110; // offset left
        } else if (node.type === 'Sensor' && node.name !== 'Stack VOC CEMS') {
          x = laneCenter + 110; // offset right
        } else {
          x = laneCenter;
        }
      } else {
        // Global / Ambient Node (placed in the last lane on the right)
        const globalLaneCenter = startX + scrubberNames.length * laneSpacing;
        x = globalLaneCenter;
      }

      flowNodes.push({
        id: String(node.id),
        data: { 
          label: node.name, 
          type: node.type, 
          properties: node.properties || {},
          isCollapsed
        },
        position: { 
          x: x, 
          y: LAYER_Y[node.type] || 300 
        },
        style: {
          background: 'var(--bg-card)',
          border: `2px solid ${TYPE_COLORS[node.type]?.border || '#cbd5e1'}`,
          color: 'var(--text-main)',
          borderRadius: '10px',
          padding: '10px 14px',
          fontSize: '11px',
          fontWeight: 600,
          width: '200px',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          textAlign: 'center',
          boxShadow: 'var(--card-shadow)',
          opacity: isCollapsed ? 0.4 : 1,
          transition: 'all 0.2s ease',
          cursor: 'pointer'
        }
      });
    });

    // Create Edges
    const nodeNameToId = {};
    rawNodes.forEach(n => {
      nodeNameToId[n.name] = String(n.id);
    });

    const flowEdges = [];
    rawRels.forEach((rel, idx) => {
      const sourceId = nodeNameToId[rel.source];
      const targetId = nodeNameToId[rel.target];

      if (sourceId && targetId) {
        flowEdges.push({
          id: `e-${idx}`,
          source: sourceId,
          target: targetId,
          label: rel.type.replace('_', ' '),
          type: 'smoothstep',
          animated: rel.type === 'CAUSES' || rel.type === 'HAS_RECOMMENDATION',
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 14,
            height: 14,
            color: '#64748b'
          },
          style: { 
            stroke: '#64748b', 
            strokeWidth: 1.5,
            opacity: 0.8
          },
          labelStyle: { 
            fill: 'var(--text-muted)', 
            fontSize: '9px', 
            fontWeight: 600,
            background: 'var(--bg-card)'
          }
        });
      }
    });

    return { initialNodes: flowNodes, initialEdges: flowEdges };
  }, [collapsedNodes]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync state whenever dependencies trigger recalculation
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges]);

  // Handle Search and highlights
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    
    if (!val.trim()) {
      // Clear borders highlights
      setNodes(initialNodes);
      return;
    }

    setNodes(prev => prev.map(n => {
      const matches = n.data.label.toLowerCase().includes(val.toLowerCase()) || 
                      n.data.type.toLowerCase().includes(val.toLowerCase());
      return {
        ...n,
        style: {
          ...n.style,
          boxShadow: matches ? '0 0 15px #38bdf8' : 'none',
          borderColor: matches ? '#38bdf8' : n.style.borderColor,
          opacity: matches ? 1 : 0.35
        }
      };
    }));
  };

  // Filter by Type change
  const handleTypeFilter = (type) => {
    setFilterType(type);
    if (type === 'All') {
      setNodes(initialNodes);
      return;
    }

    setNodes(prev => prev.map(n => {
      const matches = n.data.type === type;
      return {
        ...n,
        style: {
          ...n.style,
          opacity: matches ? 1 : 0.25
        }
      };
    }));
  };

  // Node Click Handlers
  const onNodeClick = (event, node) => {
    setSelectedNode(node.data);
  };

  // Expand / Collapse toggler
  const toggleCollapse = (name) => {
    setCollapsedNodes(prev => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const nodeTypesList = ['All', 'Plant', 'Equipment', 'Sensor', 'Finding', 'Diagnosis', 'Root Cause', 'Recommendation'];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      height: 'calc(100vh - 170px)'
    }}>
      
      {/* Top Banner Control Panel */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        borderRadius: '16px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--card-shadow)',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0, fontFamily: 'var(--font-heading)' }}>
            Compliance Knowledge Graph
          </h2>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Interactive SCADA & Rule-Engine Semantic Map
          </span>
        </div>

        {/* Filter and Search controls */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          
          {/* Type filter */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', maxWidth: '380px', paddingBottom: '4px' }}>
            {nodeTypesList.map(type => (
              <button
                key={type}
                onClick={() => handleTypeFilter(type)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: filterType === type ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                  background: filterType === type ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
                  color: filterType === type ? 'var(--primary)' : 'var(--text-muted)',
                  whiteSpace: 'nowrap'
                }}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-main)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '8px 12px',
            gap: '8px',
            width: '240px'
          }}>
            <Search size={15} color="var(--text-dim)" />
            <input
              type="text"
              placeholder="Search graph nodes..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-main)',
                fontSize: '12.5px',
                width: '100%'
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Graph View Area */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: selectedNode ? '1fr 300px' : '1fr',
        gap: '20px',
        height: '100%',
        minHeight: 0
      }}>
        
        {/* React Flow Board */}
        <div style={{
          height: '100%',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          boxShadow: 'var(--card-shadow)',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            fitView
            minZoom={0.2}
            maxZoom={1.5}
          >
            <Controls style={{ background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }} />
            <MiniMap 
              nodeColor={n => TYPE_COLORS[n.data.type]?.border || '#cbd5e1'}
              maskColor="rgba(0,0,0,0.15)"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
            />
            <Background color="var(--text-dim)" gap={16} size={1} />
          </ReactFlow>
        </div>

        {/* Selected Node Details Inspector Panel */}
        {selectedNode && (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            boxShadow: 'var(--card-shadow)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            animation: 'fadeIn 0.2s ease-out',
            overflowY: 'auto'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{
                  fontSize: '9px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  width: 'fit-content',
                  background: TYPE_COLORS[selectedNode.type]?.bg,
                  color: TYPE_COLORS[selectedNode.type]?.text,
                  border: `1px solid ${TYPE_COLORS[selectedNode.type]?.border}`
                }}>
                  {selectedNode.type}
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0 0 0', fontFamily: 'var(--font-heading)' }}>
                  {selectedNode.label}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Explainable AI Narrative Section */}
            {selectedNode.properties && selectedNode.properties.explanation && (
              <div style={{
                background: 'rgba(6, 182, 212, 0.08)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                borderRadius: '12px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)' }}>
                  <Sparkles size={14} />
                  <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                    Explainable AI Narrative
                  </span>
                </div>
                <p style={{ fontSize: '12px', lineHeight: '1.45', color: 'var(--text-main)', margin: 0, fontWeight: 500 }}>
                  {selectedNode.properties.explanation}
                </p>
              </div>
            )}

            {/* Dynamic Equipment Diagnosis from XAI */}
            {selectedNode.type === 'Equipment' && isLoadingDiagnosis && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dim)', fontSize: '12.5px', padding: '10px' }}>
                <RefreshCw size={14} style={{ animation: 'spin 1.5s linear infinite' }} />
                <span>Generating diagnostic explanation...</span>
              </div>
            )}

            {selectedNode.type === 'Equipment' && nodeDiagnosis && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {nodeDiagnosis.explanation && (
                  <div style={{
                    background: 'rgba(6, 182, 212, 0.08)',
                    border: '1px solid rgba(6, 182, 212, 0.3)',
                    borderRadius: '12px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)' }}>
                      <Sparkles size={14} />
                      <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                        Explainable AI Narrative
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', lineHeight: '1.45', color: 'var(--text-main)', margin: 0, fontWeight: 500 }}>
                      {nodeDiagnosis.explanation}
                    </p>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--bg-main)', padding: '10px 14px', borderRadius: '10px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontWeight: 600 }}>Health Status</span>
                  <span style={{ 
                    fontSize: '12px', 
                    fontWeight: 800, 
                    color: nodeDiagnosis.status === 'Critical' ? '#ef4444' : nodeDiagnosis.status === 'Warning' ? '#f97316' : '#22c55e' 
                  }}>
                    {nodeDiagnosis.status} ({nodeDiagnosis.health_score ? `${nodeDiagnosis.health_score}%` : 'N/A'})
                  </span>
                </div>

                {nodeDiagnosis.recommendations && nodeDiagnosis.recommendations.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h4 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.8px', margin: 0 }}>
                      Action Recommendations
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {nodeDiagnosis.recommendations.map((rec, i) => (
                        <li key={i} style={{ fontSize: '12px', color: 'var(--text-main)', lineHeight: '1.4' }}>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Properties List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
              <h4 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.8px', margin: 0 }}>
                Properties & Telemetry
              </h4>

              {Object.keys(selectedNode.properties).length === 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dim)', fontSize: '12.5px' }}>
                  <Info size={14} />
                  <span>No static attributes mapped.</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {Object.entries(selectedNode.properties)
                    .filter(([key]) => key !== 'explanation')
                    .map(([key, val]) => (
                      <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '2px', background: 'var(--bg-main)', padding: '8px 12px', borderRadius: '8px' }}>
                        <span style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
                          {key.replace('_', ' ')}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', wordBreak: 'break-word' }}>
                          {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Traversal Toggle (Expand/Collapse) */}
            {['Equipment', 'Sensor', 'Finding', 'Diagnosis'].includes(selectedNode.type) && (
              <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                <button
                  onClick={() => toggleCollapse(selectedNode.label)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-main)',
                    color: 'var(--text-main)',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <GitCommit size={14} />
                  <span>{selectedNode.isCollapsed ? 'Expand Subtree' : 'Collapse Subtree'}</span>
                </button>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}
