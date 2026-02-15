export default function InfinityPattern({ opacity = 0.06 }: { opacity?: number }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        opacity,
      }}
    >
      <svg width="100%" height="100%" style={{ position: "absolute" }}>
        <defs>
          <pattern id="inf8" x="0" y="0" width="60" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M15 20c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10zm20 0c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10z"
              fill="none"
              stroke="#F5F0E8"
              strokeWidth="0.8"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#inf8)" />
      </svg>
    </div>
  );
}
