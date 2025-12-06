"use client";

export default function NotFound() {
  return (
    <section className="auth-card">
      <p className="eyebrow">404</p>
      <h2>Page not found</h2>
      <p className="muted small">The page you are looking for does not exist.</p>
      <a className="btn primary full" href="/">
        Go Home
      </a>
    </section>
  );
}
