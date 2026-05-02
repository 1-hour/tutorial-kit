import Link from 'next/link';
import { getSiteConfig } from '@/lib/content';

export default function NotFound() {
  const site = getSiteConfig();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Broken clock illustration */}
        <div className="mb-8 flex justify-center">
          <svg width="200" height="200" viewBox="0 0 200 200" className="opacity-90">
            <defs>
              <linearGradient id="grad404" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="var(--primary-gradient-end)" />
              </linearGradient>
            </defs>
            {/* Clock circle (broken) */}
            <circle cx="100" cy="100" r="70" fill="none" stroke="url(#grad404)" strokeWidth="8" strokeLinecap="round" strokeDasharray="20 10" opacity="0.6"/>
            {/* Broken hands */}
            <line x1="100" y1="100" x2="100" y2="50" stroke="url(#grad404)" strokeWidth="6" strokeLinecap="round" opacity="0.8"/>
            <line x1="100" y1="100" x2="135" y2="75" stroke="url(#grad404)" strokeWidth="8" strokeLinecap="round" opacity="0.8"/>
            {/* Question mark instead of center dot */}
            <text x="100" y="115" fontSize="48" fontWeight="700" fill="url(#grad404)" textAnchor="middle">?</text>
            {/* Scattered clock numbers */}
            <text x="100" y="35" fontSize="16" fill="currentColor" opacity="0.4" textAnchor="middle">12</text>
            <text x="165" y="108" fontSize="16" fill="currentColor" opacity="0.4" textAnchor="middle">3</text>
            <text x="100" y="180" fontSize="16" fill="currentColor" opacity="0.4" textAnchor="middle">6</text>
            <text x="35" y="108" fontSize="16" fill="currentColor" opacity="0.4" textAnchor="middle">9</text>
          </svg>
        </div>

        {/* Error code */}
        <div className="mb-4">
          <span className="text-8xl font-bold gradient-text">404</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          This page took more than 1 hour to find
        </h1>

        {/* Description */}
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          Looks like this tutorial doesn't exist yet. But we have plenty of others that take exactly 60 minutes.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/en/"
            className="px-6 py-3 text-white rounded-lg font-medium transition-opacity hover:opacity-90"
            style={{
              background: `linear-gradient(135deg, var(--primary) 0%, var(--primary-gradient-end) 100%)`,
            }}
          >
            Browse Tutorials
          </Link>
          <Link
            href="/en/categories/"
            className="px-6 py-3 border rounded-lg font-medium hover:bg-muted transition-colors"
          >
            Explore Categories
          </Link>
        </div>

        {/* Fun fact */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            <span className="gradient-text font-semibold">Fun fact:</span> The average person spends 4 minutes on a 404 page. You could learn something in that time instead.
          </p>
        </div>
      </div>
    </div>
  );
}
