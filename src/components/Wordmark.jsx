import logoSvg from "../assets/logo-wordmark.svg";

export default function Wordmark({ size = 27 }) {
  return (
    <img 
      src={logoSvg} 
      alt="LAZDJI" 
      style={{ height: size, width: "auto", display: "block" }} 
    />
  );
}