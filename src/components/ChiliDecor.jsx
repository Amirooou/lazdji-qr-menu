import ChiliIcon from "./ChiliIcon";

/**
 * A single decorative chili — a real photo if one's been provided (see
 * src/assets/chiliAssets.js), otherwise the hand-drawn vector silhouette.
 * Hero.jsx doesn't need to know or care which; it just renders these.
 */
export default function ChiliDecor({ src, variant = "filled", style, className }) {
  if (src) {
    return <img src={src} alt="" aria-hidden="true" className={className} style={{ objectFit: "contain", ...style }} />;
  }
  return <ChiliIcon variant={variant} className={className} style={style} />;
}
