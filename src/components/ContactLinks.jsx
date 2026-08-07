import { Instagram, MessageCircle, Phone } from "lucide-react";
import { contacts } from "../data/contacts";
import MapPinIcon from "./icons/MapPinIcon";
import { GOLD } from "../theme";

const LINKS = [
  { key: "instagram", Icon: Instagram, href: contacts.instagram, label: "Instagram" },
  { key: "whatsapp", Icon: MessageCircle, href: contacts.whatsapp, label: "WhatsApp" },
  { key: "phone", Icon: Phone, href: contacts.phoneHref, label: contacts.phone },
  { key: "twoGis", Icon: MapPinIcon, href: contacts.twoGis, label: "2GIS" },
];

/**
 * The restaurant's contact block — real <a> links (opens the app/dialer),
 * not decorative buttons. Round bronze medallions (no border, per spec) —
 * meant to sit directly on the wood panel, not float in their own box.
 * Update src/data/contacts.js to change the actual numbers/URLs.
 */
export default function ContactLinks({ size = 48, iconSize = 20 }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
      {LINKS.map(({ key, Icon, href, label }) => (
        <a
          key={key}
          href={href}
          target={key === "phone" ? undefined : "_blank"}
          rel="noopener noreferrer"
          aria-label={label}
          style={{
            width: size, height: size, borderRadius: "50%",
            background: "radial-gradient(circle at 35% 30%, #C99A5B 0%, #8C6530 55%, #5E4020 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#2B1A0E", textDecoration: "none",
            boxShadow: "inset 0 1px 1px rgba(255,255,255,0.35), inset 0 -2px 4px rgba(0,0,0,0.4), 0 3px 6px rgba(0,0,0,0.45)",
          }}
        >
          <Icon size={iconSize} strokeWidth={1.8} />
        </a>
      ))}
    </div>
  );
}
