import sharp from "sharp";

// Same 10-point star polygon as .nav-logo-icon in shared.css, just expressed
// on a 0-100 viewBox (the CSS uses percentages, so the numbers are identical),
// then scaled/centered to leave adaptive-icon safe-zone padding.
const starPointsPct = [
  [50, 0], [61, 35], [98, 35], [68, 57], [79, 91],
  [50, 70], [21, 91], [32, 57], [2, 35], [39, 35]
];

const SIZE = 1024;
const SCALE = 0.56; // keep the star within the adaptive-icon safe zone
const OFFSET = (1 - SCALE) / 2 * 100; // in the same 0-100 space, centered

const starPoints = starPointsPct
  .map(([x, y]) => [x * SCALE + OFFSET, y * SCALE + OFFSET])
  .map(([x, y]) => `${(x / 100) * SIZE},${(y / 100) * SIZE}`)
  .join(" ");

const svg = `
<svg width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="50%" cy="42%" r="75%">
      <stop offset="0%" stop-color="#1e5c38"/>
      <stop offset="55%" stop-color="#123f2c"/>
      <stop offset="100%" stop-color="#0d2818"/>
    </radialGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f2d488"/>
      <stop offset="45%" stop-color="#e8b84b"/>
      <stop offset="100%" stop-color="#c9963a"/>
    </linearGradient>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#bg)"/>
  <circle cx="${SIZE / 2}" cy="${SIZE / 2}" r="${SIZE * 0.365}" fill="none" stroke="url(#gold)" stroke-width="${SIZE * 0.012}" opacity="0.55"/>
  <circle cx="${SIZE / 2}" cy="${SIZE / 2}" r="${SIZE * 0.335}" fill="none" stroke="url(#gold)" stroke-width="${SIZE * 0.004}" opacity="0.35"/>
  <polygon points="${starPoints}" fill="url(#gold)"/>
</svg>
`;

await sharp(Buffer.from(svg)).png().toFile(process.argv[2]);
console.log("wrote", process.argv[2]);
