import { NavLink } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="nav-brand">Tennis Ranks</div>
      <div className="nav-links">
        <NavLink to="/" end>Rankings</NavLink>
        <NavLink to="/players">Players</NavLink>
        <NavLink to="/log-match">Log Match</NavLink>
        <NavLink to="/history">History</NavLink>
      </div>
    </nav>
  );
}
