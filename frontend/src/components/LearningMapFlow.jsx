import { useCallback, useState, useMemo, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import CustomNode from './CustomNode';
import NodeDetailsPanel from './NodeDetailsPanel';
import './LearningMapFlow.css';

// Register custom node types
const nodeTypes = {
  custom: CustomNode,
};

/**
 * Transform AI-generated learning map data into React Flow nodes and edges
 * Uses a radial/circular layout with dynamic spacing to prevent overlaps
 */
function transformDataToFlow(data) {
  console.log('🔄 Transforming data to flow:', data);
  console.log('📊 Input nodes count:', data?.nodes?.length);
  
  const nodes = [];
  const edges = [];
  
  if (!data || !data.nodes) {
    console.error('❌ Invalid data structure:', data);
    return { nodes: [], edges: [] };
  }
  
  const mainNodes = data.nodes || [];
  console.log('🎯 Processing', mainNodes.length, 'main nodes');
  
  // Node dimensions for collision detection
  const NODE_WIDTH = 280;
  const NODE_HEIGHT = 120;
  const MIN_NODE_DISTANCE = 50; // Minimum space between nodes
  
  // Calculate optimal radius based on number of nodes
  // We need enough circumference to fit all nodes without overlap
  const nodesCount = mainNodes.length;
  const totalSubtopics = mainNodes.reduce((sum, node) => sum + (node.subtopics || []).length, 0);
  const avgSubtopicsPerNode = totalSubtopics / Math.max(nodesCount, 1);
  
  // Calculate minimum radius needed to prevent main node overlaps
  // Circumference = 2πr, we need space for all nodes plus gaps
  const requiredCircumference = nodesCount * (NODE_WIDTH + MIN_NODE_DISTANCE);
  const minMainRadius = requiredCircumference / (2 * Math.PI);
  
  // Add extra radius for subtopics and general spacing
  const mainRadius = Math.max(minMainRadius, 450 + (nodesCount * 20));
  
  // Subtopic radius - dynamically adjusted based on number of subtopics
  const baseSubRadius = 250;
  const subRadiusIncrement = avgSubtopicsPerNode > 3 ? 80 : 40;
  const subRadius = baseSubRadius + subRadiusIncrement;
  
  // Create central topic node
  const centerX = mainRadius + 400;
  const centerY = mainRadius + 400;
  
  nodes.push({
    id: 'root',
    type: 'custom',
    position: { x: centerX - 140, y: centerY - 50 },
    data: {
      label: data.topic,
      description: data.description,
      level: 'root',
      isRoot: true,
      resources: [],
    },
  });

  // Calculate positions for main nodes in a circular layout
  const angleStep = (2 * Math.PI) / nodesCount;

  mainNodes.forEach((node, index) => {
    const angle = index * angleStep - Math.PI / 2; // Start from top
    const x = centerX + mainRadius * Math.cos(angle);
    const y = centerY + mainRadius * Math.sin(angle);

    // Add main node
    nodes.push({
      id: node.id,
      type: 'custom',
      position: { x: x - NODE_WIDTH / 2, y: y - NODE_HEIGHT / 2 },
      data: {
        label: node.label,
        description: node.description,
        level: node.level,
        resources: node.resources || [],
        hasSubtopics: (node.subtopics || []).length > 0,
        subtopicCount: (node.subtopics || []).length,
      },
    });

    // Add edge from root to main node
    edges.push({
      id: `edge-root-${node.id}`,
      source: 'root',
      target: node.id,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#667eea', strokeWidth: 2 },
    });

    // Add subtopic nodes if they exist
    if (node.subtopics && node.subtopics.length > 0) {
      const subtopicCount = node.subtopics.length;
      
      // Calculate the arc span for subtopics
      // More subtopics = wider arc, but with minimum spacing between them
      const minSubtopicAngle = 0.3; // Minimum angle between subtopics (in radians)
      const maxArcSpan = Math.PI / 1.2; // Maximum arc span
      
      let subAngleSpan;
      if (subtopicCount === 1) {
        subAngleSpan = 0; // Single subtopic goes straight out
      } else {
        // Calculate span based on number of subtopics
        const calculatedSpan = (subtopicCount - 1) * minSubtopicAngle;
        subAngleSpan = Math.min(calculatedSpan, maxArcSpan);
      }
      
      const subAngleStart = angle - subAngleSpan / 2;
      const subAngleStep = subtopicCount > 1 ? subAngleSpan / (subtopicCount - 1) : 0;

      node.subtopics.forEach((subtopic, subIndex) => {
        // Calculate angle for this subtopic
        const subAngle = subtopicCount === 1 
          ? angle 
          : subAngleStart + (subIndex * subAngleStep);
        
        const subX = x + subRadius * Math.cos(subAngle);
        const subY = y + subRadius * Math.sin(subAngle);

        nodes.push({
          id: subtopic.id,
          type: 'custom',
          position: { x: subX - 120, y: subY - 45 },
          data: {
            label: subtopic.label,
            description: subtopic.description,
            level: subtopic.level,
            resources: subtopic.resources || [],
            isSubtopic: true,
          },
        });

        edges.push({
          id: `edge-${node.id}-${subtopic.id}`,
          source: node.id,
          target: subtopic.id,
          type: 'smoothstep',
          style: { stroke: '#999', strokeWidth: 1.5 },
        });
      });
    }
  });

  console.log('✅ Transform complete! Created', nodes.length, 'nodes and', edges.length, 'edges');
  console.log('📐 Layout info: mainRadius =', mainRadius, 'subRadius =', subRadius);
  
  return { nodes, edges };
}

function LearningMapFlow({ data, onNavigateHome }) {
  console.log('🎨 LearningMapFlow rendering with data:', data);
  
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => transformDataToFlow(data),
    [data]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [levelFilter, setLevelFilter] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  const flowRef = useRef(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node.data);
  }, []);

  const handleClosePanel = () => {
    setSelectedNode(null);
  };

  const handleExportJSON = () => {
    const exportData = {
      topic: data.topic,
      description: data.description,
      nodes: data.nodes,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.topic.replace(/\s+/g, '-').toLowerCase()}-learning-map.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      // Create a new jsPDF instance
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Add title
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text(data.topic, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;

      // Add description
      if (data.description) {
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        const descLines = pdf.splitTextToSize(data.description, pageWidth - 40);
        pdf.text(descLines, 20, yPosition);
        yPosition += descLines.length * 5 + 10;
      }

      // Add a line separator
      pdf.setLineWidth(0.5);
      pdf.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 10;

      // Capture the flow diagram
      const flowElement = flowRef.current;
      if (flowElement) {
        const canvas = await html2canvas(flowElement, {
          backgroundColor: '#ffffff',
          scale: 2,
          logging: false,
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - 40;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Add flow diagram image
        if (yPosition + imgHeight > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.addImage(imgData, 'PNG', 20, yPosition, imgWidth, Math.min(imgHeight, pageHeight - yPosition - 20));
        yPosition += Math.min(imgHeight, pageHeight - yPosition - 20) + 10;
      }

      // Add detailed breakdown
      pdf.addPage();
      yPosition = 20;
      
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Learning Path Details', 20, yPosition);
      yPosition += 10;

      // Group nodes by level
      const nodesByLevel = {
        beginner: data.nodes.filter(n => n.level === 'beginner'),
        intermediate: data.nodes.filter(n => n.level === 'intermediate'),
        advanced: data.nodes.filter(n => n.level === 'advanced'),
      };

      const levelColors = {
        beginner: [76, 222, 128],
        intermediate: [251, 191, 36],
        advanced: [248, 113, 113],
      };

      Object.entries(nodesByLevel).forEach(([level, levelNodes]) => {
        if (levelNodes.length === 0) return;

        // Check if we need a new page
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = 20;
        }

        // Level header
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...levelColors[level]);
        pdf.text(level.toUpperCase(), 20, yPosition);
        pdf.setTextColor(0, 0, 0);
        yPosition += 8;

        levelNodes.forEach((node) => {
          // Check if we need a new page
          if (yPosition > pageHeight - 60) {
            pdf.addPage();
            yPosition = 20;
          }

          // Node title
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`• ${node.label}`, 25, yPosition);
          yPosition += 6;

          // Node description
          if (node.description) {
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            const descLines = pdf.splitTextToSize(node.description, pageWidth - 55);
            pdf.text(descLines, 30, yPosition);
            yPosition += descLines.length * 5 + 3;
          }

          // Resources
          if (node.resources && node.resources.length > 0) {
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'italic');
            pdf.text('Resources:', 30, yPosition);
            yPosition += 4;
            
            node.resources.forEach((resource) => {
              if (yPosition > pageHeight - 20) {
                pdf.addPage();
                yPosition = 20;
              }
              pdf.setFont('helvetica', 'normal');
              pdf.text(`  - ${resource.title} (${resource.type})`, 32, yPosition);
              yPosition += 4;
              
              if (resource.url && resource.url !== '#') {
                pdf.setTextColor(0, 0, 255);
                pdf.textWithLink(resource.url, 37, yPosition, { url: resource.url });
                pdf.setTextColor(0, 0, 0);
                yPosition += 4;
              }
            });
            yPosition += 2;
          }

          // Subtopics
          if (node.subtopics && node.subtopics.length > 0) {
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Subtopics:', 30, yPosition);
            yPosition += 5;

            node.subtopics.forEach((subtopic) => {
              if (yPosition > pageHeight - 30) {
                pdf.addPage();
                yPosition = 20;
              }

              pdf.setFontSize(10);
              pdf.setFont('helvetica', 'bold');
              pdf.text(`  ∘ ${subtopic.label}`, 32, yPosition);
              yPosition += 5;

              if (subtopic.description) {
                pdf.setFontSize(9);
                pdf.setFont('helvetica', 'normal');
                const subDescLines = pdf.splitTextToSize(subtopic.description, pageWidth - 65);
                pdf.text(subDescLines, 37, yPosition);
                yPosition += subDescLines.length * 4 + 2;
              }

              if (subtopic.resources && subtopic.resources.length > 0) {
                pdf.setFontSize(8);
                subtopic.resources.forEach((resource) => {
                  if (yPosition > pageHeight - 15) {
                    pdf.addPage();
                    yPosition = 20;
                  }
                  pdf.text(`    - ${resource.title} (${resource.type})`, 37, yPosition);
                  yPosition += 3;
                });
                yPosition += 2;
              }
            });
          }

          yPosition += 5;
        });

        yPosition += 3;
      });

      // Add footer with timestamp
      const totalPages = pdf.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(128, 128, 128);
        pdf.text(
          `Generated on ${new Date().toLocaleDateString()} | Page ${i} of ${totalPages}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }

      // Save the PDF
      pdf.save(`${data.topic.replace(/\s+/g, '-').toLowerCase()}-learning-map.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Filter nodes based on level
  const filteredNodes = useMemo(() => {
    if (levelFilter === 'all') return nodes;
    return nodes.filter(
      (node) => node.data.level === levelFilter || node.data.level === 'root'
    );
  }, [nodes, levelFilter]);

  const filteredEdges = useMemo(() => {
    if (levelFilter === 'all') return edges;
    const filteredNodeIds = new Set(filteredNodes.map((n) => n.id));
    return edges.filter(
      (edge) => filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
    );
  }, [edges, filteredNodes, levelFilter]);

  return (
    <div className="learning-map-flow">
      <div className="flow-controls">
        <div className="left-controls">
          {onNavigateHome && (
            <button className="home-button" onClick={onNavigateHome}>
              🏠 Explore New Topic
            </button>
          )}
          <div className="filter-controls">
            <label htmlFor="level-filter">Filter by Level:</label>
            <select
              id="level-filter"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
        <div className="export-buttons">
          <button className="export-button json-button" onClick={handleExportJSON}>
            📥 Export as JSON
          </button>
          <button 
            className="export-button pdf-button" 
            onClick={handleExportPDF}
            disabled={isExporting}
          >
            {isExporting ? '⏳ Generating PDF...' : '📄 Download as PDF'}
          </button>
        </div>
      </div>

      <div className="flow-wrapper" ref={flowRef} style={{ width: '100%', height: '100%' }}>
        <ReactFlow
          nodes={filteredNodes}
          edges={filteredEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{
            padding: 0.1,
            includeHiddenNodes: false,
            minZoom: 0.1,
            maxZoom: 1.0,
          }}
          minZoom={0.05}
          maxZoom={1.5}
          defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
          style={{ width: '100%', height: '100%' }}
        >
          <Background color="#aaa" gap={16} />
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              if (node.data.isRoot) return '#667eea';
              switch (node.data.level) {
                case 'beginner':
                  return '#4ade80';
                case 'intermediate':
                  return '#fbbf24';
                case 'advanced':
                  return '#f87171';
                default:
                  return '#999';
              }
            }}
            style={{
              backgroundColor: '#f8f9fa',
            }}
            maskColor="rgba(0, 0, 0, 0.1)"
          />
        </ReactFlow>
      </div>

      {selectedNode && (
        <NodeDetailsPanel node={selectedNode} onClose={handleClosePanel} />
      )}
    </div>
  );
}

export default LearningMapFlow;
