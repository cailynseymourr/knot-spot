// A ball of yarn: wide outlined bands wrapped in different directions, with a
// long tail curling out at the bottom left. size is the width in pixels.
// To recolor it, pass fill / outline, e.g. <YarnBall fill="#f6d5e6" />

// Each band is a curve: start, control point, end (they're clipped to the ball)
const BANDS = [
  "M12 30 Q28 8 62 14",
  "M14 14 Q44 22 60 40",
  "M26 2 Q20 28 42 46",
  "M52 2 Q62 26 36 46",
  "M10 34 Q38 22 64 28"
];

function YarnBall({ size = 52, fill = "#e6daf5", outline = "#3b2a4a" }) {
  return (
    <svg
      width={size}
      height={(size * 56) / 64}
      viewBox="0 0 64 56"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id="yarn-ball-clip">
          <circle cx="38" cy="23" r="20" />
        </clipPath>
      </defs>

      {/* the tail goes first so it tucks in under the ball */}
      <g fill="none" strokeLinecap="round">
        <path d="M29 37 C23 50 10 53 3 46" stroke={outline} strokeWidth="4.8" />
        <path d="M29 37 C23 50 10 53 3 46" stroke={fill} strokeWidth="2.8" />
      </g>

      {/* the ball */}
      <circle cx="38" cy="23" r="20" fill={fill} />

      {/* wrapped bands: an outline stroke, then the fill stroke on top */}
      <g
        clipPath="url(#yarn-ball-clip)"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {BANDS.map((d) => (
          <g key={d}>
            <path d={d} stroke={outline} strokeWidth="8.4" />
            <path d={d} stroke={fill} strokeWidth="6" />
          </g>
        ))}
      </g>

      {/* ball outline on top so the bands end cleanly at the edge */}
      <circle cx="38" cy="23" r="20" fill="none" stroke={outline} strokeWidth="1.9" />
    </svg>
  );
}

export default YarnBall;