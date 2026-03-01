export const ANIME_DATA = {
  catalogue: [
    { title: "Berserk", type: "Manga", score: 9.5, progress: "376+ Ch", status: "Reading" },
    { title: "Hunter x Hunter (2011)", type: "Anime", score: 10, progress: "148 Eps", status: "Completed" },
    { title: "Fullmetal Alchemist: Brotherhood", type: "Anime", score: 10, progress: "64 Eps", status: "Completed" },
    { title: "Steins;Gate", type: "Anime", score: 10, progress: "24 Eps", status: "Completed" },
    { title: "Vinland Saga Season 2", type: "Anime", score: 10, progress: "24 Eps", status: "Completed" },
    { title: "Monster", type: "Anime", score: 9.5, progress: "74 Eps", status: "Completed" },
    { title: "Vagabond", type: "Manga", score: 10, progress: "327 Ch", status: "Hiatus" },
    { title: "Chainsaw Man", type: "Manga", score: 9, progress: "170+ Ch", status: "Reading" }
  ],
  covers: {
    "Berserk": "https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx30002-79997M9AasY6.png",
    "Hunter x Hunter (2011)": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx11061-s9Pj7zPrAl39.png",
    "Fullmetal Alchemist: Brotherhood": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx5114-K9999M9AasY6.png",
    "Steins;Gate": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx9253-89997M9AasY6.png",
    "Vinland Saga Season 2": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx146175-99997M9AasY6.png",
    "Monster": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx19-99997M9AasY6.png",
    "Vagabond": "https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx30656-99997M9AasY6.png",
    "Chainsaw Man": "https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx105778-99997M9AasY6.png"
  }
};

export const TRACKS = [
  { id: 1, title: "Momentum", artist: "Colin Cherry", duration: "2:45" },
  { id: 2, title: "Static Void", artist: "Colin Cherry", duration: "3:12" }
];

export const GAMING_DATA = {
  steam: { 
    user: "AugustElliott", 
    level: 42, 
    gamesCount: 184 
  },
  retro: { user: "AugustElliott", hardcorePoints: 1200, recentMastery: "Final Fantasy VII" },
  collection: [
    { title: "Fallout: New Vegas", platform: "Steam", playtime: "245h", status: "Mastered", rating: 10, id: 22380 },
    { title: "Clair Obscur: Expedition 33", platform: "Steam", playtime: "45h", status: "Playing", rating: 10, id: 1903340 },
    { title: "Elden Ring", platform: "Steam", playtime: "120h", status: "Playing", rating: 10, id: 1245620 },
    { title: "Cyberpunk 2077", platform: "Steam", playtime: "65h", status: "Completed", rating: 9, id: 1091500 },
    { title: "Sekiro: Shadows Die Twice", platform: "Steam", playtime: "35h", status: "Completed", rating: 9.5, id: 814380 },
    { title: "The Witcher 3: Wild Hunt", platform: "Steam", playtime: "150h", status: "Completed", rating: 10, id: 292030 }
  ],
  covers: {
    "Fallout: New Vegas": "https://cdn.akamai.steamstatic.com/steam/apps/22380/header.jpg",
    "Clair Obscur: Expedition 33": "https://cdn.akamai.steamstatic.com/steam/apps/1903340/header.jpg",
    "Elden Ring": "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg",
    "Cyberpunk 2077": "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg",
    "Sekiro: Shadows Die Twice": "https://cdn.akamai.steamstatic.com/steam/apps/814380/header.jpg",
    "The Witcher 3: Wild Hunt": "https://cdn.akamai.steamstatic.com/steam/apps/292030/header.jpg"
  }
};

export const VST_DETAILS = [
  {
    id: "waves-r",
    name: "Waves Renaissance Bundle",
    category: "Dynamics & Mixing",
    image: "https://static.waves.com/images/products/bundles/renaissance-maxx.jpg",
    link: "https://www.waves.com/bundles/renaissance-maxx",
    blurb: "The quintessential 'musical' processing suite. Includes the legendary R-Vox and R-Compressor.",
    plugins: [
      { name: "R-Vox", desc: "The go-to vocal compressor/gate/limiter.", interface: "https://static.waves.com/images/products/plugins/full/renaissance-vox.jpg" },
      { name: "R-Compressor", desc: "Classic warm compression for any source.", interface: "https://static.waves.com/images/products/plugins/full/renaissance-compressor.jpg" },
      { name: "R-EQ", desc: "Musical and transparent equalization.", interface: "https://static.waves.com/images/products/plugins/full/renaissance-equalizer.jpg" }
    ]
  },
  {
    id: "serum",
    name: "Xfer Records Serum",
    category: "Instruments",
    image: "https://xferrecords.com/product_images/serum_box_large.png",
    link: "https://xferrecords.com/products/serum",
    blurb: "The industry-standard wavetable synthesizer. High-quality sound, visual and creative workflow.",
    plugins: [
      { name: "Serum", desc: "Advanced wavetable synthesis.", interface: "https://xferrecords.com/product_images/serum_main_large.png" }
    ]
  },
  {
    id: "valhalla-super",
    name: "Valhalla Supermassive",
    category: "Reverb & Delay",
    image: "https://valhalladsp.com/wp-content/uploads/2020/05/Supermassive_Main.png",
    link: "https://valhalladsp.com/shop/reverb/valhalla-supermassive/",
    blurb: "Massive echoes, lush reverbs, and strange space-time modulations.",
    plugins: [
      { name: "Supermassive", desc: "The ultimate space machine.", interface: "https://valhalladsp.com/wp-content/uploads/2020/05/Supermassive_Screen.png" }
    ]
  }
];

export const calculateProductionValues = (bpm) => {
  if (bpm <= 0) return {};
  const quarterNote = 60000 / bpm;
  
  return {
    delays: {
      '1/4': {
        straight: Number((quarterNote).toFixed(2)),
        dotted: Number((quarterNote * 1.5).toFixed(2)),
        triplet: Number((quarterNote * 0.66667).toFixed(2))
      },
      '1/8': {
        straight: Number((quarterNote / 2).toFixed(2)),
        dotted: Number((quarterNote / 2 * 1.5).toFixed(2)),
        triplet: Number((quarterNote / 2 * 0.66667).toFixed(2))
      },
      '1/16': {
        straight: Number((quarterNote / 4).toFixed(2)),
        dotted: Number((quarterNote / 4 * 1.5).toFixed(2)),
        triplet: Number((quarterNote / 4 * 0.66667).toFixed(2))
      },
      '1/32': {
        straight: Number((quarterNote / 8).toFixed(2)),
        dotted: Number((quarterNote / 8 * 1.5).toFixed(2)),
        triplet: Number((quarterNote / 8 * 0.66667).toFixed(2))
      }
    },
    reverb: {
      preDelayTightMs: Number((quarterNote / 32).toFixed(2)),
      preDelayLooseMs: Number((quarterNote / 64).toFixed(2)),
      tailDecayMs: Number(((quarterNote * 4) + (quarterNote * 2)).toFixed(2))
    },
    compressor: {
      releaseFastMs: Number((quarterNote / 16).toFixed(2)),
      releaseMediumMs: Number((quarterNote / 8).toFixed(2)),
      releaseSlowMs: Number((quarterNote / 4).toFixed(2)),
      attackSnapMs: Number(((quarterNote / 32) / 2).toFixed(2))
    },
    lfoHz: {
      '1/1': Number((1 / (quarterNote * 4)).toFixed(2)),
      '1/2': Number((1 / (quarterNote * 2)).toFixed(2)),
      '1/4': Number((1 / quarterNote).toFixed(2)),
      '1/8': Number((1 / (quarterNote / 2)).toFixed(2)),
      '1/16': Number((1 / (quarterNote / 4)).toFixed(2)),
      '1/32': Number((1 / (quarterNote / 8)).toFixed(2))
    }
  };
};