import { Link, NavLink, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
export default function SiteHeader() {
  const { user, signOut } = useAuth(); const navigate = useNavigate();
  async function handleSignOut() { try { await signOut(); } finally { navigate('/'); } }
  return <header className="site-header"><div className="header-inner"><Link className="brand" to="/" aria-label="Campus Event Board home"><span className="brand-symbol">C<span>+</span></span><span className="brand-name">campus<span>board</span></span></Link><nav className="main-nav" aria-label="Main navigation"><NavLink to="/" end>Discover</NavLink>{user && <NavLink to="/saved">Saved</NavLink>}{user?.role === 'organizer' && <NavLink to="/organizer/events">My events</NavLink>}</nav><div className="header-actions">{user?.role === 'organizer' && <Link className="button button-primary button-small create-link" to="/events/new">＋ Create event</Link>}{user ? <><span className="user-chip"><span className="avatar">{user.name.slice(0, 1).toUpperCase()}</span><span className="user-name">{user.name.split(' ')[0]}</span></span><button className="text-button signout" onClick={handleSignOut}>Sign out</button></> : <><Link className="text-button sign-in-link" to="/login">Sign in</Link><Link className="button button-primary button-small" to="/register">Join</Link></>}</div></div></header>;
}

