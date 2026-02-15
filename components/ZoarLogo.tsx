export default function ZoarLogo({
  size = 40,
  color = "#F5F0E8",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="48" fill="#0A0A0A" stroke={color} strokeWidth="1.5" />
      <text
        x="50"
        y="58"
        textAnchor="middle"
        fill={color}
        fontFamily="'Cormorant Garamond', serif"
        fontSize="28"
        fontWeight="300"
        letterSpacing="3"
      >
        ZÖAR
      </text>
    </svg>
  );
}
