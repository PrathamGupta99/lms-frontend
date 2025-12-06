"use client";

export default function ForbiddenPage() {
  return (
    <section className="auth-card">
      <p className="eyebrow">403</p>
      <h2>Access Denied</h2>
      <p className="muted small">You do not have permission to view this page.</p>
      <a className="btn primary full" href="/login">
        Go to Login
      </a>
    </section>
  );
}
