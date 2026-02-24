import { useApp } from '../context/AppContext';

export default function Rankings() {
  const { state } = useApp();

  const ranked = [...state.players].sort((a, b) => a.rank - b.rank);

  return (
    <div className="page">
      <h2>Rankings</h2>
      {ranked.length === 0 ? (
        <p className="empty-state">No players yet. Add players to get started.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Player</th>
                <th>Rating</th>
                <th>W</th>
                <th>L</th>
                <th>Win %</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((player, i) => {
                const total = player.wins + player.losses;
                const winPct = total > 0 ? Math.round((player.wins / total) * 100) : 0;
                return (
                  <tr key={player.id}>
                    <td className="rank-cell">
                      {i === 0 && ranked.length > 1 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                    </td>
                    <td className="player-name-cell">{player.name}</td>
                    <td className="rating-cell">{player.rating}</td>
                    <td>{player.wins}</td>
                    <td>{player.losses}</td>
                    <td>{winPct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
