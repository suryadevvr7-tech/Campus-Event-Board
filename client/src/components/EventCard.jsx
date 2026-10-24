import { Link } from 'react-router';
import { formatEventDate } from '../utils/date.js';
const accents = ['accent-lilac', 'accent-peach', 'accent-mint', 'accent-yellow'];
export default function EventCard({ event, index = 0 }) {
  const date = new Date(event.startsAt);
  return <article className={`event-card ${accents[index % accents.length]}`}><div className="card-topline"><span className="category-pill">{event.category}</span><span className="card-date">{formatEventDate(event.startsAt)}</span></div><Link className="event-card-title" to={`/events/${event.id}`}><h3>{event.title}</h3></Link><p className="event-card-description">{event.description}</p><div className="event-card-meta"><span aria-hidden="true" className="meta-icon">◷</span><span>{date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span><span className="meta-dot">·</span><span>{event.venue}</span></div><div className="card-footer"><span className="organizer-line"><span className="avatar avatar-small">{event.organizer?.name?.slice(0, 1).toUpperCase() || 'C'}</span> {event.organizer?.name || 'Campus organizer'}</span><Link className="arrow-link" to={`/events/${event.id}`} aria-label={`View ${event.title}`}>↗</Link></div></article>;
}

