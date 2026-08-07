/**
 * Central palette — every color-bearing component pulls from here so the
 * whole app moves together when the palette changes, rather than hunting
 * down hex codes scattered across files.
 *
 * Values match the reference board exactly:
 *   Dark Crimson Leather  #2D0A0F
 *   Warm Metallic Gold    #E6C280
 *   Flame Core            #F05030
 */
export const DARK_LEATHER = "#2D0A0F";
export const DARK_LEATHER_DEEP = "#1A0508"; // near-black edge of the leather gradient
export const HERO_WINE = "#8B1538"; // brighter, richer wine-red — hero only, kept apart from
                                     // DARK_LEATHER so the menu page can stay deliberately darker
export const GOLD = "#E6C280";
export const GOLD_DIM = "#B08A4E"; // lower-contrast gold for secondary text on dark
export const FLAME = "#F05030";
export const CREAM = "#FFF8EE"; // off-white for body copy on dark backgrounds

import { leatherTexture } from "./assets/leatherTexture";

/**
 * The shared "dark leather panel" background used by the menu screen, the
 * category bar, and dish cards. Falls back to a plain dark gradient until
 * leather_background.jpg is dropped into src/assets/ (see leatherTexture.js).
 */
export function leatherBackgroundStyle() {
  return leatherTexture
    ? {
        backgroundImage: `linear-gradient(rgba(20,6,9,0.5), rgba(20,6,9,0.5)), url(${leatherTexture})`,
        backgroundSize: "700px 928px",
        backgroundRepeat: "repeat",
      }
    : { background: `linear-gradient(180deg, ${DARK_LEATHER} 0%, ${DARK_LEATHER_DEEP} 100%)` };
}
