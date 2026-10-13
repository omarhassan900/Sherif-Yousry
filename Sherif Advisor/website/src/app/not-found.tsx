import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
        gap: '1rem',
      }}
    >
      <h1 style={{ fontSize: '3rem', margin: 0 }}>404</h1>
      <p style={{ fontSize: '1.1rem', color: '#555' }}>
        The page you are looking for could not be found.
      </p>
      <Link
        href="/"
        style={{
          color: '#0a2540',
          textDecoration: 'underline',
          fontWeight: 600,
        }}
      >
        Go back home
      </Link>
    </div>
  );
}
