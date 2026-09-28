/**
 * Reusable loading state component with animated skeleton.
 */
function LoadingState({ message = 'Loading...', size = 'default' }) {
  return (
    <div className={`loading-state loading-state-${size}`}>
      <div className="loading-spinner">
        <div className="spinner-ring"></div>
        <span className="spinner-icon">✈️</span>
      </div>
      <p className="loading-message">{message}</p>
    </div>
  );
}

export default LoadingState;
