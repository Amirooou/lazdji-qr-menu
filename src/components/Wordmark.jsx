import logoFile from "../assets/logoword.png";

export default function Wordmark({ size = 220, style = {} }) {
  return (
    <img
      src={logoFile}
      alt="LAZDJI"
      style={{
  maxWidth: "300px",
  width: "100%",
  height: "auto",
  objectFit: "contain",
  display: "block",
  margin: "0 auto",
  marginTop: "-15px",
  ...style,
}}
    />
  );
}  