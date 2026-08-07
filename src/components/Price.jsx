import { fmtPrice, GOLD_DARK, GOLD_LIGHT } from "../utils/format";

// `on="light"` = sitting on a white/cream card (deep antique gold, best contrast).
// `on="dark"`  = sitting on a black/red surface (warm light gold, best contrast).
// `from`       = prefixes "от " (e.g. a portion-priced dish showing its
//                cheapest option: "от 10 990 ₸") instead of an exact price.
export default function Price({ value, from = false, size = 16, weight = 800, on = "light", style = {} }) {
  // `value` is null for a dish priced per-portion (see dishes.price in the
  // schema) whose caller hasn't substituted a portion price in — render
  // nothing rather than crash on a bad/missing number.
  if (value === null || value === undefined) return null;

  return (
    <span
      style={{
        fontSize: size,
        fontWeight: weight,
        color: on === "light" ? GOLD_DARK : GOLD_LIGHT,
        letterSpacing: "-0.01em",
        fontVariantNumeric: "tabular-nums",
        ...style,
      }}
    >
      {from ? `от ${fmtPrice(value)}` : fmtPrice(value)}
    </span>
  );
}
