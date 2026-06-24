import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { goldMockImageOutputPath } from "./gold-mock-image-paths.mjs";

function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function slugFromPath(src) {
  const base = src.split("/").pop() ?? "scene";
  return base.replace(/\.(png|svg)$/i, "");
}

function humanizeSlug(slug) {
  return slug
    .replace(/^(sgm|mgm|fgm|sgm2|sgm3|mgm2|mgm3|fgm2|fgm3|ket|pet)-?\d+-?/i, "")
    .replace(/^story-\d+-?/i, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function keywordsFromSlug(slug) {
  return slug.toLowerCase().split("-").filter(Boolean);
}

function pickPalette(keywords) {
  const palettes = [
    { sky: "#B8E6FF", ground: "#95D86E", accent: "#FF8C42", accent2: "#FFD166" },
    { sky: "#D9F2FF", ground: "#87CEAC", accent: "#6C63FF", accent2: "#FFB703" },
    { sky: "#FFE8CC", ground: "#C9E4CA", accent: "#E07A5F", accent2: "#3D405B" },
    { sky: "#E0F7FA", ground: "#A5D6A7", accent: "#FF7043", accent2: "#5C6BC0" },
  ];
  const hash = keywords.reduce((sum, word) => sum + word.charCodeAt(0), 0);
  return palettes[hash % palettes.length];
}

function drawSun(x, y, color) {
  return `
    <circle cx="${x}" cy="${y}" r="28" fill="${color}" opacity="0.95"/>
    <g stroke="${color}" stroke-width="4" stroke-linecap="round">
      ${[0, 45, 90, 135, 180, 225, 270, 315]
        .map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = x + Math.cos(rad) * 36;
          const y1 = y + Math.sin(rad) * 36;
          const x2 = x + Math.cos(rad) * 48;
          const y2 = y + Math.sin(rad) * 48;
          return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
        })
        .join("")}
    </g>`;
}

function drawCloud(x, y) {
  return `
    <g fill="#fff" opacity="0.95">
      <ellipse cx="${x}" cy="${y}" rx="34" ry="18"/>
      <ellipse cx="${x - 22}" cy="${y + 4}" rx="20" ry="14"/>
      <ellipse cx="${x + 24}" cy="${y + 6}" rx="24" ry="16"/>
    </g>`;
}

function drawPerson(x, y, scale, shirt, pants, label) {
  const s = scale;
  return `
    <g transform="translate(${x}, ${y}) scale(${s})">
      <circle cx="0" cy="-34" r="12" fill="#F4C095"/>
      <rect x="-11" y="-22" width="22" height="26" rx="8" fill="${shirt}"/>
      <rect x="-9" y="4" width="8" height="22" rx="4" fill="${pants}"/>
      <rect x="1" y="4" width="8" height="22" rx="4" fill="${pants}"/>
      ${label ? `<text x="0" y="38" text-anchor="middle" font-size="11" fill="#334">${escapeXml(label)}</text>` : ""}
    </g>`;
}

function drawTree(x, y, scale = 1) {
  return `
    <g transform="translate(${x}, ${y}) scale(${scale})">
      <rect x="-4" y="0" width="8" height="24" fill="#8D6E63"/>
      <circle cx="0" cy="-8" r="22" fill="#43A047"/>
      <circle cx="-14" cy="0" r="16" fill="#66BB6A"/>
      <circle cx="14" cy="0" r="16" fill="#66BB6A"/>
    </g>`;
}

function drawHouse(x, y, scale = 1, color = "#FF8C42") {
  return `
    <g transform="translate(${x}, ${y}) scale(${scale})">
      <rect x="-28" y="-10" width="56" height="42" fill="#FFF8E7" stroke="#5D4037" stroke-width="2"/>
      <polygon points="-34,-10 0,-38 34,-10" fill="${color}"/>
      <rect x="-8" y="8" width="16" height="24" fill="#6D4C41"/>
      <rect x="12" y="-2" width="12" height="12" fill="#81D4FA"/>
    </g>`;
}

function drawTable(x, y) {
  return `
    <g transform="translate(${x}, ${y})">
      <rect x="-36" y="-8" width="72" height="8" rx="3" fill="#A1887F"/>
      <rect x="-30" y="0" width="6" height="24" fill="#8D6E63"/>
      <rect x="24" y="0" width="6" height="24" fill="#8D6E63"/>
      <circle cx="-18" cy="-14" r="8" fill="#EF5350"/>
      <circle cx="0" cy="-14" r="8" fill="#FFCA28"/>
      <circle cx="18" cy="-14" r="8" fill="#66BB6A"/>
    </g>`;
}

function drawAnimal(type, x, y) {
  if (type.includes("cat")) {
    return `
      <g transform="translate(${x}, ${y})">
        <ellipse cx="0" cy="8" rx="22" ry="14" fill="#FFB74D"/>
        <circle cx="0" cy="-8" r="14" fill="#FFB74D"/>
        <polygon points="-10,-22 -4,-14 -12,-12" fill="#FFB74D"/>
        <polygon points="10,-22 4,-14 12,-12" fill="#FFB74D"/>
        <circle cx="-4" cy="-10" r="2" fill="#333"/>
        <circle cx="4" cy="-10" r="2" fill="#333"/>
      </g>`;
  }
  if (type.includes("dog")) {
    return `
      <g transform="translate(${x}, ${y})">
        <ellipse cx="0" cy="10" rx="24" ry="15" fill="#A1887F"/>
        <circle cx="0" cy="-6" r="15" fill="#A1887F"/>
        <ellipse cx="-16" cy="-2" rx="8" ry="12" fill="#8D6E63"/>
        <ellipse cx="16" cy="-2" rx="8" ry="12" fill="#8D6E63"/>
      </g>`;
  }
  if (type.includes("giraffe") || type.includes("duck")) {
    return drawAnimal(type.includes("giraffe") ? "cat" : "dog", x, y);
  }
  return drawAnimal("cat", x, y);
}

function sceneDecorations(keywords, palette, width, groundY) {
  let svg = drawSun(width - 70, 55, palette.accent2);
  svg += drawCloud(90, 60);
  svg += drawCloud(width - 150, 85);
  svg += `<rect x="0" y="${groundY}" width="${width}" height="${360 - groundY}" fill="${palette.ground}"/>`;

  if (keywords.some((k) => ["kitchen", "room", "classroom", "lab", "office", "hall"].includes(k))) {
    svg += `<rect x="0" y="0" width="${width}" height="${groundY}" fill="${palette.sky}"/>`;
    svg += `<rect x="40" y="40" width="${width - 80}" height="${groundY - 40}" fill="#FFF8E7" stroke="#BCAAA4" stroke-width="3" rx="8"/>`;
    svg += drawTable(width / 2, groundY - 10);
    svg += drawPerson(width / 2 - 60, groundY - 8, 1.1, palette.accent, "#455A64", "Person");
    svg += drawPerson(width / 2 + 60, groundY - 8, 1, palette.accent2, "#37474F", "");
    return svg;
  }

  if (keywords.some((k) => ["park", "garden", "playground", "street", "beach", "harbour", "market"].includes(k))) {
    svg += `<rect x="0" y="0" width="${width}" height="${groundY}" fill="${palette.sky}"/>`;
    svg += drawTree(80, groundY, 1.1);
    svg += drawTree(width - 90, groundY, 0.95);
    svg += drawPerson(width / 2 - 40, groundY - 6, 1.15, palette.accent, "#3949AB", "Child");
    svg += drawPerson(width / 2 + 50, groundY - 6, 1, palette.accent2, "#5D4037", "Friend");
    if (keywords.includes("beach")) {
      svg += `<ellipse cx="${width / 2}" cy="${groundY + 18}" rx="120" ry="16" fill="#FFE082"/>`;
    }
    return svg;
  }

  if (keywords.some((k) => ["airport", "train", "transport", "car"].includes(k))) {
    svg += `<rect x="0" y="0" width="${width}" height="${groundY}" fill="${palette.sky}"/>`;
    svg += `<rect x="120" y="${groundY - 50}" width="160" height="36" rx="10" fill="${palette.accent}"/>`;
    svg += `<circle cx="150" cy="${groundY - 8}" r="14" fill="#333"/><circle cx="250" cy="${groundY - 8}" r="14" fill="#333"/>`;
    svg += drawPerson(420, groundY - 6, 1.1, palette.accent2, "#37474F", "Family");
    return svg;
  }

  if (keywords.some((k) => ["football", "sport", "swimming", "pool"].includes(k))) {
    svg += `<rect x="0" y="0" width="${width}" height="${groundY}" fill="${palette.sky}"/>`;
    if (keywords.includes("pool") || keywords.includes("swimming")) {
      svg += `<rect x="180" y="${groundY - 40}" width="280" height="40" fill="#4FC3F7" rx="8"/>`;
    } else {
      svg += `<circle cx="${width / 2}" cy="${groundY - 20}" r="18" fill="#fff" stroke="#333" stroke-width="2"/>`;
    }
    svg += drawPerson(width / 2, groundY - 6, 1.2, palette.accent, "#283593", "Player");
    return svg;
  }

  if (keywords.some((k) => ["cat", "dog", "duck", "giraffe", "animal", "pet"].includes(k))) {
    svg += `<rect x="0" y="0" width="${width}" height="${groundY}" fill="${palette.sky}"/>`;
    svg += drawHouse(width / 2 + 80, groundY - 8, 0.9, palette.accent);
    svg += drawAnimal(keywords.find((k) => ["cat", "dog", "duck", "giraffe"].includes(k)) ?? "cat", width / 2 - 40, groundY - 20);
    return svg;
  }

  svg += `<rect x="0" y="0" width="${width}" height="${groundY}" fill="${palette.sky}"/>`;
  svg += drawHouse(width / 2, groundY - 10, 1, palette.accent);
  svg += drawTree(100, groundY, 1);
  svg += drawPerson(width / 2 + 90, groundY - 6, 1, palette.accent2, "#455A64", "");
  return svg;
}

function frame(width, height, title, subtitle, inner, badge) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F7FBFF"/>
      <stop offset="100%" stop-color="#EEF5FF"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect x="8" y="8" width="${width - 16}" height="${height - 16}" rx="16" fill="#fff" stroke="#F4B942" stroke-width="4"/>
  ${inner}
  ${badge ? `<rect x="24" y="20" width="${badge.length * 8 + 24}" height="28" rx="14" fill="#F4B942"/><text x="36" y="40" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="#5D4037">${escapeXml(badge)}</text>` : ""}
  <text x="${width / 2}" y="34" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#1A237E">${escapeXml(title)}</text>
  <text x="${width / 2}" y="${height - 18}" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#546E7A">${escapeXml(subtitle.slice(0, 90))}${subtitle.length > 90 ? "…" : ""}</text>
</svg>`;
}

function buildSceneSvg(src, meta) {
  const slug = slugFromPath(src);
  const keywords = keywordsFromSlug(slug);
  const palette = pickPalette(keywords);
  const title = humanizeSlug(slug) || "Picture";
  const subtitle = meta.prompt ?? meta.questionText ?? title;
  const groundY = 250;
  const inner = sceneDecorations(keywords, palette, 640, groundY);
  return frame(640, 360, title, subtitle, inner, null);
}

function buildPairSvg(src, meta) {
  const slug = slugFromPath(src);
  const keywords = keywordsFromSlug(slug);
  const palette = pickPalette(keywords);
  const title = humanizeSlug(slug) || "Choose the picture";
  const subtitle = meta.prompt ?? meta.questionText ?? title;
  const panel = (offsetX, label) => {
    const inner = sceneDecorations(keywords, palette, 300, 220);
    return `
      <g transform="translate(${offsetX}, 52)">
        <rect x="0" y="0" width="300" height="250" rx="12" fill="#FAFAFA" stroke="#CFD8DC" stroke-width="2"/>
        <svg x="0" y="0" width="300" height="250" viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice">${inner}</svg>
        <text x="150" y="236" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" font-weight="700" fill="#37474F">${escapeXml(label)}</text>
      </g>`;
  };
  const inner = panel(24, "Picture A") + panel(316, "Picture B");
  return frame(640, 360, title, subtitle, inner, "A / B");
}

function buildStorySvg(src, meta) {
  const slug = slugFromPath(src);
  const keywords = keywordsFromSlug(slug);
  const palette = pickPalette(keywords);
  const title = humanizeSlug(slug) || `Story part ${meta.panelIndex ?? 1}`;
  const subtitle = meta.prompt ?? meta.questionText ?? title;
  const badge = meta.panelIndex ? `Part ${meta.panelIndex}/${meta.panelTotal ?? "?"}` : null;
  const inner = sceneDecorations(keywords, palette, 640, 255);
  return frame(640, 360, title, subtitle, inner, badge);
}

function buildPhotoSvg(src, meta) {
  const slug = slugFromPath(src);
  const keywords = keywordsFromSlug(slug);
  const palette = pickPalette(keywords);
  const title = "Speaking photo";
  const subtitle = meta.prompt ?? meta.questionText ?? "Describe the picture.";
  const scene = sceneDecorations(keywords, palette, 560, 230);
  const inner = `
    <rect x="40" y="48" width="560" height="280" rx="12" fill="#263238"/>
    <svg x="48" y="56" width="544" height="264" viewBox="0 0 640 360">${scene}</svg>`;
  return frame(640, 360, title, subtitle, inner, "Photo");
}

function buildComicSvg(src, meta) {
  const slug = slugFromPath(src);
  const keywords = keywordsFromSlug(slug);
  const palette = pickPalette(keywords);
  const title = humanizeSlug(slug) || "Story";
  const subtitle = meta.prompt ?? meta.questionText ?? title;
  const panels = [1, 2, 3, 4].map((n, index) => {
    const x = 24 + (index % 2) * 300;
    const y = 56 + Math.floor(index / 2) * 132;
    const mini = sceneDecorations([...keywords, `part${n}`], palette, 280, 110);
    return `
      <g transform="translate(${x}, ${y})">
        <rect width="280" height="120" rx="10" fill="#fff" stroke="#CFD8DC" stroke-width="2"/>
        <svg width="280" height="120" viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice">${mini}</svg>
        <text x="14" y="18" font-family="Arial, sans-serif" font-size="12" font-weight="700" fill="#3949AB">${n}</text>
      </g>`;
  });
  return frame(640, 360, title, subtitle, panels.join(""), "Story");
}

export function renderGoldMockImageSvg(src, meta = {}) {
  const variant = meta.variant ?? "scene";
  switch (variant) {
    case "pair":
      return buildPairSvg(src, meta);
    case "story":
      return buildStorySvg(src, meta);
    case "photo":
      return buildPhotoSvg(src, meta);
    case "comic":
      return buildComicSvg(src, meta);
    default:
      return buildSceneSvg(src, meta);
  }
}

export function writeGoldMockImageSvg(publicRoot, src, meta = {}) {
  const relPath = goldMockImageOutputPath(src);
  const filePath = `${publicRoot}/${relPath}`.replace(/\\/g, "/");
  mkdirSync(dirname(filePath), { recursive: true });
  const svg = renderGoldMockImageSvg(src, meta);
  writeFileSync(filePath, svg, "utf8");
  return { filePath, relPath, bytes: Buffer.byteLength(svg, "utf8") };
}
