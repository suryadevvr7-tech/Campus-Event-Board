import { Link, Route, Routes } from 'react-router';
import SiteHeader from './components/SiteHeader.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import DiscoverPage from './pages/DiscoverPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import EventDetailPage from './pages/EventDetailPage.jsx';
import EventFormPage from './pages/EventFormPage.jsx';
import EventCollectionPage from './pages/EventCollectionPage.jsx';
function NotFound() { return <main className="page-wrap not-found"><p className="eyebrow">WRONG TURN?</p><h1>This page took<br /><span>a day off.</span></h1><Link className="button button-dark" to="/">Back to campus <span aria-hidden="true">→</span></Link></main>; }
export default function App() {
  return <div className="app-shell"><SiteHeader /><Routes><Route path="/" element={<DiscoverPage />} /><Route path="/login" element={<AuthPage mode="login" />} /><Route path="/register" element={<AuthPage mode="register" />} /><Route path="/events/:id" element={<EventDetailPage />} /><Route path="/events/new" element={<ProtectedRoute role="organizer"><EventFormPage /></ProtectedRoute>} /><Route path="/events/:id/edit" element={<ProtectedRoute role="organizer"><EventFormPage /></ProtectedRoute>} /><Route path="/saved" element={<ProtectedRoute><EventCollectionPage type="saved" /></ProtectedRoute>} /><Route path="/organizer/events" element={<ProtectedRoute role="organizer"><EventCollectionPage type="organizer" /></ProtectedRoute>} /><Route path="*" element={<NotFound />} /></Routes><footer className="site-footer"><Link className="brand" to="/"><span className="brand-symbol">C<span>+</span></span><span className="brand-name">campus<span>board</span></span></Link><span>Find your people. Find your thing.</span><span>MADE FOR THE MOMENTS BETWEEN CLASSES <b>✳</b></span></footer></div>;
}


