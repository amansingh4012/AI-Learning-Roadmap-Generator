import { useState } from 'react';
import './TopicInput.css';

const EXAMPLE_TOPICS = [
  'Machine Learning',
  'Web Development',
  'Data Science',
  'Cloud Computing',
  'Cybersecurity',
];

const LEVELS = [
  { value: 'all', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

function TopicInput({ onGenerate, loading, error }) {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('all');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (topic.trim()) {
      onGenerate(topic.trim(), level);
    }
  };

  const handleExampleClick = (exampleTopic) => {
    setTopic(exampleTopic);
  };

  return (
    <div className="topic-input-container">
      <div className="input-card">
        <h2>What do you want to learn today?</h2>
        <p className="subtitle">Enter any topic and let AI create a personalized learning roadmap for you</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="topic">Topic</label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Machine Learning, Web Development, Photography..."
              disabled={loading}
              className="topic-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="level">Learning Level</label>
            <select
              id="level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              disabled={loading}
              className="level-select"
            >
              {LEVELS.map((lvl) => (
                <option key={lvl.value} value={lvl.value}>
                  {lvl.label}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="error-message">
              <span>⚠️ {error}</span>
            </div>
          )}

          <button 
            type="submit" 
            className="generate-button"
            disabled={loading || !topic.trim()}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Generating Learning Map...
              </>
            ) : (
              <>
                🗺️ Generate Learning Map
              </>
            )}
          </button>
        </form>

        <div className="examples-section">
          <p className="examples-label">Or try these popular topics:</p>
          <div className="examples-grid">
            {EXAMPLE_TOPICS.map((example) => (
              <button
                key={example}
                type="button"
                className="example-chip"
                onClick={() => handleExampleClick(example)}
                disabled={loading}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopicInput;
