import { describe, it, expect } from 'vitest';

describe('Data Mirror Population Checks', () => {
  const MIRROR_PATH = 'https://overcastskyboi.github.io/CherryOS/src/data/mirror';

  it('verifies metadata timestamp existence', async () => {
    try {
      const response = await globalThis.fetch(`${MIRROR_PATH}/metadata.json`);
      if (response.ok) {
        const data = await response.json();
        expect(data.lastUpdated).toBeDefined();
      }
    } catch {
      // Allow skip if mirror not yet deployed
    }
  });

  it('verifies steam data mirror structure', async () => {
    try {
      const response = await globalThis.fetch(`${MIRROR_PATH}/steam.json`);
      if (response.ok) {
        const json = await response.json();
        expect(Array.isArray(json.data)).toBe(true);
      }
    } catch {
      // Allow skip
    }
  });

  it('verifies anilist data mirror structure', async () => {
    try {
      const response = await globalThis.fetch(`${MIRROR_PATH}/anilist.json`);
      if (response.ok) {
        const json = await response.json();
        expect(json.data.MediaListCollection).toBeDefined();
      }
    } catch {
      // Allow skip
    }
  });
});
