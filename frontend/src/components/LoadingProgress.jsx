import { useState, useEffect } from 'react';
import './LoadingProgress.css';

const LOADING_STAGES = [
  { message: '🤖 Connecting to AI...', duration: 800 },
  { message: '🧠 Analyzing your topic...', duration: 1500 },
  { message: '📚 Researching learning resources...', duration: 2000 },
  { message: '🗺️ Building your learning roadmap...', duration: 2000 },
  { message: '✨ Finalizing your personalized map...', duration: 1500 },
];

function LoadingProgress({ topic }) {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer;
    let progressTimer;
    let currentTime = 0;
    const totalDuration = LOADING_STAGES.reduce((sum, stage) => sum + stage.duration, 0);

    // Stage progression
    const progressStage = (stageIndex) => {
      if (stageIndex < LOADING_STAGES.length) {
        setCurrentStage(stageIndex);
        timer = setTimeout(() => {
          progressStage(stageIndex + 1);
        }, LOADING_STAGES[stageIndex].duration);
      }
    };

    // Smooth progress bar
    progressTimer = setInterval(() => {
      currentTime += 100;
      const newProgress = Math.min((currentTime / totalDuration) * 100, 95);
      setProgress(newProgress);
    }, 100);

    progressStage(0);

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, []);

  return (
    <div className="loading-progress-overlay">
      <div className="loading-progress-card">
        <div className="loading-header">
          <div className="loading-pulse-container">
            <div className="loading-pulse"></div>
            <div className="loading-pulse-ring"></div>
          </div>
          <h2 className="loading-title">Creating Your Learning Journey</h2>
          <p className="loading-topic">Topic: <strong>{topic}</strong></p>
        </div>

        <div className="loading-stages">
          {LOADING_STAGES.map((stage, index) => (
            <div 
              key={index} 
              className={`loading-stage ${index === currentStage ? 'active' : index < currentStage ? 'completed' : ''}`}
            >
              <div className="stage-indicator">
                {index < currentStage ? (
                  <span className="stage-check">✓</span>
                ) : index === currentStage ? (
                  <span className="stage-spinner"></span>
                ) : (
                  <span className="stage-dot"></span>
                )}
              </div>
              <div className="stage-message">{stage.message}</div>
            </div>
          ))}
        </div>

        <div className="loading-progress-bar-container">
          <div className="loading-progress-bar">
            <div 
              className="loading-progress-fill" 
              style={{ width: `${progress}%` }}
            >
              <span className="progress-shimmer"></span>
            </div>
          </div>
          <div className="loading-progress-text">{Math.round(progress)}%</div>
        </div>

        <div className="loading-tips">
          <p className="loading-tip">💡 <em>Tip: Your learning map will be interactive and customizable!</em></p>
        </div>
      </div>
    </div>
  );
}

export default LoadingProgress;
