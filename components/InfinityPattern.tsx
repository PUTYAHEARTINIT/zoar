export default function InfinityPattern({
  opacity = 0.12,
  fixed = false,
}: {
  opacity?: number;
  fixed?: boolean;
}) {
  return (
    <div
      style={{
        position: fixed ? "fixed" : "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        opacity,
        zIndex: 0,
      }}
    >
      <svg width="100%" height="100%" style={{ position: "absolute" }}>
        <defs>
          <pattern id={fixed ? "inf-bg" : "inf8"} x="0" y="0" width="60" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M15 20c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10zm20 0c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10z"
              fill="none"
              stroke="#F5F0E8"
              strokeWidth="1"
              filter={fixed ? "url(#glow)" : undefined}
            />
          </pattern>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${fixed ? "inf-bg" : "inf8"})`} />
      </svg>
    </div>
  );
}
