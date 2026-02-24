import { createContext, useContext, useReducer, useEffect } from 'react';
import { calculateNewRatings, INITIAL_RATING } from '../utils/elo';
import { loadState, saveState } from '../utils/storage';

const AppContext = createContext();

const initialState = {
  players: [],
  matches: [],
};

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_PLAYER': {
      const newPlayer = {
        id: generateId(),
        name: action.payload.name,
        rating: INITIAL_RATING,
        rank: state.players.length + 1,
        wins: 0,
        losses: 0,
        createdAt: new Date().toISOString(),
      };
      return { ...state, players: [...state.players, newPlayer] };
    }

    case 'EDIT_PLAYER': {
      return {
        ...state,
        players: state.players.map((p) =>
          p.id === action.payload.id ? { ...p, name: action.payload.name } : p
        ),
      };
    }

    case 'DELETE_PLAYER': {
      const deleted = state.players.find((p) => p.id === action.payload.id);
      const remaining = state.players
        .filter((p) => p.id !== action.payload.id)
        .map((p) => (p.rank > deleted.rank ? { ...p, rank: p.rank - 1 } : p));
      return {
        ...state,
        players: remaining,
        matches: state.matches.filter(
          (m) =>
            m.winnerId !== action.payload.id &&
            m.loserId !== action.payload.id
        ),
      };
    }

    case 'LOG_MATCH': {
      const { winnerId, loserId, score } = action.payload;
      const winner = state.players.find((p) => p.id === winnerId);
      const loser = state.players.find((p) => p.id === loserId);

      if (!winner || !loser) return state;

      const { newRatingA, newRatingB } = calculateNewRatings(
        winner.rating,
        loser.rating,
        1
      );

      const match = {
        id: generateId(),
        winnerId,
        loserId,
        winnerName: winner.name,
        loserName: loser.name,
        score: score || '',
        winnerRatingBefore: winner.rating,
        loserRatingBefore: loser.rating,
        winnerRatingAfter: newRatingA,
        loserRatingAfter: newRatingB,
        date: new Date().toISOString(),
      };

      // Update ratings and win/loss counts
      let updatedPlayers = state.players.map((p) => {
        if (p.id === winnerId) {
          return { ...p, rating: newRatingA, wins: p.wins + 1 };
        }
        if (p.id === loserId) {
          return { ...p, rating: newRatingB, losses: p.losses + 1 };
        }
        return p;
      });

      // Ladder rule: if winner is ranked below loser, move winner
      // to the loser's position and shift everyone in between down
      const winnerRank = winner.rank;
      const loserRank = loser.rank;

      if (winnerRank > loserRank) {
        updatedPlayers = updatedPlayers.map((p) => {
          if (p.id === winnerId) {
            return { ...p, rank: loserRank };
          }
          if (p.rank >= loserRank && p.rank < winnerRank && p.id !== winnerId) {
            return { ...p, rank: p.rank + 1 };
          }
          return p;
        });
      }

      return {
        ...state,
        players: updatedPlayers,
        matches: [match, ...state.matches],
      };
    }

    case 'LOAD_STATE': {
      return { ...action.payload };
    }

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const saved = loadState();
    if (saved) {
      dispatch({ type: 'LOAD_STATE', payload: saved });
    }
  }, []);

  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
