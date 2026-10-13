'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif',
          gap: '1rem',
          margin: 0,
        }}
      >
        <h1 style={{ fontSize: '2rem', margin: 0 }}>Something went wrong</h1>
        <p style={{ color: '#555' }}>An unexpected error occurred.</p>
        <button
          onClick={() => reset()}
          style={{
            padding: '0.6rem 1.4rem',
            background: '#0a2540',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
