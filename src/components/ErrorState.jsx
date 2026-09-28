/**
 * Reusable error state component with retry button.
 */
function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="error-state">
      <span className="error-state-icon">⚠️</span>
      <h3 className="error-state-title">Oops!</h3>
      <p className="error-state-message">{message}</p>
      {onRetry && (
        <button className="btn btn-primary" onClick={onRetry}>
          🔄 Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorState;
