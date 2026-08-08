import { extras } from "../data/extras";
import { lineUnitPrice, lineTotal } from "./cartMath";

// TODO: replace with the restaurant's real WhatsApp business number
// (digits only, country code, no "+" or spaces — e.g. "77011234567").
export const WHATSAPP_NUMBER = "77024986338";

export const ORDER_TYPES = ["delivery", "pickup", "reservation"];

const ORDER_TYPE_LABELS = {
  ru: {
    delivery: "Доставка",
    pickup: "Самовынос / Предзаказ",
    reservation: "Бронь стола + Предзаказ",
  },
  kz: {
    delivery: "Жеткізу",
    pickup: "Өзі алып кету / Алдын ала тапсырыс",
    reservation: "Үстел брондау + Алдын ала тапсырыс",
  },
};

const GREETING = { ru: "Здравствуйте!", kz: "Сәлеметсіз бе!" };
const ORDER_TYPE_LINE = { ru: "Тип заказа:", kz: "Тапсырыс түрі:" };
const COMPOSITION_LINE = { ru: "Состав заказа:", kz: "Тапсырыс құрамы:" };
const EXTRAS_LABEL = { ru: "Допы", kz: "Қосымша" };
const UNIT_LABEL = { ru: "шт", kz: "дана" };
const TOTAL_LINE = { ru: "Итого:", kz: "Барлығы:" };

/**
 * Builds the plain-text order message sent to the restaurant's WhatsApp.
 * Deliberately plain numbers (no thousand separators) — this is a message
 * body, not on-screen UI, and matches how a person would type it by hand.
 *
 * Example output:
 *   Здравствуйте! Тип заказа: Доставка.
 *   Состав заказа:
 *   1. Чай Ташкентский (Допы: Лимон) - 2 шт x 1390 = 2780 ₸.
 *   2. Лагман - 1 шт x 1500 = 1500 ₸.
 *   Итого: 4280 ₸.
 */
export function generateWhatsAppText(cartItems, orderType, lang = "ru") {
  const typeLabel = ORDER_TYPE_LABELS[lang]?.[orderType] || orderType;

  const lines = cartItems.map((line, i) => {
    const name = lang === "ru" ? line.item.title_ru : line.item.title_kz;

    const portionLabel = line.item.portions?.length
      ? lang === "ru"
        ? line.item.portions[line.portionIdx].title_ru
        : line.item.portions[line.portionIdx].title_kz
      : null;

    const extraNames = line.selectedExtras
      .map((extraId) => extras.find((e) => e.id === extraId))
      .filter(Boolean)
      .map((e) => (lang === "ru" ? e.title_ru : e.title_kz));

    let label = portionLabel ? `${name} — ${portionLabel}` : name;
    if (extraNames.length) label += ` (${EXTRAS_LABEL[lang]}: ${extraNames.join(", ")})`;

    const unit = lineUnitPrice(line);
    const total = lineTotal(line);
    return `${i + 1}. ${label} - ${line.qty} ${UNIT_LABEL[lang]} x ${unit} = ${total} ₸.`;
  });

  const grandTotal = cartItems.reduce((sum, line) => sum + lineTotal(line), 0);

  return [
    `${GREETING[lang]} ${ORDER_TYPE_LINE[lang]} ${typeLabel}.`,
    COMPOSITION_LINE[lang],
    ...lines,
    `${TOTAL_LINE[lang]} ${grandTotal} ₸.`,
  ].join("\n");
}

/** Opens WhatsApp with the order text pre-filled. Caller clears the cart. */
export function sendOrderToWhatsApp(cartItems, orderType, lang = "ru") {
  const text = generateWhatsAppText(cartItems, orderType, lang);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
}
