import logoFile from "../assets/logo-wordmark.svg";
// ⚠️ Проверьте в VS Code папку src/assets/ — если у вас файл называется
// logo-wordmark.svg, а не .png, поменяйте расширение в строке импорта выше
// на то, что реально лежит в папке. Иначе сборка не найдёт файл.

export default function Wordmark({ size = 32 }) {
  return (
    <img
      src={logoFile}
      alt="LAZDJI"
      style={{ height: size, width: "auto", objectFit: "contain", display: "block" }}
    />
  );
}