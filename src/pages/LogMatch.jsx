import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function LogMatch() {
  const { state, dispatch } = useApp();
  const [winnerId, setWinnerId] = useState('');
  const [loserId, setLoserId] = useState('');
  const [score, setScore] = useState('');
  const [success, setSuccess] = useState(false);

  const sorted = [...state.players].sort((a, b) => a.name.localeCompare(b.name));

  function handleSubmit(e) {
    e.preventDefault();
    if (!winnerId || !loserId) return;
    if (winnerId === loserId) {
      alert('Winner and loser must be different players.');
      return;
    }

    dispatch({
      type: 'LOG_MATCH',
      payload: { winnerId, loserId, score: score.trim() },
    });

    setWinnerId('');
    setLoserId('');
    setScore('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  }

  if (state.players.length < 2) {
    return (
      <div className="page">
        <h2>Log Match</h2>
        <p className="empty-state">You need at least 2 players to log a match.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>Log Match</h2>

      {success && <div className="success-msg">Match recorded! Rankings updated.</div>}

      <form className="match-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="winner">Winner</label>
          <select
            id="winner"
            value={winnerId}
            onChange={(e) => setWinnerId(e.target.value)}
          >
            <option value="">Select winner...</option>
            {sorted.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.rating})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="loser">Loser</label>
          <select
            id="loser"
            value={loserId}
            onChange={(e) => setLoserId(e.target.value)}
          >
            <option value="">Select loser...</option>
            {sorted.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.rating})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="score">Score (optional)</label>
          <input
            id="score"
            type="text"
            placeholder="e.g. 6-4, 7-5"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            maxLength={30}
          />
        </div>

        <button type="submit" className="btn-primary">
          Record Match
        </button>
      </form>
    </div>
  );
}
