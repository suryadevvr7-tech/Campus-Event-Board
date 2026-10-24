import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import DiscoverPage from '../pages/DiscoverPage.jsx';
import EventCard from '../components/EventCard.jsx';
import { EmptyState, LoadingState } from '../components/States.jsx';

const event = {
  id: '123456789012345678901234',
  title: 'Student Design Meetup',
  description: 'Meet other students to share design work and exchange practical feedback.',
  category: 'Workshop',
  venue: 'Innovation Hall',
  startsAt: '2027-01-12T10:00:00.000Z',
  endsAt: '2027-01-12T12:00:00.000Z',
  status: 'published',
  organizer: { id: '223456789012345678901234', name: 'Campus Organizer' }
};

vi.mock('../services/api.js', () => ({ api: { events: vi.fn() } }));
import { api } from '../services/api.js';

describe('Campus Event Board views', () => {
  it('renders loading and empty states accessibly', () => {
    render(<><LoadingState /><EmptyState title="No events found" message="Try a different category." /></>);
    expect(screen.getByRole('status')).toHaveTextContent('Loading events');
    expect(screen.getByRole('heading', { name: 'No events found' })).toBeInTheDocument();
    expect(screen.getByText('Try a different category.')).toBeInTheDocument();
  });

  it('shows event details and a link from an event card', () => {
    render(<MemoryRouter><EventCard event={event} /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Student Design Meetup' })).toBeInTheDocument();
    expect(screen.getByText('Innovation Hall')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View Student Design Meetup' })).toHaveAttribute('href', '/events/123456789012345678901234');
  });

  it('shows the discover empty state when there are no published events', async () => {
    api.events.mockResolvedValue({ items: [], pagination: { page: 1, limit: 9, total: 0, pages: 0 } });
    render(<MemoryRouter><DiscoverPage /></MemoryRouter>);
    expect(await screen.findByRole('heading', { name: 'No events found' })).toBeInTheDocument();
  });

  it('reports a readable retry state when event loading fails', async () => {
    api.events.mockRejectedValue(new Error('The service is unavailable.'));
    render(<MemoryRouter><DiscoverPage /></MemoryRouter>);
    expect(await screen.findByRole('alert')).toHaveTextContent('The service is unavailable.');
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });
});

