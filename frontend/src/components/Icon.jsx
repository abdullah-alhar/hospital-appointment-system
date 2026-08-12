// Small hand-drawn icon set used throughout the app instead of emoji.
// Emoji render inconsistently across OS/browsers and read as a generic
// AI-template shortcut — a single-color line-icon set keeps every screen
// visually consistent with the teal clinical palette.

const paths = {
  cross: (
    <>
      <line x1="12" y1="3" x2="12" y2="21" />
      <line x1="3" y1="12" x2="21" y2="12" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.25" />
      <path d="M2.5 20v-1a6.5 6.5 0 0 1 13 0v1" />
      <path d="M16.2 4.8a3.25 3.25 0 0 1 0 6.4" />
      <path d="M15 20v-1a6.5 6.5 0 0 0-3.3-5.66" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.75" />
      <path d="M4.5 21v-1a7.5 7.5 0 0 1 15 0v1" />
    </>
  ),
  pulse: (
    <>
      <path d="M12 20.2s-6.8-4.15-9-8.3C1.2 8.4 2.7 5 6.3 5c1.9 0 3.2 1.1 3.7 1.9.5-.8 1.8-1.9 3.7-1.9 3.6 0 5.1 3.4 3.3 6.9-2.2 4.15-9 8.3-9 8.3z" />
      <path d="M4 12h2.4l1.6 3.2 2.4-6.4 1.6 3.2h3.2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <line x1="15.5" y1="3" x2="15.5" y2="7" />
      <line x1="8.5" y1="3" x2="8.5" y2="7" />
      <line x1="3.5" y1="10" x2="20.5" y2="10" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <polyline points="12 7.5 12 12 15.5 14" />
    </>
  ),
  hourglass: (
    <>
      <line x1="6" y1="2.5" x2="18" y2="2.5" />
      <line x1="6" y1="21.5" x2="18" y2="21.5" />
      <path d="M7 2.5c0 6 5 5.5 5 9.5s-5 3.5-5 9.5" />
      <path d="M17 2.5c0 6-5 5.5-5 9.5s5 3.5 5 9.5" />
    </>
  ),
  clipboard: (
    <>
      <rect x="5.5" y="4" width="13" height="17" rx="2" />
      <rect x="8.75" y="2" width="6.5" height="3.5" rx="1" />
      <line x1="8.5" y1="11" x2="15.5" y2="11" />
      <line x1="8.5" y1="15" x2="15.5" y2="15" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v5.2c0 4.6-3 7.9-7 9.3-4-1.4-7-4.7-7-9.3V6z" />
      <path d="M8.7 12.1l2.1 2.1 4.3-4.3" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <line x1="20" y1="20" x2="15.3" y2="15.3" />
    </>
  ),
  logout: (
    <>
      <path d="M9.5 21H5.5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="15.5 16.5 20.5 12 15.5 7.5" />
      <line x1="20.5" y1="12" x2="9" y2="12" />
    </>
  ),
  trash: (
    <>
      <polyline points="4 7 20 7" />
      <path d="M6.2 7l1 13a2 2 0 0 0 2 1.9h5.6a2 2 0 0 0 2-1.9l1-13" />
      <path d="M9.5 7V4.2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V7" />
    </>
  ),
  edit: (
    <>
      <path d="M12 20h9" />
      <path d="M16.4 3.6a1.9 1.9 0 0 1 2.7 2.7L7 18.4l-4 1 1-4Z" />
    </>
  ),
  xCircle: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <line x1="9.2" y1="9.2" x2="14.8" y2="14.8" />
      <line x1="14.8" y1="9.2" x2="9.2" y2="14.8" />
    </>
  ),
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <polyline points="8 12.2 10.8 15 16 9.5" />
    </>
  ),
  x: (
    <path d="M18 6L6 18M6 6l12 12" />
  ),
  menu: (
    <path d="M4 7h16M4 12h16M4 17h16" />
  ),
  alertCircle: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <line x1="12" y1="7.5" x2="12" y2="13" />
      <circle cx="12" cy="16.3" r="0.4" fill="currentColor" stroke="none" />
    </>
  ),
  droplet: (
    <path d="M12 2.5s6.5 8 6.5 12.3a6.5 6.5 0 1 1-13 0C5.5 10.5 12 2.5 12 2.5z" />
  ),
  building: (
    <>
      <rect x="4.5" y="3" width="15" height="18" rx="1.2" />
      <rect x="8" y="7" width="2" height="2" />
      <rect x="14" y="7" width="2" height="2" />
      <rect x="8" y="11.5" width="2" height="2" />
      <rect x="14" y="11.5" width="2" height="2" />
      <rect x="10" y="16.5" width="4" height="4.5" />
    </>
  ),
  trendingUp: (
    <>
      <polyline points="3 17 9.5 10.5 13.5 14.5 21 7" />
      <polyline points="14.5 7 21 7 21 13.5" />
    </>
  ),
  inbox: (
    <>
      <polyline points="21.5 12.5 15.7 12.5 13.7 15.5 10.3 15.5 8.3 12.5 2.5 12.5" />
      <path d="M5.7 5.3L2.5 12v6a2 2 0 0 0 2 2h15a2 2 0 0 0 2-2v-6l-3.2-6.7a2 2 0 0 0-1.8-1.1H7.5a2 2 0 0 0-1.8 1.1z" />
    </>
  ),
  chevronRight: <polyline points="9 6 15 12 9 18" />,
};

export default function Icon({ name, size = 18, strokeWidth = 1.8, className = '', style }) {
  const content = paths[name];
  if (!content) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`icon${className ? ` ${className}` : ''}`}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      {content}
    </svg>
  );
}
