import './NodeDetailsPanel.css';

function NodeDetailsPanel({ node, onClose }) {
  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner':
        return '#4ade80';
      case 'intermediate':
        return '#fbbf24';
      case 'advanced':
        return '#f87171';
      default:
        return '#667eea';
    }
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case 'video':
        return '🎥';
      case 'article':
        return '📄';
      case 'course':
        return '🎓';
      case 'book':
        return '📚';
      default:
        return '🔗';
    }
  };

  return (
    <div className="node-details-panel">
      <div className="panel-header">
        <h2>{node.label}</h2>
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="panel-content">
        {!node.isRoot && (
          <div className="level-section">
            <span
              className="level-badge-large"
              style={{ background: getLevelColor(node.level) }}
            >
              {node.level} Level
            </span>
          </div>
        )}

        <div className="description-section">
          <h3>📖 Description</h3>
          <p>{node.description || 'No description available.'}</p>
        </div>

        {node.resources && node.resources.length > 0 && (
          <div className="resources-section">
            <h3>🎯 Learning Resources</h3>
            <ul className="resource-list">
              {node.resources.map((resource, index) => (
                <li key={index} className="resource-item">
                  <span className="resource-icon">
                    {getResourceIcon(resource.type)}
                  </span>
                  <div className="resource-info">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="resource-title"
                    >
                      {resource.title}
                    </a>
                    <span className="resource-type">{resource.type}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {node.hasSubtopics && (
          <div className="subtopics-info">
            <p>
              💡 This topic has {node.subtopicCount} subtopics. Click on them in
              the map to explore!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default NodeDetailsPanel;
