import { Receipt } from "lucide-react";
import clutchChilli from "../assets/clutchchilli.png";
import logoWord from "../assets/logonew.png";
import underLogo from "../assets/underlogo.png";
import rightUzor from "../assets/right_uzor.png";
import "./hero.css";

export default function Hero({ onScrollToMenu }) {
  return (
    <section className="hero">
      <img
        src={clutchChilli}
        alt=""
        aria-hidden="true"
        className="hero__cluster"
      />

      <div className="hero__smoke hero__smoke--left" aria-hidden="true" />
      <div className="hero__smoke hero__smoke--right" aria-hidden="true" />

      <div className="hero__corner hero__corner--right" aria-hidden="true">
        <img src={clutchChilli} alt="" className="hero__cornerArt hero__cornerArt--desktop" />
        <img src={rightUzor} alt="" className="hero__cornerArt hero__cornerArt--mobile" />
      </div>

      <div className="hero__content">
        <img
          src={logoWord}
          alt="LAZDJI"
          className="hero__logo"
        />

        <p className="hero__tagline">ВКУС ТРАДИЦИИ</p>

        <div className="hero__accentRow" aria-hidden="true">
          <img src={underLogo} alt="" className="hero__underlogoAsset" />
        </div>
      </div>

      <div className="hero__footer">
        <button onClick={onScrollToMenu} className="hero__button">
          <Receipt size={18} strokeWidth={2} />
          <span>СМОТРЕТЬ МЕНЮ</span>
        </button>
      </div>

      <img
        src={clutchChilli}
        alt=""
        aria-hidden="true"
        className="hero__cluster hero__cluster--bottom"
      />
    </section>
  );
}