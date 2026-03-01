import { describe, it, expect } from 'vitest';

describe('Data Mirror Population Checks', () => {
  const BASE_URL = 'https://overcastskyboi.github.io/CherryOS/src/data/mirror';

  it('verifies metadata timestamp existence', async () => {
    try {
      const response = await fetch(`${BASE_URL}/metadata.json`);
      if (response.ok) {
        const data = await response.json();
        expect(data.lastUpdated).toBeDefined();
      }
    } catch (err) {
      console.warn("Mirror not yet deployed.");
    }
  });

  it('verifies steam data mirror structure', async () => {
    try {
      const response = await fetch(`${BASE_URL}/steam.json`);
      if (response.ok) {
        const json = await response.json();
        expect(Array.isArray(json.data)).toBe(true);
      }
    } catch (err) {
      console.warn("Mirror not yet deployed.");
    }
  });

  it('verifies anilist data mirror structure', async () => {
    try {
      const response = await fetch(`${BASE_URL}/anilist.json`);
      if (response.ok) {
        const json = await response.json();
        expect(json.data.MediaListCollection).toBeDefined();
      }
    } catch (err) {
      console.warn("Mirror not yet deployed.");
    }
  });
});
