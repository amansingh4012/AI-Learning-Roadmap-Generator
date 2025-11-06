import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import './CustomNode.css';

const CustomNode = memo(({ data }) => {
  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner':
        return '#4ade80';
      case 'intermediate':
        return '#fbbf24';
      case 'advanced':
        return '#f87171';
      case 'root':
        return '#667eea';
      default:
        return '#999';
    }
  };

  const getLevelBadge = (level) => {
    if (level === 'root') return null;
    return (
      <span className="level-badge" style={{ background: getLevelColor(level) }}>
        {level}
      </span>
    );
  };

  return (
    <div
      className={`custom-node ${data.isRoot ? 'root-node' : ''} ${
        data.isSubtopic ? 'subtopic-node' : ''
      }`}
      style={{
        borderColor: getLevelColor(data.level),
      }}
    >
      <Handle type="target" position={Position.Top} />
      
      <div className="node-content">
        <div className="node-header">
          <h3 className="node-label">{data.label}</h3>
          {getLevelBadge(data.level)}
        </div>
        
        {data.hasSubtopics && (
          <div className="subtopic-indicator">
            📚 {data.subtopicCount} subtopics
          </div>
        )}
        
        {data.resources && data.resources.length > 0 && (
          <div className="resource-count">
            🔗 {data.resources.length} resources
          </div>
        )}
      </div>
      
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';

export default CustomNode;
