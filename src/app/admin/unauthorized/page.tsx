"use client";

export default function AdminUnauthorized() {
  return (
    <section className="auth-card">
      <p className="eyebrow">Admin only</p>
      <h2>Access blocked</h2>
      <p className="muted small">You must be an admin to view this page.</p>
      <a className="btn primary full" href="/login">
        Login as admin
      </a>
    </section>
  );
}
