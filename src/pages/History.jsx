import { useApp } from '../context/AppContext';

export default function History() {
  const { state } = useApp();

  function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  function ratingChange(before, after) {
    const diff = after - before;
    if (diff > 0) return `+${diff}`;
    return `${diff}`;
  }

  return (
    <div className="page">
      <h2>Match History</h2>
      {state.matches.length === 0 ? (
        <p className="empty-state">No matches played yet.</p>
      ) : (
        <ul className="match-list">
          {state.matches.map((match) => (
            <li key={match.id} className="match-card">
              <div className="match-date">{formatDate(match.date)}</div>
              <div className="match-result">
                <div className="match-player winner">
                  <span className="match-label">W</span>
                  <span className="match-name">{match.winnerName}</span>
                  <span className="rating-change positive">
                    {match.winnerRatingBefore} → {match.winnerRatingAfter} ({ratingChange(match.winnerRatingBefore, match.winnerRatingAfter)})
                  </span>
                </div>
                <div className="match-player loser">
                  <span className="match-label">L</span>
                  <span className="match-name">{match.loserName}</span>
                  <span className="rating-change negative">
                    {match.loserRatingBefore} → {match.loserRatingAfter} ({ratingChange(match.loserRatingBefore, match.loserRatingAfter)})
                  </span>
                </div>
              </div>
              {match.score && <div className="match-score">Score: {match.score}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
