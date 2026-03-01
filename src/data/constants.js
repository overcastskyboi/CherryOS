export const ANIME_DATA = {
  catalogue: [
    {
      title: "Berserk",
      type: "Manga",
      score: 9.5,
      progress: "376+ Ch",
      status: "Reading"
    },
    {
      title: "Hunter x Hunter (2011)",
      type: "Anime",
      score: 10,
      progress: "148 Eps",
      status: "Completed"
    },
    {
      title: "Fullmetal Alchemist: Brotherhood",
      type: "Anime",
      score: 10,
      progress: "64 Eps",
      status: "Completed"
    },
    {
      title: "Steins;Gate",
      type: "Anime",
      score: 10,
      progress: "24 Eps",
      status: "Completed"
    },
    {
      title: "Vinland Saga Season 2",
      type: "Anime",
      score: 10,
      progress: "24 Eps",
      status: "Completed"
    },
    {
      title: "Monster",
      type: "Anime",
      score: 9.5,
      progress: "74 Eps",
      status: "Completed"
    },
    {
      title: "Vagabond",
      type: "Manga",
      score: 10,
      progress: "327 Ch",
      status: "Hiatus"
    },
    {
      title: "Chainsaw Man",
      type: "Manga",
      score: 9,
      progress: "170+ Ch",
      status: "Reading"
    }
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
    "Waves Renaissance Bundle: RChannel, RCompressor, RVox",
    "Kilohearts (kHs) Essentials: kHs Dynamics, kHs Limiter, kHs Transient Shaper, kHs Gain, kHs Gate",
    "Tokyo Dawn Labs: TDR Nova",
    "TBProAudio: dEQ6V4, dpMeter5, dpMeterXT3, DSEQ3, DynaRide2, Euphonia3, FinalLoud3, GainRider3, LAxLimit4, mvMeter2, SLM2V2",
    "Individual: CLA-2A, ClipShifter, CS5501V2, Fresh Air, MJUCjr, OTT, Soothe2, Vocal Rider"
  ],
  "EQ & Filters": [
    "Waves Renaissance EQ: REQ 2, REQ 4, REQ 6",
    "Kilohearts (kHs) Filters: kHs 3-Band EQ, kHs Filter, kHs Ladder Filter, kHs Formant Filter",
    "TBProAudio: gEQ12V4, sTiltV2"
  ],
  "Reverb & Delay": [
    "Valhalla Suite: Valhalla Delay, Valhalla Shimmer, Valhalla SpaceModulator, Valhalla Supermassive, Valhalla UberMod, Valhalla VintageVerb",
    "Kilohearts (kHs) Time-Based Effects: kHs Chorus, kHs Ensemble, kHs Flanger, kHs Phaser, kHs Delay, kHs Dual Delay, kHs Frequency Shifter, kHs Phase Distortion, kHs Ring Mod, kHs Reverb",
    "Waves Reverb: IR-L (Efficient/Full), RVerb",
    "Individual: Clarity Vx DeReverb, SparkVerb, TAL Reverb 4"
  ],
  "Vocal & Utility": [
    "Waves Vocal Tools: Clarity Vx, Silk Vocal, Waves Tune LT, RDeEsser",
    "Antares: Auto-Tune",
    "Kilohearts (kHs) Pitch/Utility: kHs Pitch Shifter, kHs Tape Stop, kHs Haas, kHs Stereo",
    "Individual: Curves Equator, HoRNetSongKeyMK2, ABLM2, AMM2, ISOL8"
  ],
  "Saturation, Tone & Instruments": [
    "Kilohearts (kHs) Creative/Synth: kHs Bitcrush, kHs Distortion, kHs Reverser, kHs Resonator, kHs Shaper, kHs Trance Gate",
    "Xfer Records: Serum",
    "Individual: Abbey Road Saturator, Drip, RBass, Super VHS, Spitfire LABS, TyrellN6, UVIWorkstation"
  ]
};

export const VST_DETAILS = [
  {
    name: "Waves Renaissance Bundle",
    category: "Dynamics & Mixing",
    image: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?q=80&w=1000&auto=format&fit=crop",
    link: "https://www.waves.com/bundles/renaissance-maxx",
    blurb: "The classic 'R' series. Warm, musical, and incredibly simple to use for professional vocal and instrument processing."
  },
  {
    name: "Valhalla Supermassive",
    category: "Reverb & Delay",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop",
    link: "https://valhalladsp.com/shop/reverb/valhalla-supermassive/",
    blurb: "Designed from the ground up for massive delays and reverbs. Lush, ethereal, and completely free."
  },
  {
    name: "Kilohearts Essentials",
    category: "Dynamics & Utility",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1000&auto=format&fit=crop",
    link: "https://kilohearts.com/products/kilohearts_essentials",
    blurb: "A huge collection of high-quality effects covering everything from dynamics to pitch shifting. Extremely CPU efficient."
  },
  {
    name: "Xfer Records Serum",
    category: "Instruments",
    image: "https://images.unsplash.com/photo-1514525253344-f814d074358a?q=80&w=1000&auto=format&fit=crop",
    link: "https://xferrecords.com/products/serum",
    blurb: "The industry-standard wavetable synthesizer. High-quality sound, visual and creative workflow, and a deep feature set."
  },
  {
    name: "Tokyo Dawn TDR Nova",
    category: "EQ & Mixing",
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=1000&auto=format&fit=crop",
    link: "https://www.tokyodawnlabs.com/tdr-nova/",
    blurb: "A parallel dynamic equalizer. Appearing as a parametric equalizer, each band also includes a full featured dynamics section."
  },
  {
    name: "Soothe2",
    category: "Mixing",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop",
    link: "https://oeksound.com/plugins/soothe2/",
    blurb: "A dynamic resonance suppressor. It identifies problematic resonances on the fly and applies matching reduction automatically."
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