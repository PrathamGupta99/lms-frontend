import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { AppProviders } from '../context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LMS',
  description: 'Adaptive testing LMS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProviders>
          <div className="app-shell">
            <header className="app-header">
              <div className="brand">
                <span className="dot" />
                <Link href="/">Adaptive LMS</Link>
              </div>
              <nav className="nav-links">
                <Link href="/login">Login</Link>
                <Link href="/register">Register</Link>
                <Link href="/admin">Admin</Link>
                <Link href="/tests">Tests</Link>
              </nav>
            </header>
            <main className="app-main">{children}</main>
            <footer className="app-footer">
              <span>Adaptive testing LMS</span>
              <span className="muted">Modern UI scaffold • Next.js + TS + Context</span>
            </footer>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
