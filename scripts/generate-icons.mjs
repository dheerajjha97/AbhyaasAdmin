import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Table for CRC32
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const crcData = Buffer.concat([typeBuf, data]);
  const crc = crc32(crcData);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc, 0);

  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function generatePng(width, height, pixelShader) {
  // Signature
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // bit depth 8
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10);
  ihdrData.writeUInt8(0, 11);
  ihdrData.writeUInt8(0, 12);
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Raw scanlines: each line starts with filter byte 0
  const rowBytes = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowBytes);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes;
    rawData[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixelShader(x, y, width, height);
      const pixelOffset = rowOffset + 1 + x * 4;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData, { level: 9 });
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

// Ensure public directory exists
const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// App Theme Colors: Indigo (#4338ca -> #6366f1) + Gold Sparkle (#fbbf24)
function renderIcon(isMaskable = false) {
  return (x, y, w, h) => {
    const nx = (x / w) * 2 - 1; // -1 to +1
    const ny = (y / h) * 2 - 1;
    const distCenter = Math.sqrt(nx * nx + ny * ny);

    // Background: Gradient from deep indigo-800 to indigo-600
    // Corner rounding for regular icons (radius ~ 22% of dimension)
    let alpha = 255;
    if (!isMaskable) {
      // Rounded rectangle test (squircle)
      const absX = Math.abs(nx);
      const absY = Math.abs(ny);
      const rCorner = 0.35;
      const ox = Math.max(0, absX - (1 - rCorner));
      const oy = Math.max(0, absY - (1 - rCorner));
      const cornerDist = Math.sqrt(ox * ox + oy * oy);
      if (cornerDist > rCorner) {
        alpha = 0;
      }
    }

    if (alpha === 0) return [0, 0, 0, 0];

    // Background gradient:
    // Top-left: #4f46e5 (79, 70, 229), Bottom-right: #312e81 (49, 46, 129)
    const t = (nx + ny + 2) / 4;
    let r = Math.round(49 + t * 45);
    let g = Math.round(46 + t * 45);
    let b = Math.round(129 + t * 115);

    // Scaling factor for safe zone if maskable
    const scale = isMaskable ? 0.65 : 0.8;
    const sx = nx / scale;
    const sy = ny / scale;

    // Draw stylized "A" + Sparkle Star
    // 1. Central Diamond / 4-point Sparkle Star
    const starDistX = Math.abs(sx);
    const starDistY = Math.abs(sy + 0.05);
    const starAstroid = Math.pow(starDistX, 0.6) + Math.pow(starDistY, 0.6);
    
    // Sparkle core at the top right
    const spX = Math.abs(sx - 0.35);
    const spY = Math.abs(sy + 0.38);
    const sparkleCore = Math.pow(spX, 0.5) + Math.pow(spY, 0.5);

    if (sparkleCore < 0.28) {
      // Golden sparkle star
      return [251, 191, 36, 255]; // Amber 400
    }

    // Modern Academic Cap / Open Book Shape
    // Let's create an "A" monogram with white & gold accents
    // Triangular outer of A:
    const aY = sy + 0.1;
    const aX = Math.abs(sx);
    const inA = (aY >= -0.55 && aY <= 0.55 && aX <= (0.55 - aY * 0.45));
    const inInnerA = (aY >= -0.15 && aY <= 0.35 && aX <= (0.28 - aY * 0.35));
    const inCrossbar = (aY >= 0.12 && aY <= 0.26 && aX <= 0.45);

    if (inA && (!inInnerA || inCrossbar)) {
      // Pure White or slight gradient
      return [255, 255, 255, 255];
    }

    // Subtle bottom glow
    if (distCenter < 0.85) {
      const glow = Math.max(0, 1 - distCenter * 1.1) * 35;
      r = Math.min(255, r + glow * 0.6);
      g = Math.min(255, g + glow * 0.5);
      b = Math.min(255, b + glow);
    }

    return [r, g, b, alpha];
  };
}

// Generate files
const pwa192 = generatePng(192, 192, renderIcon(false));
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), pwa192);
console.log('Created pwa-192x192.png');

const pwa512 = generatePng(512, 512, renderIcon(false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), pwa512);
console.log('Created pwa-512x512.png');

const pwaMaskable512 = generatePng(512, 512, renderIcon(true));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), pwaMaskable512);
console.log('Created pwa-maskable-512x512.png');

const appleTouchIcon = generatePng(180, 180, renderIcon(false));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleTouchIcon);
console.log('Created apple-touch-icon.png');

// Also create favicon.ico as a copy of 192 or 180
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), pwa192);
console.log('Created favicon.ico');

// Create high quality SVG icon for desktop browser tabs
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4f46e5" />
      <stop offset="50%" stop-color="#4338ca" />
      <stop offset="100%" stop-color="#312e81" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#4f46e5" flood-opacity="0.4" />
    </filter>
  </defs>
  <!-- Background with smooth rounded corners -->
  <rect width="512" height="512" rx="115" fill="url(#bgGrad)" />
  
  <!-- Subtle decorative ring -->
  <circle cx="256" cy="256" r="180" stroke="#818cf8" stroke-width="3" stroke-opacity="0.25" stroke-dasharray="8 8" />

  <!-- Stylized "A" + Graduation Portal Motif -->
  <path d="M256 100 L380 370 H310 L285 305 H227 L202 370 H132 Z M256 220 L240 265 H272 Z" fill="#ffffff" filter="url(#glow)" />
  
  <!-- Golden Achievement Sparkle -->
  <path d="M375 125 C375 145 385 155 405 155 C385 155 375 165 375 185 C375 165 365 155 345 155 C365 155 375 145 375 125 Z" fill="url(#goldGrad)" />
  <circle cx="405" cy="195" r="7" fill="#fde047" opacity="0.9" />
  
  <!-- Small Star at bottom left -->
  <path d="M125 330 C125 340 130 345 140 345 C130 345 125 350 125 360 C125 350 120 345 110 345 C120 345 125 340 125 330 Z" fill="url(#goldGrad)" opacity="0.8" />
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent, 'utf-8');
console.log('Created icon.svg');
