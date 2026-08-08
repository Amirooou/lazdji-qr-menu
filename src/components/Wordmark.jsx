import logoWordmark from "./logo-wordmark.svg";

// The real brand wordmark — gold/bronze gradient "LAZDJI" with the flame+
// chili icon standing in for the "J", exactly as designed. `size` controls
// the rendered height; width follows the source image's own aspect ratio.
export default function Wordmark({ size = 27 }) {
  return <img src={logoWordmark} alt="LAZDJI" style={{ height: size, width: "auto", display: "block" }} />;
}
