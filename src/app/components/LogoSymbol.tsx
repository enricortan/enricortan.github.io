import { useTheme } from "@/app/contexts/ThemeContext";

interface LogoSymbolProps {
  /** Height in pixels — width scales proportionally from the 334.2 × 324 viewBox */
  height?: number;
  className?: string;
}

/**
 * Enrico's logo mark rendered as an inline SVG.
 *
 * Dark mode  — outer shape: white → lavender  |  inner shape: indigo → sky (with glow)
 * Light mode — outer shape: #1d1d1f → #6366f1  |  inner shape: #4338ca → #0284c7 (no glow)
 */
export function LogoSymbol({ height = 28, className = "" }: LogoSymbolProps) {
  const { isDarkMode } = useTheme();

  // Each render gets unique IDs so multiple instances on the same page don't clash
  const uid = isDarkMode ? "dark" : "light";
  const outerGId  = `logoOuterG-${uid}`;
  const innerGId  = `logoInnerG-${uid}`;
  const glowId    = `logoGlow-${uid}`;

  // Maintain the original 334.2 × 324 aspect ratio
  const width = Math.round(height * (334.2 / 324));

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 334.2 324"
      fill="none"
      width={width}
      height={height}
      className={className}
      aria-label="Logo"
    >
      <defs>
        {/* ── Dark mode gradients ─────────────────────────────────────── */}
        {isDarkMode ? (
          <>
            <linearGradient id={outerGId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#ffffff" />
              <stop offset="100%" stopColor="#a5b4fc" />
            </linearGradient>
            <linearGradient id={innerGId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#818cf8" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
            <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </>
        ) : (
          /* ── Light mode gradients ──────────────────────────────────── */
          <>
            <linearGradient id={outerGId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#1d1d1f" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient id={innerGId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#4338ca" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </>
        )}
      </defs>

      {/* Outer diamond sweep */}
      <path
        fill={`url(#${outerGId})`}
        d="M302.7,141.9L162.9,281.8L46.1,165L185.8,25.3L162.5,2L11.1,153.4c-6.4,6.4-6.4,16.8,0,23.1l140.2,140.2c6.4,6.4,16.8,6.4,23.1,0L326,165.2L302.7,141.9z"
      />

      {/* Inner accent mark */}
      <path
        fill={`url(#${innerGId})`}
        filter={isDarkMode ? `url(#${glowId})` : undefined}
        d="M244.2,153.3V153l0.1-0.1l-0.1-69.5l-70-0.2l-70,70.2c-6.4,6.4-6.4,16.8,0,23.1l0.1,0.1c6.4,6.4,16.8,6.4,23.1,0l61.1-61.1l23.4,0v23.1L150.7,200c-6.4,6.4-6.4,16.8,0,23.1l0.1,0.1c6.4,6.4,16.8,6.4,23.1,0l69.8-69.8L244.2,153.3z"
      />
    </svg>
  );
}
