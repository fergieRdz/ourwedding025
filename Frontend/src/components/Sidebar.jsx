import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const links = [
  { to: '/dashboard',  label: 'Dashboard' },
  { to: '/guests',     label: 'Guests' },
  { to: '/budget',     label: 'Budget' },
  { to: '/tables',     label: 'Tables' },
  { to: '/calendar',   label: 'Calendar' },
  { to: '/todos',      label: 'Things To Do' },
  { to: '/suppliers',  label: 'Suppliers' },
  { to: '/moodboard',  label: 'Moodboard' },
  { to: '/shopping',   label: 'Shopping' },
  { to: '/honeymoon',  label: 'Honeymoon' },
];

export default function Navbar() {
  const { logout } = useAuth();
  return (
    <nav className="topnav">
      <span className="topnav-brand">Our Wedding</span>
      <ul className="topnav-links">
        {links.map(l => (
          <li key={l.to}>
            <NavLink to={l.to} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              {l.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <button className="topnav-logout" onClick={logout}>Logout</button>
    </nav>
  );
}
