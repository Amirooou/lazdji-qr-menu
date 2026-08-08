// Измени на имя своего PNG файла логотипа (например, logo-icon.png)
import logoPng from "../assets/logo-wordmark.png";

export default function Wordmark({ size = 32 }) {
  return (
    <img 
      src={logoPng} 
      alt="LAZDJI" 
      // Укажи здесь width в 2 раза меньше, чем реальный размер файла
      style={{ height: size, width: "200px", objectFit: "contain", display: "block" }} 
    />
  );
}