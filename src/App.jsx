import { useState, useEffect, useLayoutEffect, useRef, useMemo } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { AppProvider, useApp } from "./context/AppContext";
import { useMenu } from "./hooks/useMenu";
import Hero from "./components/Hero";
import Header from "./components/Header";
import CategoryBar from "./components/CategoryBar";
import FeaturedDishCard from "./components/FeaturedDishCard";
import MenuItemRow from "./components/MenuItemRow";
import ProductSheet from "./components/ProductSheet";
import CartSheet from "./components/CartSheet";
import FloatingCartBar from "./components/FloatingCartBar";
import Toast from "./components/Toast";
import CategoryIcon from "./components/CategoryIcon";
import ConnectionError from "./components/ConnectionError";
import { leatherBackgroundStyle, GOLD, CREAM } from "./theme";

const FALLBACK_BAR_HEIGHT = 52;

function MenuApp() {
  const { lang, admin, t, orderMode } = useApp();
  const { categories, dishes, loading, error } = useMenu();

  const [activeCat, setActiveCat] = useState(null);
  const [selItem, setSelItem] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [barHeight, setBarHeight] = useState(FALLBACK_BAR_HEIGHT);

  const menuRef = useRef(null);
  const categoryBarRef = useRef(null);

  const visibleCategories = useMemo(
    () => categories.filter((cat) => dishes.some((d) => d.category_id === cat.id)),
    [categories, dishes]
  );

  const dishesByCategory = useMemo(() => {
    const map = {};
    dishes.forEach((dish) => {
      (map[dish.category_id] ||= []).push(dish);
    });
    return map;
  }, [dishes]);

  useEffect(() => {
    if (!activeCat && visibleCategories.length) setActiveCat(visibleCategories[0].id);
  }, [activeCat, visibleCategories]);

  useLayoutEffect(() => {
    const measure = () => {
      if (categoryBarRef.current) setBarHeight(categoryBarRef.current.offsetHeight);
    };
    measure();

    let timer;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(measure, 200);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", onResize);
    };
  }, [visibleCategories.length]);

  useEffect(() => {
    if (!visibleCategories.length) return;
    const lineFromBottom = Math.max(0, window.innerHeight - barHeight - 1);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveCat(entry.target.dataset.section);
        });
      },
      { rootMargin: `-${barHeight}px 0px -${lineFromBottom}px 0px`, threshold: 0 }
    );
    visibleCategories.forEach((cat) => {
      const el = document.getElementById(`section-${cat.id}`);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [barHeight, visibleCategories]);

  const scrollToCategory = (catId) => {
    setActiveCat(catId);
    document.getElementById(`section-${catId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToMenu = () => {
    menuRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={leatherBackgroundStyle()}>
      {/* Hero показываем ВСЕГДА, не дожидаясь загрузки меню */}
      <Hero onScrollToMenu={scrollToMenu} />

      <div ref={menuRef}>
        {/* Состояние ошибки подключения */}
        {error ? (
          <ConnectionError message={error.message} />
        ) : loading ? (
          /* Состояние загрузки блюд под Hero */
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px", color: GOLD }}>
            <Loader2 className="animate-spin" size={28} style={{ marginBottom: 12 }} />
            <span style={{ fontSize: 13, color: CREAM, opacity: 0.8 }}>Загружаем меню LAZDJI...</span>
          </div>
        ) : (
          /* Контент меню */
          <>
            <Header onWaiter={() => setShowWaiter(true)} />
            <CategoryBar ref={categoryBarRef} categories={visibleCategories} active={activeCat} onSelect={scrollToCategory} />

            {admin && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "rgba(240,80,48,0.15)", borderBottom: "1px solid rgba(240,80,48,0.35)", fontSize: 12, fontWeight: 600, color: "#FF8A6B" }}>
                <AlertTriangle size={13} strokeWidth={2} /> {t("adminMode")}
              </div>
            )}

            <div style={{ paddingBottom: 112 }}>
              {visibleCategories.map((cat) => {
                const items = dishesByCategory[cat.id] || [];
                return (
                  <section
                    key={cat.id}
                    id={`section-${cat.id}`}
                    data-section={cat.id}
                    style={{ paddingTop: 4, paddingBottom: 8, scrollMarginTop: barHeight }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px 10px" }}>
                      <CategoryIcon cat={cat.id} size={15} color={GOLD} />
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: CREAM, margin: 0 }}>
                        {lang === "ru" ? cat.name_ru : cat.name_kz}
                      </h3>
                    </div>
                    {cat.id === "signature"
                      ? items.map((d) => <FeaturedDishCard key={d.id} item={d} onTap={setSelItem} />)
                      : items.map((d) => <MenuItemRow key={d.id} item={d} onTap={setSelItem} />)}
                  </section>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Модалки и Корзина */}
      {orderMode !== "in-house" && <FloatingCartBar onTap={() => setShowCart(true)} />}
      {selItem && <ProductSheet item={selItem} onClose={() => setSelItem(null)} />}
      {showCart && orderMode !== "in-house" && <CartSheet onClose={() => setShowCart(false)} />}
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MenuApp />
    </AppProvider>
  );
}