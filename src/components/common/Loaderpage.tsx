import React, { useEffect, useRef, useState } from 'react';
import { subscribeLoadingState } from '@/lib/api-client';

interface LoaderPageProps {
  alwaysVisible?: boolean;
  /** Ms to wait before showing, so fast requests never flash the loader. */
  showDelay?: number;
  /** Ms the loader stays once shown, so it never blinks away instantly. */
  minVisible?: number;
}

const LoaderPage: React.FC<LoaderPageProps> = ({
  alwaysVisible = false,
  showDelay = 150,
  minVisible = 500,
}) => {
  const [visible, setVisible] = useState(false);
  const shownAt = useRef(0);
  const showTimer = useRef<ReturnType<typeof setTimeout>>();
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const clearTimers = () => {
      clearTimeout(showTimer.current);
      clearTimeout(hideTimer.current);
    };

    const unsubscribe = subscribeLoadingState(state => {
      if (state.isLoading) {
        clearTimeout(hideTimer.current);
        if (!showTimer.current) {
          showTimer.current = setTimeout(() => {
            shownAt.current = Date.now();
            setVisible(true);
            showTimer.current = undefined;
          }, showDelay);
        }
      } else {
        clearTimeout(showTimer.current);
        showTimer.current = undefined;
        const remaining = Math.max(
          0,
          minVisible - (Date.now() - shownAt.current)
        );
        hideTimer.current = setTimeout(() => setVisible(false), remaining);
      }
    });

    return () => {
      clearTimers();
      unsubscribe();
    };
  }, [showDelay, minVisible]);

  if (!alwaysVisible && !visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm dark:bg-black/60"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading…</span>

      <div className="logo-loader-box">
        <div className="logo-loader-box__inner bg-white dark:bg-gray-800">
          <svg
            className="logo-loader dark:brightness-[1.8] dark:saturate-125"
            viewBox="0 0 282 350"
            width="68"
            height="85"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              <linearGradient
                id="loader-blue"
                x1="35"
                y1="255"
                x2="122"
                y2="54"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#0755F5" />
                <stop offset="1" stopColor="#1119D8" />
              </linearGradient>
              <linearGradient
                id="loader-ribbon"
                x1="76"
                y1="251"
                x2="235"
                y2="93"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#084EF1" />
                <stop offset="0.52" stopColor="#03BCE0" />
                <stop offset="1" stopColor="#00D45D" />
              </linearGradient>
              <linearGradient
                id="loader-green"
                x1="206"
                y1="292"
                x2="238"
                y2="117"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#0759EF" />
                <stop offset="1" stopColor="#00D45D" />
              </linearGradient>
            </defs>

            <path
              className="logo-loader__path logo-loader__path--one"
              pathLength="1"
              d="M41 246V78C41 68 46 61 55 56L90 38C103 31 114 40 114 53V77L59 109V246C59 258 41 258 41 246Z"
              fill="url(#loader-blue)"
            />
            <path
              className="logo-loader__path logo-loader__path--two"
              pathLength="1"
              d="M59 109L114 77V121C114 131 122 136 131 131L223 80C236 73 254 82 254 98V122L132 188C124 192 120 198 120 207V290C120 301 101 309 91 303C85 300 82 294 82 287V207C82 191 89 181 103 173L109 170C98 170 88 163 83 154L79 147C74 137 80 126 90 121L59 139V109Z"
              fill="url(#loader-ribbon)"
            />
            <path
              className="logo-loader__path logo-loader__path--three"
              pathLength="1"
              d="M223 80C236 73 254 82 254 98V156C254 166 249 172 241 177L210 194V230C210 238 207 242 201 246L181 257V290C181 301 192 305 201 300L239 279C249 274 254 266 254 255V122L223 139V80Z"
              fill="url(#loader-green)"
            />
            <circle
              className="logo-loader__dot"
              cx="230"
              cy="70"
              r="24"
              fill="#00D45D"
            />
          </svg>
        </div>
      </div>

      {/* Scoped to this component: no import-time side effects, SSR-safe. */}
      <style>{loaderAnimationStyles}</style>
    </div>
  );
};

// The stroke reveal makes the mark feel drawn; the fill arrives just behind it.
const loaderAnimationStyles = `
  /* Square card with a logo-colored comet that runs around the border. */
  .logo-loader-box {
    position: relative;
    width: 148px;
    height: 148px;
    border-radius: 18px;
    overflow: hidden;
    background: rgba(17, 25, 216, 0.08);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
  }

  .logo-loader-box::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 220%;
    height: 220%;
    transform: translate(-50%, -50%) rotate(0deg);
    background: conic-gradient(
      from 0deg,
      transparent 0deg,
      transparent 200deg,
      #1119d8 245deg,
      #00bfe0 305deg,
      #00d45d 354deg,
      transparent 360deg
    );
    /* 2.8s = one lap per logo cycle, so the two stay in sync. */
    animation: logo-loader-spin 2.8s linear infinite;
    will-change: transform;
  }

  /* The box pops open while the logo is already being drawn. */
  .logo-loader-box {
    animation: logo-loader-open 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.2) both;
  }

  @keyframes logo-loader-open {
    from { opacity: 0; transform: scale(0.85); }
    to   { opacity: 1; transform: scale(1); }
  }

  .logo-loader-box__inner {
    position: absolute;
    inset: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 15px;
  }

  @keyframes logo-loader-spin {
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }

  .logo-loader__path {
    stroke: currentColor;
    stroke-width: 2;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    fill-opacity: 0;
    animation: logo-loader-draw 2.8s ease-in-out infinite;
    will-change: stroke-dashoffset, fill-opacity;
  }

  /* The logo starts drawing immediately, while the box is still opening. */
  .logo-loader__path--one   { color: #1119d8; animation-delay: 0s; }
  .logo-loader__path--two   { color: #00bfe0; animation-delay: 0.1s; }
  .logo-loader__path--three { color: #00d45d; animation-delay: 0.2s; }

  .logo-loader__dot {
    opacity: 0;
    transform-box: fill-box;
    transform-origin: center;
    animation: logo-loader-dot 2.8s ease-in-out 0.2s infinite backwards;
  }

  @keyframes logo-loader-draw {
    0%       { stroke-dashoffset: 1;  fill-opacity: 0; }
    22%, 78% { stroke-dashoffset: 0;  fill-opacity: 1; }
    100%     { stroke-dashoffset: -1; fill-opacity: 0; }
  }

  @keyframes logo-loader-dot {
    0%, 6%   { opacity: 0; transform: scale(0.4); }
    24%, 78% { opacity: 1; transform: scale(1); }
    100%     { opacity: 0; transform: scale(0.4); }
  }

  /* Respect reduced-motion: show the finished logo with a gentle pulse. */
  @media (prefers-reduced-motion: reduce) {
    .logo-loader-box::before { animation-duration: 6s; }
    .logo-loader__path {
      animation: logo-loader-pulse 2s ease-in-out infinite;
      stroke-dashoffset: 0;
      fill-opacity: 1;
    }
    .logo-loader__dot {
      animation: logo-loader-pulse 2s ease-in-out infinite;
      opacity: 1;
    }
    @keyframes logo-loader-pulse {
      0%, 100% { opacity: 1; }
      50%      { opacity: 0.45; }
    }
  }
`;

export default LoaderPage;
