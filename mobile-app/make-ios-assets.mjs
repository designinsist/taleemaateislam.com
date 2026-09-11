import sharp from "sharp";
import { mkdir, copyFile } from "node:fs/promises";
import path from "node:path";

// Same book+bookmark mark as make-icon.mjs / make-splash.mjs, generated
// straight into the iOS asset catalog. iOS 14+ uses a single 1024x1024
// "universal" app icon (Xcode scales it down itself) and a single square
// launch image duplicated across the 1x/2x/3x filenames the launch
// storyboard expects - no per-density export needed like Android.

const IOS_DIR = path.join(import.meta.dirname, "ios/App/App/Assets.xcassets");

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
    <rect x="33" y="24" width="34" height="52" rx="2.5" fill="url(#page)"/>
    <rect x="27" y="22" width="34" height="52" rx="3" fill="url(#gold)"/>
    <rect x="27" y="22" width="6" height="52" rx="3" fill="#8a6524" opacity="0.35"/>
    <path d="M 48 22 L 56 22 L 56 40 L 52 35.5 L 48 40 Z" fill="#123f2c"/>
  `;
}

async function makeIcon() {
  const SIZE = 1024;
  const svg = `
    <svg width="${SIZE}" height="${SIZE}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>${GRADIENTS}</defs>
      <rect width="100" height="100" fill="url(#bg)"/>
      ${markSVG()}
    </svg>
  `;
  const dest = path.join(IOS_DIR, "AppIcon.appiconset/AppIcon-512@2x.png");
  // App Store icons must be fully opaque - flatten drops any alpha channel.
  await sharp(Buffer.from(svg)).resize(SIZE, SIZE).flatten({ background: "#0d2818" }).png().toFile(dest);
  console.log("wrote", dest);
}

async function makeSplash() {
  const SIZE = 2732;
  const svg = `
    <svg width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" xmlns="http://www.w3.org/2000/svg">
      <defs>${GRADIENTS.replaceAll('cx="50" cy="42" r="75"', `cx="${SIZE / 2}" cy="${SIZE * 0.42}" r="${SIZE * 0.75}"`).replaceAll("gradientUnits=\"userSpaceOnUse\"", "gradientUnits=\"userSpaceOnUse\"")}</defs>
      <rect width="${SIZE}" height="${SIZE}" fill="url(#bg)"/>
      <g transform="translate(${SIZE / 2 - 47 * (SIZE * 0.34 / 54)}, ${SIZE / 2 - 49 * (SIZE * 0.34 / 54)}) scale(${SIZE * 0.34 / 54})">
        ${markSVG()}
      </g>
    </svg>
  `;
  const dir = path.join(IOS_DIR, "Splash.imageset");
  await mkdir(dir, { recursive: true });
  const base = path.join(dir, "splash-2732x2732-base.png");
  await sharp(Buffer.from(svg)).png().toFile(base);
  await copyFile(base, path.join(dir, "splash-2732x2732.png"));
  await copyFile(base, path.join(dir, "splash-2732x2732-1.png"));
  await copyFile(base, path.join(dir, "splash-2732x2732-2.png"));
  console.log("wrote", dir, "(x3 scale variants)");
}

await makeIcon();
await makeSplash();
