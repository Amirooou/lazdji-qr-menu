import logoFile from "../assets/logo-wordmark.svg";

export default function Wordmark({ size = 220, style = {} }) {
  return (
    <img
      src={logoFile}
      alt="LAZDJI"
      style={{
        width: "100%",
        maxWidth: typeof size === "number" ? `${size}px` : size,
        height: "auto",
        objectFit: "contain",
        display: "block",
        margin: "0 auto",
        ...style,
      }}
    />
  );
}