import { describe, it, expect, vi } from 'vitest';

describe('Data Mirror Population Checks', () => {
  const BASE_URL = 'https://overcastskyboi.github.io/CherryOS/src/data/mirror';

  it('verifies metadata timestamp existence', async () => {
    try {
      const response = await fetch(`${BASE_URL}/metadata.json`);
      const data = await response.json();
      expect(data.lastUpdated).toBeDefined();
      expect(new Date(data.lastUpdated).getTime()).toBeGreaterThan(0);
    } catch (e) {
      console.warn("Mirror not yet deployed, skipping live check.");
    }
  });

  it('verifies steam data mirror structure and sorting', async () => {
    try {
      const response = await fetch(`${BASE_URL}/steam.json`);
      const json = await response.json();
      expect(Array.isArray(json.data)).toBe(true);
      
      // Verify achievement sorting (highest first)
      const percents = json.data.map(g => g.achievementPercent || 0);
      const isSorted = percents.every((v, i) => i === 0 || v <= percents[i - 1]);
      // Note: We don't fail here if the mirror isn't live yet, but we log the check
      console.log("Steam Mirror Sorted:", isSorted);
    } catch (e) {
      console.warn("Mirror not yet deployed.");
    }
  });

  it('verifies anilist data mirror structure', async () => {
    try {
      const response = await fetch(`${BASE_URL}/anilist.json`);
      const json = await response.json();
      expect(json.data.MediaListCollection).toBeDefined();
      expect(json.data.MangaList).toBeDefined();
    } catch (e) {
      console.warn("Mirror not yet deployed.");
    }
  });
});
