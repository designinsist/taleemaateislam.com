import sharp from "sharp";

// Play Store feature graphic: exactly 1024x500.
const W = 1024, H = 500;

const GRADIENTS = `
  <radialGradient id="bg" gradientUnits="userSpaceOnUse" cx="${W * 0.28}" cy="${H * 0.5}" r="${W * 0.65}">
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

function bookMark(cx, cy, s) {
  return `
    <g transform="translate(${cx - 20 * s}, ${cy - 27 * s}) scale(${s})">
      <rect x="33" y="24" width="34" height="52" rx="2.5" fill="url(#page)"/>
      <rect x="27" y="22" width="34" height="52" rx="3" fill="url(#gold)"/>
      <rect x="27" y="22" width="6" height="52" rx="3" fill="#8a6524" opacity="0.35"/>
      <path d="M 48 22 L 56 22 L 56 40 L 52 35.5 L 48 40 Z" fill="#123f2c"/>
    </g>
  `;
}

const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>${GRADIENTS}</defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <path d="M 0 ${H} L 0 ${H * 0.15} Q ${W * 0.35} ${H * -0.1} ${W} ${H * 0.35} L ${W} ${H} Z" fill="rgba(255,255,255,0.03)"/>
  ${bookMark(150, H / 2, 3.6)}
  <text x="330" y="${H / 2 - 18}" font-family="Georgia, 'Playfair Display', serif" font-size="58" font-weight="700" fill="url(#gold)">Taleemaat-e-Islam</text>
  <text x="330" y="${H / 2 + 34}" font-family="Georgia, sans-serif" font-size="24" fill="rgba(255,255,255,0.78)" letter-spacing="0.5">Quran &#183; Dars &#183; Prayer Times &#183; Free Islamic Books</text>
</svg>
`;

await sharp(Buffer.from(svg)).resize(W, H).png().toFile(process.argv[2] || "play-store-feature-graphic.png");
console.log("wrote feature graphic");
