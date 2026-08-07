import { GOLD } from "../theme";

// A small decorative corner flourish (a curved scroll with two dots),
// used on dish cards instead of a plain L-shaped bracket — the "dry
// square" look the brief specifically asked to move away from.
// `corner` picks which of the four card corners this sits in and mirrors
// the artwork accordingly, so only one path needs to be drawn.
export default function OrnamentalCorner({ corner = "top left", size = 22 }) {
  const [vSide, hSide] = corner.split(" ");
  const flipX = hSide === "right";
  const flipY = vSide === "bottom";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 22 22"
      style={{
        position: "absolute",
        [vSide]: 6,
        [hSide]: 6,
        transform: `scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})`,
        zIndex: 6,
        pointerEvents: "none",
      }}
    >
      <path d="M2 19C2 9 9 2 19 2" stroke={GOLD} strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.9" />
      <path d="M2 12C2 6.5 6.5 2 12 2" stroke={GOLD} strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.6" />
      <circle cx="2" cy="19" r="1.6" fill={GOLD} />
      <circle cx="19" cy="2" r="1.6" fill={GOLD} />
    </svg>
  );
}
