export function formatEventDate(value, options = {}) { return new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric', ...options }).format(new Date(value)); }
export function toDateTimeLocal(value) { if (!value) return ''; const date = new Date(value); date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); return date.toISOString().slice(0, 16); }
