export function TaskConstellationBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -left-20 top-24 size-[640px] rounded-full bg-purple-600/20 blur-ambient mix-blend-screen" />
      <svg
        className="absolute inset-0 h-full w-full opacity-45"
        viewBox="0 0 1512 982"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <g stroke="rgba(251,247,254,0.22)" strokeWidth="1">
          <path d="M86 260L390 76L632 310L884 280L1112 520" />
          <path d="M154 678L392 552L606 746L980 644L1284 848" />
          <path d="M920 84L1280 180L1378 420L1194 620" />
        </g>
        {[
          [390, 76],
          [632, 310],
          [884, 280],
          [1112, 520],
          [392, 552],
          [606, 746],
          [980, 644],
          [1284, 848],
          [920, 84],
          [1378, 420],
        ].map(([cx, cy]) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="7"
            fill="#FDD734"
            filter="url(#glow)"
          />
        ))}
        <defs>
          <filter id="glow" x="-20" y="-20" width="40" height="40">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
}

