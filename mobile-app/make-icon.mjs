import sharp from "sharp";

// A book with a bookmark - reads clearly as "education/teachings" at any
// size, without evoking a national flag (crescent+star on green) or a
// sports-crest medallion (ring + star), both tried and rejected earlier.
const GRADIENTS = `
  <radialGradient id="bg" gradientUnits="userSpaceOnUse" cx="50" cy="42" r="75">
    <stop offset="0%" stop-color="#1e5c38"/>
    <stop offset="55%" stop-color="#123f2c"/>
    <stop offset="100%" stop-color="#0d2818"/>
  </radialGradient>
  <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#f2d488"/>
    <stop offset="45%" stop-color="#e8b84b"/>
    <stop offset="100%" stop-color="#c9963a"/>
  </linearGradient>
  <linearGradient id="page" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#fbf3dc"/>
    <stop offset="100%" stop-color="#f2e2b8"/>
  </linearGradient>
`;

function markSVG() {
  return `
    <!-- page-edge sliver, peeking out behind the cover -->
    <rect x="33" y="24" width="34" height="52" rx="2.5" fill="url(#page)"/>
    <!-- book cover -->
    <rect x="27" y="22" width="34" height="52" rx="3" fill="url(#gold)"/>
    <!-- spine shadow -->
    <rect x="27" y="22" width="6" height="52" rx="3" fill="#8a6524" opacity="0.35"/>
    <!-- bookmark ribbon -->
    <path d="M 48 22 L 56 22 L 56 40 L 52 35.5 L 48 40 Z" fill="#123f2c"/>
  `;
}

const SIZE = 1024;
const iconSvg = `
<svg width="${SIZE}" height="${SIZE}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>${GRADIENTS}</defs>
  <rect width="100" height="100" fill="url(#bg)"/>
  ${markSVG()}
</svg>
`;

await sharp(Buffer.from(iconSvg)).resize(SIZE, SIZE).png().toFile(process.argv[2]);
console.log("wrote", process.argv[2]);
