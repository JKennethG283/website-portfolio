/** Deterministic star positions keep server and browser rendering identical. */
export function LandscapeSky() {
  return (
    <div className="landscape-sky" aria-hidden="true">
      <div className="sky-celestial">
        <span />
      </div>
      <svg
        className="sky-stars sky-stars--far"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        {Array.from({ length: 65 }, (_, i) => (
          <circle
            key={i}
            cx={(i * 227 + 39) % 1440}
            cy={(i * 131 + 17) % 580}
            r={i % 5 === 0 ? 1.6 : 0.8}
            opacity={0.25 + (i % 5) * 0.14}
          />
        ))}
      </svg>
      <svg
        className="sky-stars sky-stars--near"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        {Array.from({ length: 18 }, (_, i) => (
          <circle
            key={i}
            cx={(i * 313 + 92) % 1440}
            cy={(i * 173 + 41) % 500}
            r={i % 3 === 0 ? 2 : 1.2}
          />
        ))}
        <path
          className="sky-constellation"
          d="m1040 100 85 47 69-24 87 85-33 107"
        />
        {[
          [1040, 100],
          [1125, 147],
          [1194, 123],
          [1281, 208],
          [1248, 315],
        ].map(([x, y]) => (
          <circle key={x} cx={x} cy={y} r="2" />
        ))}
      </svg>
      <div className="sky-haze" />
      <svg
        className="sky-ridge sky-ridge--far"
        viewBox="0 0 1440 260"
        preserveAspectRatio="none"
      >
        <path d="M0 170 150 140 280 180 420 85 485 120 620 40 700 112 790 90 940 170 1100 80 1220 115 1320 60 1440 110V260H0Z" />
      </svg>
      <svg
        className="sky-ridge sky-ridge--near"
        viewBox="0 0 1440 210"
        preserveAspectRatio="none"
      >
        <path d="m0 85 150 80 200-30 155 45 150-60 180 65 220-75 155 20 230-90v170H0Z" />
      </svg>
    </div>
  );
}
