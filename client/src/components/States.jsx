export function LoadingState({ label = 'Loading events…' }) { return <div className="state-panel" role="status"><span className="spinner" aria-hidden="true" />{label}</div>; }
export function ErrorState({ message, onRetry }) { return <div className="state-panel state-error" role="alert"><span className="state-icon">!</span><div><strong>We couldn’t load that.</strong><p>{message}</p>{onRetry && <button className="button button-secondary button-small" onClick={onRetry}>Try again</button>}</div></div>; }
export function EmptyState({ title = 'Nothing here yet', message = 'Check back soon for new campus events.', action }) { return <div className="state-panel empty-state"><span className="empty-mark" aria-hidden="true">✳</span><h3>{title}</h3><p>{message}</p>{action}</div>; }

