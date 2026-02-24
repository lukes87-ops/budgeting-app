import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Players() {
  const { state, dispatch } = useApp();
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  function handleAdd(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    if (state.players.some((p) => p.name.toLowerCase() === trimmed.toLowerCase())) {
      alert('A player with this name already exists.');
      return;
    }
    dispatch({ type: 'ADD_PLAYER', payload: { name: trimmed } });
    setName('');
  }

  function handleEdit(player) {
    setEditingId(player.id);
    setEditName(player.name);
  }

  function handleSaveEdit(e) {
    e.preventDefault();
    const trimmed = editName.trim();
    if (!trimmed) return;
    dispatch({ type: 'EDIT_PLAYER', payload: { id: editingId, name: trimmed } });
    setEditingId(null);
    setEditName('');
  }

  function handleDelete(id) {
    if (confirm('Delete this player and all their match history?')) {
      dispatch({ type: 'DELETE_PLAYER', payload: { id } });
    }
  }

  const sorted = [...state.players].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="page">
      <h2>Players</h2>

      <form className="add-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Player name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={30}
        />
        <button type="submit">Add Player</button>
      </form>

      {sorted.length === 0 ? (
        <p className="empty-state">No players added yet.</p>
      ) : (
        <ul className="player-list">
          {sorted.map((player) => (
            <li key={player.id} className="player-card">
              {editingId === player.id ? (
                <form className="edit-form" onSubmit={handleSaveEdit}>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    maxLength={30}
                    autoFocus
                  />
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setEditingId(null)}>Cancel</button>
                </form>
              ) : (
                <>
                  <div className="player-info">
                    <span className="player-name">{player.name}</span>
                    <span className="player-stats">
                      Rating: {player.rating} | {player.wins}W - {player.losses}L
                    </span>
                  </div>
                  <div className="player-actions">
                    <button className="btn-sm" onClick={() => handleEdit(player)}>Edit</button>
                    <button className="btn-sm btn-danger" onClick={() => handleDelete(player.id)}>Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
