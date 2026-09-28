const ALL_INTERESTS = [
  { id: 'nature', label: 'Nature', icon: '🌿' },
  { id: 'adventure', label: 'Adventure', icon: '🏔️' },
  { id: 'beaches', label: 'Beaches', icon: '🏖️' },
  { id: 'history', label: 'History', icon: '🏛️' },
  { id: 'culture', label: 'Culture', icon: '🎭' },
  { id: 'food', label: 'Food', icon: '🍽️' },
  { id: 'photography', label: 'Photography', icon: '📸' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'nightlife', label: 'Nightlife', icon: '🌃' },
  { id: 'wildlife', label: 'Wildlife', icon: '🦁' },
  { id: 'spiritual', label: 'Spiritual', icon: '🕉️' },
  { id: 'relaxation', label: 'Relaxation', icon: '🧘' },
];

function InterestsSelector({ selected = [], onToggle }) {
  return (
    <div className="interests-selector">
      <label className="interests-label">Interests</label>
      <div className="interests-grid">
        {ALL_INTERESTS.map((interest) => {
          const isActive = selected.includes(interest.id);
          return (
            <button
              key={interest.id}
              type="button"
              className={`interest-chip ${isActive ? 'active' : ''}`}
              onClick={() => onToggle(interest.id)}
            >
              <span className="interest-chip-icon">{interest.icon}</span>
              <span className="interest-chip-label">{interest.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default InterestsSelector;
