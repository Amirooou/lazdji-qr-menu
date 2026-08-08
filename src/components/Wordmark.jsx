import logoFile from "../assets/logo-wordmark.svg";

export default function Wordmark({ size = 110, style = {} }) {
  return (
    <img
      src={logoFile}
      alt="LAZDJI"
      style={{
        width: "100%",
        maxWidth: "340px", // Максимальная ширина, чтобы не вылезать за экран телефона
        height: "auto",
        maxHeight: `${size}px`,
        objectFit: "contain",
        display: "block",
        margin: "0 auto", // Железобетонный центр
        ...style,
      }}
    />
  );
}