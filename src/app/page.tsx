export default function HomePage() {
  return (
    <section className="hero">
      <div className="hero__text">
        <p className="eyebrow">Adaptive Assessment Platform</p>
        <h1>Deliver adaptive tests with clear role-based controls.</h1>
        <p className="lede">
          Modern LMS experience using Next.js + TypeScript + Context. Admins manage users, tests, and
          questions; normal users take adaptive exams.
        </p>
        <div className="hero__actions">
          <a className="btn primary" href="/register">
            Create Admin
          </a>
          <a className="btn ghost" href="/login">
            Login
          </a>
        </div>
      </div>
      <div className="hero__card">
        <div className="card-line">
          <span className="pill">Admin</span>
          <span className="muted">Create users, tests, questions</span>
        </div>
        <div className="card-line">
          <span className="pill pill-accent">User</span>
          <span className="muted">Start adaptive sessions only</span>
        </div>
        <div className="card-line">
          <span className="pill pill-muted">Adaptive</span>
          <span className="muted">Difficulty shifts with every answer</span>
        </div>
      </div>
    </section>
  );
}
