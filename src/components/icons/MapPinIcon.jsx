// A plain, minimal map-pin glyph — used for the 2GIS link. Deliberately
// generic rather than a reproduction of any map service's actual logo/mark.
export default function MapPinIcon({ size = 18, strokeWidth = 1.6, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path
        d="M12 21c-4.2-4.1-6.5-7.6-6.5-10.5C5.5 6.4 8.4 3.5 12 3.5s6.5 2.9 6.5 7c0 2.9-2.3 6.4-6.5 10.5Z"
        stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round"
      />
      <circle cx="12" cy="10.3" r="2.3" stroke="currentColor" strokeWidth={strokeWidth} />
    </svg>
  );
}
