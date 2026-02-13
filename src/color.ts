function clampChannel(value: number) {
  if (value < 0) return 0;
  if (value > 255) return 255;
  return Math.round(value);
}

function hexToRgb(hex: string) {
  const normalized = hex.trim().toLowerCase();
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return { r, g, b };
}

function rgbToHex(r: number, g: number, b: number) {
  const toHex = (value: number) => clampChannel(value).toString(16).padStart(2, "0");
  return `${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function lightenHex(hex: string, factor: number) {
  const { r, g, b } = hexToRgb(hex);
  const amount = Math.max(0, Math.min(1, factor));
  const lr = r + (255 - r) * amount;
  const lg = g + (255 - g) * amount;
  const lb = b + (255 - b) * amount;
  return rgbToHex(lr, lg, lb);
}

export function darkenHex(hex: string, factor: number) {
  const { r, g, b } = hexToRgb(hex);
  const amount = Math.max(0, Math.min(1, factor));
  const dr = r * (1 - amount);
  const dg = g * (1 - amount);
  const db = b * (1 - amount);
  return rgbToHex(dr, dg, db);
}


