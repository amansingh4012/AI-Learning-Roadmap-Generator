import { useState } from 'react';
import LearningMapFlow from './components/LearningMapFlow';
import TopicInput from './components/TopicInput';
import LoadingProgress from './components/LoadingProgress';
import SuccessNotification from './components/SuccessNotification';
import './App.css';

function App() {
  const [learningMapData, setLearningMapData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentTopic, setCurrentTopic] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleGenerateMap = async (topic, level) => {
    setLoading(true);
    setError(null);
    setLearningMapData(null);
    setCurrentTopic(topic);
    setShowSuccess(false);

    try {
      console.log('🚀 Sending request to backend...', { topic, level });
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, level }),
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response ok:', response.ok);
      
      // Check if response has content
      const contentType = response.headers.get('content-type');
      console.log('📥 Content-Type:', contentType);
      
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response. Please check if the backend is running correctly.');
      }
      
      let result;
      try {
        result = await response.json();
        console.log('📦 Response data:', result);
      } catch (parseError) {
        console.error('❌ Failed to parse JSON:', parseError);
        throw new Error('Failed to parse server response. The server may have encountered an error.');
      }

      if (!response.ok) {
        throw new Error(result.message || result.error || 'Failed to generate learning map');
      }

      if (!result.data) {
        throw new Error('Server returned invalid data structure');
      }

      console.log('✅ Setting learning map data:', result.data);
      console.log('📊 Nodes in data:', result.data?.nodes?.length);
      
      setLearningMapData(result.data);
      setShowSuccess(true);
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      console.error('❌ Error generating map:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setLearningMapData(null);
    setError(null);
    setShowSuccess(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎓 AI Learning Map Generator</h1>
        <p>Explore any topic with AI-powered interactive learning paths</p>
      </header>

      <main className="app-main">
        {!learningMapData ? (
          <TopicInput 
            onGenerate={handleGenerateMap} 
            loading={loading}
            error={error}
          />
        ) : (
          <div className="map-container">
            <LearningMapFlow data={learningMapData} onNavigateHome={handleReset} />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Built with ❤️ using React, React Flow, and Google Gemini AI</p>
      </footer>

      {/* Loading Progress Overlay */}
      {loading && <LoadingProgress topic={currentTopic} />}

      {/* Success Notification */}
      {showSuccess && (
        <SuccessNotification 
          message={`Your learning map for "${currentTopic}" is ready!`}
          onComplete={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
}

export default App;
