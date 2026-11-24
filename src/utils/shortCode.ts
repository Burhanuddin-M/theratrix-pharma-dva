const TAB_COLORS = ['#4ca7d0', '#e52b1f', '#277ea8', '#c91f16', '#5bb8d9', '#f06a5f'];

/** Derive a short tab code from a product name (e.g. "BI-FOLIM" → "BIF"). */
export function deriveShortCode(name: string): string {
  const cleaned = name.trim().toUpperCase().replace(/[^A-Z0-9\s-]/g, '');
  if (!cleaned) return 'PRD';
  const parts = cleaned.split(/[\s-]+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 3);
  }
  return parts
    .map((p) => p[0])
    .join('')
    .slice(0, 4);
}

export function tabColorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash + name.charCodeAt(i) * (i + 1)) % 997;
  return TAB_COLORS[hash % TAB_COLORS.length];
}

export { TAB_COLORS };
