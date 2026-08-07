/**
 * Mirrors the future `categories` table:
 *   id     text/uuid primary key
 *   name   text            -> split into name_ru / name_kz here since the
 *                              menu is bilingual; a real migration can keep
 *                              these as two columns or move them into a
 *                              separate translations table later.
 *   order  int             -> display order in the category rail
 */
export const categories = [
  { id: "signature", name_ru: "Фирменные", name_kz: "Фирмалық", order: 1 },
  { id: "salads", name_ru: "Салаты", name_kz: "Салаттар", order: 2 },
  { id: "soups", name_ru: "Первые блюда", name_kz: "Бірінші тағамдар", order: 3 },
  { id: "mains", name_ru: "Вторые блюда", name_kz: "Екінші тағамдар", order: 4 },
  { id: "lagman", name_ru: "Лагманы", name_kz: "Лағмандар", order: 5 },
  { id: "drinks", name_ru: "Напитки", name_kz: "Сусындар", order: 6 },
];
