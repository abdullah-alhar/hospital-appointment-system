/** Shimmering placeholder blocks used while data loads — reads as a real product, not a spinner in a void. */

export function SkeletonStats({ count = 2 }) {
  return (
    <div className="stats-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div className="stat-card skeleton-card" key={i}>
          <div className="skeleton-block" style={{ width: 48, height: 48, borderRadius: 12 }} />
          <div className="stat-content">
            <div className="skeleton-block" style={{ width: '60%', height: 11, marginBottom: 10 }} />
            <div className="skeleton-block" style={{ width: '35%', height: 22 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonCards({ count = 6 }) {
  return (
    <div className="card-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div className="card skeleton-card" key={i} style={{ animationDelay: `${i * 40}ms` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div className="skeleton-block" style={{ width: 40, height: 40, borderRadius: '50%' }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton-block" style={{ width: '70%', height: 13, marginBottom: 8 }} />
              <div className="skeleton-block" style={{ width: '40%', height: 10 }} />
            </div>
          </div>
          <div className="skeleton-block" style={{ width: '90%', height: 10, marginBottom: 8 }} />
          <div className="skeleton-block" style={{ width: '60%', height: 10, marginBottom: 16 }} />
          <div className="skeleton-block" style={{ width: '100%', height: 34, borderRadius: 8 }} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5, columns = 4 }) {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="table-wrapper" style={{ margin: 0, border: 'none' }}>
        <table style={{ width: '100%' }}>
          <tbody>
            {Array.from({ length: rows }).map((_, r) => (
              <tr key={r} style={{ animationDelay: `${r * 45}ms` }} className="skeleton-row">
                <td>
                  <div className="table-user-cell">
                    <div className="skeleton-block" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                    <div style={{ flex: 1 }}>
                      <div className="skeleton-block" style={{ width: '65%', height: 11, marginBottom: 6 }} />
                      <div className="skeleton-block" style={{ width: '40%', height: 9 }} />
                    </div>
                  </div>
                </td>
                {Array.from({ length: columns - 1 }).map((__, c) => (
                  <td key={c}>
                    <div className="skeleton-block" style={{ width: '70%', height: 11 }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
