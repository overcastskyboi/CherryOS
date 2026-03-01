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
    "Berserk": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop",
    "Hunter x Hunter (2011)": "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1000&auto=format&fit=crop",
    "Fullmetal Alchemist: Brotherhood": "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=1000&auto=format&fit=crop",
    "Steins;Gate": "https://images.unsplash.com/photo-1501139083538-0139583c060f?q=80&w=1000&auto=format&fit=crop",
    "Vinland Saga Season 2": "https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?q=80&w=1000&auto=format&fit=crop",
    "Monster": "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=1000&auto=format&fit=crop",
    "Vagabond": "https://images.unsplash.com/photo-1524413845077-123b6637130a?q=80&w=1000&auto=format&fit=crop",
    "Chainsaw Man": "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?q=80&w=1000&auto=format&fit=crop"
  }
};

export const TRACKS = [
  { id: 1, title: "Momentum", artist: "Colin Cherry", duration: "2:45" },
  { id: 2, title: "Static Void", artist: "Colin Cherry", duration: "3:12" }
];

export const GAMING_DATA = {
  steam: { user: "AugustElliott", level: 42, gamesCount: 184 },
  retro: { user: "AugustElliott", hardcorePoints: 1200, recentMastery: "Final Fantasy VII" },
  collection: [
    { title: "Fallout: New Vegas", platform: "Steam", playtime: "245h", status: "Mastered", rating: 10 },
    { title: "Clair Obscur: Expedition 33", platform: "Steam", playtime: "45h", status: "Playing", rating: 10 },
    { title: "Final Fantasy VII", platform: "Retro", playtime: "84h", status: "Mastered", rating: 10 },
    { title: "Elden Ring", platform: "Steam", playtime: "120h", status: "Playing", rating: 10 },
    { title: "Metal Gear Solid", platform: "Retro", playtime: "20h", status: "Completed", rating: 9.5 },
    { title: "Silent Hill 2", platform: "Retro", playtime: "12h", status: "Completed", rating: 10 },
    { title: "Cyberpunk 2077", platform: "Steam", playtime: "65h", status: "Completed", rating: 9 },
    { title: "Bloodborne", platform: "PS4", playtime: "45h", status: "Mastered", rating: 10 }
  ],
  covers: {
    "Fallout: New Vegas": "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop",
    "Clair Obscur: Expedition 33": "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop",
    "Final Fantasy VII": "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop",
    "Elden Ring": "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=1000&auto=format&fit=crop",
    "Metal Gear Solid": "https://images.unsplash.com/photo-1585338107529-13afc5f02586?q=80&w=1000&auto=format&fit=crop",
    "Silent Hill 2": "https://images.unsplash.com/photo-1505630285033-a37d80568c08?q=80&w=1000&auto=format&fit=crop",
    "Cyberpunk 2077": "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=1000&auto=format&fit=crop",
    "Bloodborne": "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1000&auto=format&fit=crop"
  }
};

export const VST_LIST = {
  "Dynamics & Mixing": [
    "Waves Renaissance Bundle",
    "Kilohearts Essentials",
    "Tokyo Dawn Labs TDR Nova",
    "Soothe2",
    "TBProAudio Bundle"
  ],
  "Reverb & Delay": [
    "Valhalla Supermassive",
    "Valhalla Delay",
    "Valhalla VintageVerb"
  ],
  "Instruments": [
    "Xfer Serum",
    "Spitfire LABS"
  ]
};

export const VST_DETAILS = [
  {
    id: "waves-r",
    name: "Waves Renaissance Bundle",
    category: "Dynamics & Mixing",
    image: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?q=80&w=1000&auto=format&fit=crop",
    link: "https://www.waves.com/bundles/renaissance-maxx",
    blurb: "The quintessential 'musical' processing suite. Includes the legendary R-Vox and R-Compressor.",
    plugins: [
      { name: "R-Vox", desc: "The go-to vocal compressor/gate/limiter.", interface: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?q=80&w=800&auto=format&fit=crop" },
      { name: "R-Compressor", desc: "Classic warm compression for any source.", interface: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop" },
      { name: "R-Axx", desc: "Instantly great guitar dynamics.", interface: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=800&auto=format&fit=crop" }
    ]
  },
  {
    id: "khs-essentials",
    name: "Kilohearts Essentials",
    category: "Dynamics & Utility",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1000&auto=format&fit=crop",
    link: "https://kilohearts.com/products/kilohearts_essentials",
    blurb: "A versatile snap-in ecosystem. Clean, efficient, and powerful tools for modern sound design.",
    plugins: [
      { name: "Snap Heap", desc: "The modular container for all Kilohearts effects.", interface: "https://images.unsplash.com/photo-1558403194-611308249627?q=80&w=800&auto=format&fit=crop" },
      { name: "Multipass", desc: "Multi-band modular processing power.", interface: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop" }
    ]
  },
  {
    id: "valhalla-super",
    name: "Valhalla Supermassive",
    category: "Reverb & Delay",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop",
    link: "https://valhalladsp.com/shop/reverb/valhalla-supermassive/",
    blurb: "Massive echoes, lush reverbs, and strange space-time modulations. Completely free and otherworldly.",
    plugins: [
      { name: "Supermassive", desc: "The ultimate space machine.", interface: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop" }
    ]
  },
  {
    id: "serum",
    name: "Xfer Records Serum",
    category: "Instruments",
    image: "https://images.unsplash.com/photo-1514525253344-f814d074358a?q=80&w=1000&auto=format&fit=crop",
    link: "https://xferrecords.com/products/serum",
    blurb: "Wavetable synthesizer with a high-quality sound and visual workflow. The backbone of modern bass music.",
    plugins: [
      { name: "Serum", desc: "Advanced wavetable synthesis.", interface: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800&auto=format&fit=crop" },
      { name: "SerumFX", desc: "The effects rack of Serum as a standalone plugin.", interface: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop" }
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