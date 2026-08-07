import { Flame, Salad, Soup, Beef, CookingPot, Coffee, UtensilsCrossed } from "lucide-react";

const ICON_MAP = { signature: Flame, salads: Salad, soups: Soup, mains: Beef, lagman: CookingPot, drinks: Coffee };

// Falls back to a generic icon for any category id not in the map above —
// so a category added later through the (future) admin panel still gets
// an icon instead of rendering nothing.
export default function CategoryIcon({ cat, size = 15, className = "", color }) {
  const Icon = ICON_MAP[cat] || UtensilsCrossed;
  return <Icon size={size} className={className} strokeWidth={1.8} color={color} />;
}
