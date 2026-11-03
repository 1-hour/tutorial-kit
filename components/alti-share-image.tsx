'use client';

/**
 * ALTI share image — pure SVG, no server-side rendering needed.
 * Renders directly in the DOM; "download as PNG" uses canvas to convert.
 */
type Props = {
  type: string;
  title: string;
  layer: string;
  icon: string;
  color: string;
  locale: 'zh' | 'en';
};

const COLORS: Record<string, { from: string; to: string; text: string }> = {
  violet: { from: '#8b5cf6', to: '#6d28d9', text: '#5b21b6' },
  blue: { from: '#3b82f6', to: '#1d4ed8', text: '#1e40af' },
  pink: { from: '#ec4899', to: '#be185d', text: '#9d174d' },
  green: { from: '#10b981', to: '#047857', text: '#065f46' },
  orange: { from: '#f97316', to: '#c2410c', text: '#9a3412' },
  yellow: { from: '#eab308', to: '#a16207', text: '#854d0e' },
};

export function ALTIShareImage({ type, title, layer, icon, color, locale }: Props) {
  const c = COLORS[color] ?? COLORS.blue;
  const tag = locale === 'zh' ? '推荐从这里开始' : 'Start from this layer';
  const brand = '1hour.guide';
  const subtitle =
    locale === 'zh'
      ? 'AI Learning Type Indicator'
      : 'AI Learning Type Indicator';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 630"
      width="1200"
      height="630"
      className="block w-full h-auto"
    >
      <defs>
        <linearGradient id={`grad-${type}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c.from} />
          <stop offset="100%" stopColor={c.to} />
        </linearGradient>
        <linearGradient id={`glow-${type}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>

      {/* background */}
      <rect width="1200" height="630" fill={`url(#grad-${type})`} />
      <rect width="1200" height="200" fill={`url(#glow-${type})`} />

      {/* decorative dots */}
      <circle cx="100" cy="100" r="3" fill="rgba(255,255,255,0.4)" />
      <circle cx="1100" cy="520" r="3" fill="rgba(255,255,255,0.4)" />
      <circle cx="1050" cy="90" r="2" fill="rgba(255,255,255,0.3)" />
      <circle cx="150" cy="550" r="2" fill="rgba(255,255,255,0.3)" />

      {/* top brand bar */}
      <text
        x="80"
        y="90"
        fill="rgba(255,255,255,0.85)"
        fontSize="24"
        fontWeight="700"
        fontFamily="system-ui, -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif"
      >
        {brand}
      </text>
      <text
        x="80"
        y="118"
        fill="rgba(255,255,255,0.55)"
        fontSize="18"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {subtitle}
      </text>

      {/* main icon */}
      <text
        x="80"
        y="300"
        fontSize="140"
        fontFamily="system-ui, -apple-system, 'Apple Color Emoji', sans-serif"
      >
        {icon}
      </text>

      {/* type big */}
      <text
        x="80"
        y="420"
        fill="white"
        fontSize="96"
        fontWeight="800"
        letterSpacing="4"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {type}
      </text>

      {/* result title */}
      <text
        x="80"
        y="490"
        fill="rgba(255,255,255,0.95)"
        fontSize="42"
        fontWeight="700"
        fontFamily="system-ui, -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif"
      >
        {truncate(title, 20)}
      </text>

      {/* layer tag */}
      <g transform="translate(80, 530)">
        <rect
          width={measureText(`${tag} · ${layer}`, 20) + 32}
          height="48"
          rx="24"
          fill="rgba(255,255,255,0.2)"
        />
        <text
          x="16"
          y="31"
          fill="white"
          fontSize="20"
          fontWeight="600"
          fontFamily="system-ui, -apple-system, 'PingFang SC', sans-serif"
        >
          {tag} · {layer}
        </text>
      </g>

      {/* right side URL */}
      <text
        x="1120"
        y="590"
        fill="rgba(255,255,255,0.7)"
        fontSize="18"
        fontWeight="600"
        textAnchor="end"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        1hour.guide/{locale}/alti
      </text>
    </svg>
  );
}

/** Rough CJK-aware char-width measurement (18px baseline, 20px font → ~24/char CJK, 11/char ASCII) */
function measureText(s: string, fontSize: number): number {
  let w = 0;
  for (const ch of s) {
    const code = ch.charCodeAt(0);
    const isCjk = code > 0x2e80 && code < 0x9fff;
    w += isCjk ? fontSize * 1.1 : fontSize * 0.55;
  }
  return Math.ceil(w);
}

function truncate(s: string, maxCjk: number): string {
  let count = 0;
  let out = '';
  for (const ch of s) {
    const code = ch.charCodeAt(0);
    const isCjk = code > 0x2e80 && code < 0x9fff;
    count += isCjk ? 1 : 0.5;
    if (count > maxCjk) return out + '…';
    out += ch;
  }
  return out;
}
