import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

// @capacitor/assets' Android splash generator reuses a single sharp
// pipeline across concurrent Promise.all resize calls, which races and
// stretches non-square outputs (confirmed: a circular test mark came out
// as an ellipse). This script replaces that step entirely: each density
// gets its own sharp instance, sized exactly per Android's resource
// qualifiers, with the mark centered and never stretched.

const RES_DIR = path.join(import.meta.dirname, "android/app/src/main/res");

// [folder, width, height] - matches AndroidAssetTemplates in
// @capacitor/assets/dist/platforms/android/assets.js exactly.
const TARGETS = [
  ["drawable", 320, 480],
  ["drawable-land-ldpi", 320, 240],
  ["drawable-land-mdpi", 480, 320],
  ["drawable-land-hdpi", 800, 480],
  ["drawable-land-xhdpi", 1280, 720],
  ["drawable-land-xxhdpi", 1600, 960],
  ["drawable-land-xxxhdpi", 1920, 1280],
  ["drawable-port-ldpi", 240, 320],
  ["drawable-port-mdpi", 320, 480],
  ["drawable-port-hdpi", 480, 800],
  ["drawable-port-xhdpi", 720, 1280],
  ["drawable-port-xxhdpi", 960, 1600],
  ["drawable-port-xxxhdpi", 1280, 1920],
  ["drawable-night", 320, 240],
  ["drawable-land-night-ldpi", 320, 240],
  ["drawable-land-night-mdpi", 480, 320],
  ["drawable-land-night-hdpi", 800, 480],
  ["drawable-land-night-xhdpi", 1280, 720],
  ["drawable-land-night-xxhdpi", 1600, 960],
  ["drawable-land-night-xxxhdpi", 1920, 1280],
  ["drawable-port-night-ldpi", 240, 320],
  ["drawable-port-night-mdpi", 320, 480],
  ["drawable-port-night-hdpi", 480, 800],
  ["drawable-port-night-xhdpi", 720, 1280],
  ["drawable-port-night-xxhdpi", 960, 1600],
  ["drawable-port-night-xxxhdpi", 1280, 1920],
];

function markSVG() {
  // Same book+bookmark mark as make-icon.mjs, transparent background,
  // in a 0-100 box so it can be scaled to any target size.
  return `
    <rect x="33" y="24" width="34" height="52" rx="2.5" fill="url(#page)"/>
    <rect x="27" y="22" width="34" height="52" rx="3" fill="url(#gold)"/>
    <rect x="27" y="22" width="6" height="52" rx="3" fill="#8a6524" opacity="0.35"/>
    <path d="M 48 22 L 56 22 L 56 40 L 52 35.5 L 48 40 Z" fill="#123f2c"/>
  `;
}

function gradients(w, h) {
  return `
    <radialGradient id="bg" gradientUnits="userSpaceOnUse" cx="${w / 2}" cy="${h * 0.42}" r="${Math.max(w, h) * 0.75}">
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
}

// The mark's actual drawn shapes (book + ribbon) span this box within its
// nominal 0-100 coordinate space - used to center the real content rather
// than the nominal box, which isn't symmetric around (50,50).
const MARK_BOX = { x0: 27, y0: 22, x1: 67, y1: 76 };
const MARK_CX = (MARK_BOX.x0 + MARK_BOX.x1) / 2;
const MARK_CY = (MARK_BOX.y0 + MARK_BOX.y1) / 2;
const MARK_H = MARK_BOX.y1 - MARK_BOX.y0;

async function generateOne(folder, w, h) {
  const short = Math.min(w, h);
  const markHeight = short * 0.34; // mark's tall edge occupies ~34% of the shorter canvas edge
  const scale = markHeight / MARK_H;
  const cx = w / 2, cy = h / 2;
  const svg = `
    <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>${gradients(w, h)}</defs>
      <rect width="${w}" height="${h}" fill="url(#bg)"/>
      <g transform="translate(${cx - MARK_CX * scale}, ${cy - MARK_CY * scale}) scale(${scale})">
        ${markSVG()}
      </g>
    </svg>
  `;
  const dir = path.join(RES_DIR, folder);
  await mkdir(dir, { recursive: true });
  await sharp(Buffer.from(svg)).png().toFile(path.join(dir, "splash.png"));
}

for (const [folder, w, h] of TARGETS) {
  await generateOne(folder, w, h);
  console.log(`wrote ${folder}/splash.png (${w}x${h})`);
}
