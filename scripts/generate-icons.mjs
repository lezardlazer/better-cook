import sharp from "sharp";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "public", "icons");

const INK = "#14110F";
const YELLOW = "#FFD53D";

function bowlGlyph({ stroke }) {
  return `
    <path d="M 96 256 Q 96 380 256 380 Q 416 380 416 256 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="${stroke}" stroke-linejoin="round"/>
    <ellipse cx="256" cy="256" rx="160" ry="26" fill="#FFFFFF" stroke="${INK}" stroke-width="${stroke}"/>
    <path d="M 202 176 Q 190 146 212 124 Q 234 102 212 78" stroke="${INK}" stroke-width="${stroke - 3}" fill="none" stroke-linecap="round"/>
    <path d="M 256 176 Q 244 146 266 124 Q 288 102 266 78" stroke="${INK}" stroke-width="${stroke - 3}" fill="none" stroke-linecap="round"/>
    <path d="M 310 176 Q 298 146 320 124 Q 342 102 320 78" stroke="${INK}" stroke-width="${stroke - 3}" fill="none" stroke-linecap="round"/>
  `;
}

const iconSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect x="8" y="8" width="496" height="496" rx="96" fill="${YELLOW}" stroke="${INK}" stroke-width="16"/>
  ${bowlGlyph({ stroke: 16 })}
</svg>`;

const maskableSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="${YELLOW}"/>
  <g transform="translate(56 56) scale(0.78)">
    ${bowlGlyph({ stroke: 18 })}
  </g>
</svg>`;

const appleTouchSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="${YELLOW}"/>
  ${bowlGlyph({ stroke: 16 })}
</svg>`;

const faviconSvg = `
<svg width="64" height="64" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="${YELLOW}"/>
  ${bowlGlyph({ stroke: 22 })}
</svg>`;

async function render(svg, size, filename) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(path.join(OUT_DIR, filename));
  console.log(`wrote ${filename}`);
}

await render(iconSvg, 192, "icon-192.png");
await render(iconSvg, 512, "icon-512.png");
await render(maskableSvg, 192, "icon-maskable-192.png");
await render(maskableSvg, 512, "icon-maskable-512.png");
await render(appleTouchSvg, 180, "apple-touch-icon.png");
await render(faviconSvg, 32, "favicon-32.png");
