// A slim, minimal red chili-pepper silhouette — long body, a gentle single
// curve, a small pointed tip, and a tiny stem hook. Monochrome red only
// (both the body and the stem), no other colours, to read as a quiet
// premium pattern rather than a literal emoji/icon.
// `variant="filled"` gives a solid pepper; `variant="outline"` gives just
// the contour, so a scattered group can mix both for visual variety.
export default function ChiliIcon({ style, className, variant = "filled", color = "#C83E2B" }) {
  const body =
    "M12.3 3.3 C14.3 4.4 15.7 7 15.4 9.9 C15 13.4 12.6 17 10.1 19.2 C9.6 18.9 9.3 18.3 9.2 17.4 C9 15.2 9.3 12.2 9.9 9.4 C10.4 6.9 11.2 4.8 12.3 3.3 Z";
  const stem = "M11.3 3.1c.5-.6 1.3-.7 1.8-.2";

  return (
    <svg viewBox="0 0 24 24" fill="none" style={style} className={className}>
      <path d={stem} stroke={color} strokeWidth="0.9" strokeLinecap="round" />
      {variant === "outline" ? (
        <path d={body} fill="none" stroke={color} strokeWidth="0.9" strokeLinejoin="round" strokeLinecap="round" />
      ) : (
        <path d={body} fill={color} />
      )}
    </svg>
  );
}
