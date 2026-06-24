/** Deterministic seeded PRNG — mulberry32. Same seed always yields same sequence. */
export type SeededRng = {
  next: () => number;
  nextInt: (maxExclusive: number) => number;
  shuffle: <T>(items: T[]) => T[];
};

function hashSeed(seed: string): number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i += 1) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return (h >>> 0) || 1;
}

export function createSeededRng(seed: string): SeededRng {
  let state = hashSeed(seed);

  function next(): number {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  function nextInt(maxExclusive: number): number {
    return Math.floor(next() * maxExclusive);
  }

  function shuffle<T>(items: T[]): T[] {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = nextInt(i + 1);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  return { next, nextInt, shuffle };
}

export function deriveAssemblySeed(
  baseSeed: string,
  level: string,
  version: string
): string {
  return `${baseSeed}:${level}:${version}`;
}
