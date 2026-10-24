import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { api } from '../services/api.js';
import EventCard from '../components/EventCard.jsx';
import { EmptyState, ErrorState, LoadingState } from '../components/States.jsx';
export default function EventCollectionPage({ type }) {
  const organizer = type === 'organizer'; const [result, setResult] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [page, setPage] = useState(1);
  function load() { setLoading(true); setError(''); api.events({ page, limit: 9 }, organizer ? '/events/mine' : '/events/saved').then(setResult).catch((reason) => setError(reason.message)).finally(() => setLoading(false)); }
  useEffect(load, [organizer, page]);
  return <main className="page-wrap collection-page"><div className="section-heading"><div><p className="eyebrow">{organizer ? 'YOUR CORNER OF CAMPUS' : 'THE GOOD ONES YOU SAVED'}</p><h1>{organizer ? 'My events' : 'Saved for later'}</h1><p className="collection-intro">{organizer ? 'Keep your event details up to date and let people know if plans change.' : 'Your bookmarked campus moments, all in one place.'}</p></div>{organizer && <Link className="button button-dark" to="/events/new">＋ Create event</Link>}</div>
  {loading ? <LoadingState label={organizer ? 'Loading your events…' : 'Loading your saved events…'} /> : error ? <ErrorState message={error} onRetry={load} /> : result?.items.length ? <><div className="event-grid">{result.items.map((event, index) => <div className="collection-card" key={event.id}>{event.status === 'cancelled' && <span className="status-ribbon">Cancelled</span>}<EventCard event={event} index={index} />{organizer && <Link className="collection-edit" to={`/events/${event.id}/edit`}>Edit event ↗</Link>}</div>)}</div>{result.pagination.pages > 1 && <div className="pagination collection-pagination"><button disabled={page <= 1} onClick={() => setPage(page - 1)}>← Previous</button><span>Page {page} of {result.pagination.pages}</span><button disabled={page >= result.pagination.pages} onClick={() => setPage(page + 1)}>Next →</button></div>}</> : <EmptyState title={organizer ? 'Your calendar starts here' : 'A little space for what you love'} message={organizer ? 'Create an event and invite the campus in.' : 'When you save an event, you’ll find it here.'} action={<Link className="button button-dark button-small" to={organizer ? '/events/new' : '/'}>{organizer ? 'Create your first event' : 'Explore events'} <span aria-hidden="true">→</span></Link>} />}</main>;
}

