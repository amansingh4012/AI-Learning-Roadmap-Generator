import { useEffect, useState } from 'react';
import './SuccessNotification.css';

function SuccessNotification({ message, onComplete }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300); // Wait for fade out animation
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className={`success-notification ${isVisible ? 'show' : 'hide'}`}>
      <div className="success-icon">
        <svg viewBox="0 0 52 52" className="checkmark">
          <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
          <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
        </svg>
      </div>
      <div className="success-content">
        <h3>Success!</h3>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default SuccessNotification;
