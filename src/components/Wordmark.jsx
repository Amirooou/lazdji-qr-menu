// Измени на имя своего PNG файла логотипа (например, logo-icon.png)
import logoPng from "../assets/logo-icon.png";

export default function Wordmark({ size = 27 }) {
  return (
    <img 
      src={logoPng} 
      alt="LAZDJI" 
      // Укажи здесь width в 2 раза меньше, чем реальный размер файла
      style={{ height: size, width: "160px", objectFit: "contain", display: "block" }} 
    />
  );
}